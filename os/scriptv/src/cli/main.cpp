#include <iostream>
#include <thread>
#include <csignal>

#include <scriptv/cli/hmi.h>
#include <scriptv/cli/params.h>
#include <scriptv/io/screen.h>

#define loglevel "scriptv"
#define logclass "main"
#include <scriptv/logs.inc>

using namespace scriptv;
using namespace std;

using scriptv::io::screen;
using scriptv::io::shell_args;
using scriptv::cli::params;
using scriptv::ko;
using scriptv::ok;

struct hmi_t: scriptv::cli::hmi {
    using b = scriptv::cli::hmi;

public:
    using b::hmi;
    ~hmi_t() override {}

    void setup_signals(bool on) override;

};

hmi_t* hmi{nullptr};

bool killed{false};

void sig_handler(int s) {
    {
        screen::lock_t lock(hmi->scr, true);
        lock.os << "main: received signal " << s << '\n';
        lock.os << "stopping ...\n";
    }
//    hmi->stop();
    hmi->setup_signals(false);
    killed = true;
}

void hmi_t::setup_signals(bool on) {
    b::setup_signals(on);
    if (on) {
        signal(SIGINT, sig_handler);
        signal(SIGTERM, sig_handler);
    }
    else {
        signal(SIGINT, SIG_DFL);
        signal(SIGTERM, SIG_DFL);
    }
}

int main(int argc, char** argv) {
    params p(shell_args(argc, argv));
    #if CFG_LOGS == 1
        scriptv::dbg::thread_logger::set_root_logdir(p.logd);
    #endif
    log_pstart(argv[0]);
    log_start("", "main");
    log("hardware concurrency", thread::hardware_concurrency());

    hmi = new hmi_t(p, cout);
    string r = hmi->run();
    log("end");
    delete hmi;
    hmi = nullptr;
    hmi_t::process_cleanup();
    if (killed) { //https://people.freebsd.org/~cracauer/homepage-mirror/sigint.html
        kill(getpid(), SIGINT);
        return 3;
    }
    return r.empty() ? 0 : 1;
}
