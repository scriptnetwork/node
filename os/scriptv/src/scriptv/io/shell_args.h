#pragma once
#include <string>
#include <sstream>

#include <scriptv/crypto/types.h>

#include "convert.h"
#include "types.h"

namespace scriptv::io {

    struct shell_args final {

        shell_args(int argc, char** argv);
        shell_args(const string& args); //Copies *must* not live longer than the original
        shell_args(const shell_args&);
        ~shell_args();

        shell_args& operator = (const shell_args&);

        template<typename T>
        T test_next() {
            if (n >= argc) {
                return T();
            }
            string i = argv[n];
            return convert<T>(i);
        }

        template<typename T>
        T next() {
            if (n >= argc) {
                return T();
            }
            string i = argv[n++];
            return convert<T>(i);
        }

        template<typename T>
        T next(const T& default_value) {
            if (n >= argc) {
                return default_value;
            }
            string i = argv[n++];
            return convert<T>(i);
        }

        void rew() {
            if (n > 1) --n;
        }

        static hash_t next_token(istream&);
        hash_t next_token();
        string next_line();
        int args_left() const;
        void dump(const string& prefix, ostream&) const;
        void dump(ostream&) const;
        static bool is_root_token(string);

        bool del;
        int argc;
        char** argv;
        int n{1};
    };

}

