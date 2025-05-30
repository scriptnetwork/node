#include <string>
#include <sstream>
#include "params.h"
#include <scriptv/config.h>

//#define loglevel "wallet/cli"
//#define logclass "params"
//#include <scriptv/logs.inc>

// don't log here, it's used before initializing the logging subsystem

using namespace std;
using namespace scriptv::cli;
using c = scriptv::cli::params;

void c::constructor() {
}

c::params(): args("") {
    constructor();
}

c::params(const shell_args& a): args(a) {
    constructor();
    while(true) {
        string command = args.next<string>();
        if (command == "-home") {
            homedir = args.next<string>();
        }
        else if (command == "-n") {
            names = false;
        }
//        else if (cmd=="-nc") {
//            p.ncurses=true;
//        }
        else if (command == "-log") {
            verbose = true;
        }
        else if (command == "-nolog") {
            nolog = true;
        }
        else if (command == "-logd") {
            logd = args.next<string>();
        }
        else if (command == "-om") {
            uint16_t m = args.next<uint16_t>();
            if (m < num_modes) om = (output_mode)m;
        }
        else if (command == "-nb") {
            banner = false;
        }
        #if CFG_FCGI == 1
        else if (command == "-fcgi") {
           fcgi = true;
        }
        #endif
        else if (!command.empty()) {
            cmd = command;
            break;
        }
        else {
            break;
        }
    }
}

string c::get_home() const {
    ostringstream os;
    if (homedir.empty()) {
        const char* env_p = std::getenv("HOME");
        if (!env_p) {
            cerr << "No $HOME env var defined" << endl;
            exit(1);
        }
        os << env_p << "/" << DATADIR;
    }
    else {
        os << homedir;
    }
    return os.str();
}

void c::dump(ostream& os) const {
    dump("", os);
}

void c::dump(const string& pfx, ostream& os) const {
    os << pfx << "home: " << get_home() << '\n';
    #ifdef DEBUG
        os << pfx << "warning: this is a debug build.\n";
    #else
        os << pfx << "this is an optimized build.\n";
    #endif
    #if CFG_LOGS == 1
        if (verbose) {
            os << pfx << "writing log to cout\n";
        }
        else {
            os << pfx << "warning: logs are ON. Writing files in " << logd << '\n';
        }
    #else
        os << pfx << "logs: disabled.\n";
    #endif
}


