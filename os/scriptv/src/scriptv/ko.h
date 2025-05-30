#pragma once
#include <iostream>
#include <string>

namespace scriptv {

    using namespace std;

    using ko_t = char;
    using ko = const ko_t*;
    static constexpr ko ok = nullptr;

    static inline bool is_ko(const string& s) {
        if (s.size() < 3) [[unlikely]] return false;
        return s[0] == 'K' && s[1] == 'O' && s[2] == ' ';
    }

    inline static bool is_ko(ko o) { return o != ok; }
    inline static bool is_ok(ko o) { return o == ok; }

}

