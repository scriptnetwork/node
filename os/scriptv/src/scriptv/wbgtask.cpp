#include <functional>

#include "bgtask.h"

#define loglevel "gov"
#define logclass "wbgtask"
#include <scriptv/logs.inc>

#if CFG_LOGS__CONCUR == 0
    #if CFG_LOGS == 1
        #undef log
        #define log (void)sizeof
    #endif
#endif

using namespace scriptv;
using c = scriptv::wbgtask;
using namespace chrono;

c::wbgtask(function<void ()> onwakeup): b(bind(&c::run, this), onwakeup) {
}

c::~wbgtask() {
}

void c::run() {
    task_init();
    while (isup()) {
        task();
        collect_();
    }
    task_cleanup();
}

void c::collect_() {
    if (reset_wait()) {
        return;
    }
    collect();
    reset_wait();
    return;
}


