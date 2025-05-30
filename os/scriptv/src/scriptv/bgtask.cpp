#include <cassert>

#include "types.h"
#include "config.h"
#include "bgtask.h"

#define loglevel "lib"
#define logclass "bgtask"
#include <scriptv/logs.inc>

#if CFG_LOGS__CONCUR == 0
    #if CFG_LOGS == 1
        #undef log
        #define log (void)sizeof
    #endif
#endif

using namespace scriptv;
using c = scriptv::bgtask;

const char* c::KO_81021 = "KO 81021 Ready status never reached.";

c::bgtask(): run([]{}), onwakeup([]{}) {
}

c::bgtask(function<void()> run, function<void()> onwakeup): run(run), onwakeup(onwakeup) {
}

c::~bgtask() {
    join();
    assert(th == nullptr);
}

void c::set_run_function(function<void()> r) {
    run = r;
}

ko c::start() {
    log("start");
    if (active) {
        log("already started");
        return ok;
    }
    reset();
    active = true;
    delete th;
    th = new thread(&c::run_, this);
    return ok;
}

ko c::wait_ready(int seconds_deadline) const {
    return wait_ready(chrono::system_clock::now() + chrono::seconds(seconds_deadline));
}

ko c::wait_ready(const time_point& deadline) const {
    log("wait_ready");
    unique_lock<mutex> lock(mx_ready);
    if (ready) {
        return ok;
    }
    cv_ready.wait_until(lock, deadline, [&]{ return ready || isdown(); });
    return ready ? ok : KO_81021;
}

void c::stop() {
    log("stop");
    if (!active) {
        log("already stopped");
        return;
    }
    log("stopping");
    resume.store(state_exit);
    task_wakeup();
    return;
}

void c::join() {
    log("join");
    if (th != nullptr) {
        th->join();
        delete th;
        th = nullptr;
        resume.store(state_idle);
    }
}

void c::run_() {
    {
        lock_guard<mutex> lock(mx_ready);
        ready = true;
        cv_ready.notify_all();
    }
    run();
    {
        lock_guard<mutex> lock(mx_ready);
        ready = false;
    }
    active = false;
    on_stop();
}

bool c::reset_wait() {
    short r = resume.load();
    if (r > state_idle) {
        if (r == state_pending_work) resume.store(state_idle);
        log("reset_wait", true);
        return true;
    }
    log("reset_wait", false);
    return false;
}

void c::task_wakeup() {
    log("wakeup");
    reset_resume();
    onwakeup();
}

bool c::reset_resume() { //resume state is anything !=0
    log("reset resume");
    short r = resume.load();
    if (r == state_idle) { // behaviour was 'next call to wait will actually wait'
        resume.store(state_pending_work); // behavior is 'next call to wait won't wait at all and proceed immediately to do work
        return true;
    }
    return false;
}

