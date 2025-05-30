#pragma once
#ifdef DEBUG
    #include <type_traits>
   struct assert_is_root_namespace;
   static_assert(std::is_same<assert_is_root_namespace, ::assert_is_root_namespace>::value, "Not root namespace. Check includes.");
#endif

#include "ripemd160.h"
#include "sha256.h"
#include "ec.h"

namespace scriptv {

    using namespace std;

    using hasher_t = crypto::ripemd160;
    using hash_t = hasher_t::value_type;
    using sigmsg_hasher_t = crypto::sha256;
    using sigmsg_hash_t = sigmsg_hasher_t::value_type;
    using keys = crypto::ec::keys;
    using keys_t = keys;
    using pubkey_t = keys_t::pub_t;
    using pub_t = pubkey_t;
    using privkey_t = keys_t::priv_t;
    using priv_t = privkey_t;
    using sig_t = crypto::ec::sig_t;

}

namespace scriptv::crypto {

    using namespace scriptv;

}

