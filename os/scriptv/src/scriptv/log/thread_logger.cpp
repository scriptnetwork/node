#include <iostream>

#include <scriptv/config.h>
#include <scriptv/stacktrace.h>

#include "task.h"
#include "thread_logger.h"

using namespace std;
using namespace scriptv::dbg;
using c = scriptv::dbg::thread_logger;

c c::instance;

void c::set_root_logdir(const string& d) {
    instance.root_logdir = d;
}

c::thread_logger(): root_logdir(LOGDIR) {
    tsorig = duration_cast<nanoseconds>(steady_clock::now().time_since_epoch()).count();
}

c::~thread_logger() {
    for (auto&i:*this) delete i.second;
}

void c::log_info(ostream& os) const {
    os << "logs are " << (disabled ? "disabled" : "enabled") << '\n';
    if (!disabled) {
        os << "started ts: " << ts() << '\n';
        os << "log directory: " << root_logdir << "/" << task::pname << "_" << getpid() << '\n';
    }
}

void c::log_stacktrace() const {
    get_task().log_stacktrace();
}

task& c::get_task() {
    auto id = this_thread::get_id();
    lock_guard<mutex> lock(mx);
    auto i = find(id);
    if (i == end()) {
        i = emplace(id, new task(*this)).first;
    }
    return *i->second;
}

const task& c::get_task() const {
    auto id = this_thread::get_id();
    lock_guard<mutex> lock(mx);
    auto i = find(id);
    if (i == end()) {
        print_stacktrace_release(cout);
        cerr << "logs: task not found for this thread. Use log_start before logging." << endl;
        assert(false);
        exit(1);
    }
    return *i->second;
}

task& c::new_task() {
    auto id = this_thread::get_id();
    lock_guard<mutex> lock(mx);
    auto i = find(id);
    if (i == end()) {
        i = emplace(id, new task(*this)).first;
    }
    else {
        auto g = i->second->g;
        delete i->second;
        i->second = new task(*this);
        i->second->g = ++g;
    }
    return *i->second;
}

void c::start(const string& dir, const string& n) {
    assert(!n.empty());
    new_task().start(dir, n);
}

void c::pstart(const string& n) {
    assert(!n.empty());
    task::pname = n;
}

const string& c::get_logdir() const {
    return get_task().logdir;
}

string c::ts() const {
    using namespace chrono;
    uint64_t t = duration_cast<nanoseconds>(steady_clock::now().time_since_epoch()).count();
    ostringstream os;
    os << (void*)t;
    string s = os.str();
    return s;
}

