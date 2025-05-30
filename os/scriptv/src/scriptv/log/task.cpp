#include <iostream>

#include <scriptv/config.h>
#include <scriptv/stacktrace.h>

#include "task.h"
#include "thread_logger.h"

using namespace std;
using namespace chrono;
using namespace scriptv::dbg;
using c = scriptv::dbg::task;

string c::pname;
bool c::verbose = false;
bool c::teecout = false;

c::task(thread_logger& l): logger(l) {
}

c::~task() {
    if (ownlogfile) delete logfile;
}

void c::start(const string& dir, const string& name) {
    assert(!name.empty());
    if (logfile != nullptr) {
        ownlogfile = !verbose;
        return;
    }
    assert(!pname.empty());
    assert(!name.empty());
    string filename;
    if (verbose) {
        logfile = &cout;
    }
    else {
        ostringstream file;
        file << thread_logger::instance.root_logdir << "/" << pname << "_" << getpid();
        if (!dir.empty()) {
            file << '/' << dir;
        }
        logdir = file.str();
        ostringstream cmd;
        cmd << "mkdir -p " << file.str();
        system(cmd.str().c_str());
        file << '/' << name << '_' << this_thread::get_id() << '-' << g;
        filename = file.str();
        logfile = new ofstream(filename, ios::trunc);
        assert(logfile != nullptr);
    }
    (*logfile) << logger.ts() << " start ";
    if (!dir.empty()) {
        (*logfile) << dir << '/';
    }
    (*logfile) << name << '\n';
    if (!logfile->good()) {
        cerr << "KO 73023 Could not open log file " << filename << '\n';
        abort();
    }
    ownlogfile = !verbose;
}

void c::prefix(ostream& os, const thread_logger& l, const string& loglevel_, const string& logclass_) {
    os << l.ts() << ' ' << loglevel_ << ' ' << logclass_ << ' ';
}

void c::log_stacktrace() const {
    print_stacktrace_release(*logfile, 20);
}

template<>
void c::dolog(const vector<unsigned char>& arg1) {
    *logfile << "[bin " << arg1.size() << " bytes] ";
    if (teecout) std::cout << "[bin " << arg1.size() << " bytes] ";
}

