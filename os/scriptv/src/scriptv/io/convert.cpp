#include "convert.h"

namespace c = scriptv::io;
using namespace c;

template<> string c::convert(const string& s) {
    return s;
}

template<> priv_t c::convert(const string& s) {
    return priv_t::from_b58(s);
}

template<> pub_t c::convert(const string& s) {
    return pub_t::from_b58(s);
}

