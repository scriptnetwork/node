#pragma once
#include <string>
#include <sstream>

#include <scriptv/crypto/types.h>

#include "types.h"

namespace scriptv::io {
    using namespace std;

    template<typename T>
    T convert(const string& s) {
        T v;
        istringstream is(s);
        is >> v;
        return move(v);
    }

    template<> string convert(const string&);
    template<> priv_t convert(const string&);
    template<> pub_t convert(const string&);

}
