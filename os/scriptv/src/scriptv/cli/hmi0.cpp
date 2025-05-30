#include "hmi0.h"
#include <csignal>

#define loglevel "cli"
#define logclass "hmi0"
#include <scriptv/logs.inc>

using namespace scriptv::cli;
using scriptv::ko;
using c = scriptv::cli::hmi0;

c::~hmi0() {
}

void c::setup_signals(bool on) {
    if (on) {
        signal(SIGPIPE, SIG_IGN);
    }
    else {
        signal(SIGPIPE, SIG_DFL);
    }
}
