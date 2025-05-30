#pragma once
// stacktrace.h (c) 2008, Timo Bingmann from http://idlebox.net/
// published under the WTFPL v2.0
// Print a demangled stack backtrace of the caller function to FILE* out.
#include <iostream>
#include <stdio.h>
#include <string.h>
#if 0
    /// /////////////////////////// Usage: /////////////////////////////////////////////
#include <us/gov/stacktrace.h>
print_stacktrace(cout);
    /// /////////////////////////// ////// /////////////////////////////////////////////
#endif

#if defined(__GLIBC__)
    #include <stdio.h>
    #include <stdlib.h>
    #include <execinfo.h>
    #include <cxxabi.h>

    static inline void print_stacktrace_release(std::ostream& out, unsigned int max_frames = 10) {
        out << "stack trace:" << std::endl;
        void* addrlist[max_frames+1]; // storage array for stack trace address data
        int addrlen = backtrace(addrlist, sizeof(addrlist) / sizeof(void*)); // retrieve current stack addresses
        if (addrlen == 0) {
            out << "  <empty, possibly corrupt>" << std::endl;
            return;
        }
        char** symbollist = backtrace_symbols(addrlist, addrlen); // resolve addresses into strings containing "filename(function+address)", this array must be free()-ed
        size_t funcnamesize = 256; // allocate string which will be filled with the demangled function name
        char* funcname = (char*)malloc(funcnamesize);
        for (int i = 1; i < addrlen; i++) { // iterate over the returned symbol lines. skip the first, it is the address of this function.
            char *begin_name = 0, *begin_offset = 0, *end_offset = 0;
            for (char *p = symbollist[i]; *p; ++p) { // find parentheses and +address offset surrounding the mangled name: ./module(function+0x15c) [0x8048a6d]
                if (*p == '(') {
                    begin_name = p;
                }
                else if (*p == '+') {
                    begin_offset = p;
                }
                else if (*p == ')' && begin_offset) {
                    end_offset = p;
                    break;
                }
            }
            if (begin_name && begin_offset && end_offset && begin_name < begin_offset) {
                *begin_name++ = '\0';
                *begin_offset++ = '\0';
                *end_offset = '\0';
                int status;
                char* ret = abi::__cxa_demangle(begin_name, funcname, &funcnamesize, &status);
                if (status == 0) {
                    strcpy(funcname, ret);
                    out << "  " << symbollist[i] << " : " << funcname << "+" << begin_offset << std::endl;
                }
                else {
                    out << "  " << symbollist[i] << " : " << begin_name << "()+" << begin_offset << std::endl;
                }
            }
            else {
                out << "  " << symbollist[i] << std::endl;
            }
        }
        free(funcname);
        free(symbollist);
    }

    #ifdef DEBUG
        static inline void print_stacktrace(std::ostream& out, unsigned int max_frames = 10) {
                print_stacktrace_release(out, max_frames);
        }
    #else
        #define print_stacktrace (void)sizeof
    #endif
#else
    #define print_stacktrace_release (void)sizeof
    #define print_stacktrace (void)sizeof
#endif

