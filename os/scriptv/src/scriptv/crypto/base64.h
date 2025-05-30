#pragma once
#include <iostream>
#include <string>

namespace scriptv::crypto::b64 {

    using namespace std;

    string encode_string(const string&);
    string decode_string(const string&);

}

