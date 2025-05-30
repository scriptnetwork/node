#pragma once
#include <unordered_map>
#include <string>
#include <cassert>
#include <thread>
#include <mutex>
#include <fstream>
#include <chrono>
#include <sstream>
#include <sys/types.h>
#include <atomic>
#include <unistd.h>
#include "task.h"
#include <scriptv/config.h>

namespace scriptv::dbg {

    using namespace std;
    using namespace chrono;

    struct thread_logger final: unordered_map<thread::id, task*> {

        thread_logger();
        ~thread_logger();

        task& new_task();
        task& get_task();
        const task& get_task() const;
        void start(const string& dir, const string& n);
        static void pstart(const string& n);

        template<typename... F>
        void log(const string&log_level_, const string&log_class_, const F&... s) {
            get_task().log(log_level_, log_class_, s...);
        }

        template<typename O>
        void logdump(const string&log_level_, const string&log_class_, const O& o) {
            get_task().logdump(log_level_, log_class_, o);
        }

        template<typename O>
        void logdump(const string&log_level_, const string&log_class_, const string&prefix, const O& o) {
            get_task().logdump(log_level_, log_class_, prefix, o);
        }

        static void set_root_logdir(const string& d);
        void log_stacktrace() const;
        const string& get_logdir() const;
        void thread_reused();
        void log_info(ostream&) const;
        string ts() const;

        bool disabled{false};
        uint64_t tsorig;
        mutable mutex mx;
        static thread_logger instance;

        string root_logdir;
    };

}

