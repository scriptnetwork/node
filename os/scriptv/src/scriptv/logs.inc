#pragma once

#ifndef HAVE_CFG
    error, #include <scriptv/config.h> before this file.
#endif
#include <string>
#include <iostream>

#include <scriptv/log/thread_logger.h>

template<typename type1>
void scrout(const type1& arg1) {
    std::cout << arg1 << '\n';
}

template<typename type1, typename... types>
void scrout(const type1& arg1, const types& ... args) {
    std::cout << arg1 << ' ';
    scrout(args...);
}

#if CFG_LOGS == 1
    template<typename... F>
    static void log_(const F&... s) {
        if (scriptv::dbg::thread_logger::instance.disabled) return;
        scriptv::dbg::thread_logger::instance.log(loglevel, s...);
    }

    template<typename O>
    static void logdump(const O& o) {
        if (scriptv::dbg::thread_logger::instance.disabled) return;
        scriptv::dbg::thread_logger::instance.logdump(loglevel, logclass, o);
    }

    template<typename O>
    static void logdump(const std::string& prefix, const O& o) {
        if (scriptv::dbg::thread_logger::instance.disabled) return;
        scriptv::dbg::thread_logger::instance.logdump(loglevel, logclass, prefix, o);
    }

    static void log_start(const std::string& dir, const std::string& n) {
        assert(!n.empty());
        if (scriptv::dbg::thread_logger::instance.disabled) return;
        scriptv::dbg::thread_logger::instance.start(dir, n);
    }

    static void log_pstart(const std::string& n) {
        assert(!n.empty());
        if (scriptv::dbg::thread_logger::instance.disabled) return;
        auto i = n.find_last_of('/');
        if (i == std::string::npos) {
            scriptv::dbg::thread_logger::instance.pstart(n);
        }
        else {
            scriptv::dbg::thread_logger::instance.pstart(n.substr(i + 1));
        }
    }

    static void log_stacktrace() {
        if (scriptv::dbg::thread_logger::instance.disabled) return;
        scriptv::dbg::thread_logger::instance.log_stacktrace();
    }

    static void log_info(std::ostream&os) {
        scriptv::dbg::thread_logger::instance.log_info(os);
    }

    static const std::string& log_dir() {
        return scriptv::dbg::thread_logger::instance.get_logdir();
    }

    #define log(...) log_(__FILE__, __LINE__, __VA_ARGS__)

    template<typename t>
    void tee(const t& s) {
        log(s);
        std::cout << s << '\n';
    }

    template<typename type1, typename... types>
    void tee(const type1& arg1, const types& ... args) {
        log(arg1, args...);
        scrout(arg1, args...);
        std::cout << '\n';
    }

#else

    #define log (void)sizeof
    #define logdump (void)sizeof
    #define log_start (void)sizeof
    #define log_pstart (void)sizeof
    #define log_stacktrace (void)sizeof
    #define log_info (void)sizeof
    #define log_dir (void)sizeof

    template<typename t>
    void tee(const t& s) {
        std::cout << s << '\n';
    }

    template<typename type1, typename... types>
    void tee(const type1& arg1, const types& ... args) {
        scrout(arg1, args...);
        std::cout << '\n';
    }

#endif
