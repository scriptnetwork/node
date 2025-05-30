#pragma once
#include <iostream>
#include <string>
#include <stdio.h>
#include <crypto++/gcm.h>
#include <crypto++/aes.h>
#include <crypto++/osrng.h>

#include <scriptv/config.h>

#include "ec.h"

namespace scriptv::crypto {

    using namespace std;
    using CryptoPP::AutoSeededRandomPool;
    using CryptoPP::GCM;
    using CryptoPP::AES;

    struct symmetric_encryption {
        using keys = ec::keys;
        using byte = unsigned char;

        static constexpr size_t key_size = AES::DEFAULT_KEYLENGTH; //16;  // AES-128
        static constexpr size_t iv_size = 12; // Recommended for GCM
        static constexpr int tag_size = 16;   // Authentication tag size -MAC-

        ko init(const keys::priv_t&, const keys::pub_t&);
        ko encrypt(const vector<unsigned char>& cleartext_buf, vector<unsigned char>& ciphertext, size_t ciphertext_offset);

        ko decrypt(const unsigned char* p, size_t sz, vector<unsigned char>& dest);
        ko decrypt(const vector<unsigned char>& ciphertext, vector<unsigned char>& clear);

        AutoSeededRandomPool prng_;
        byte key_[key_size];
    };

}
