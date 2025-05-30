#pragma once
// Copyright (c) 2014 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.
// Original file bitcoin-core:crypto/common.h

#include <stdint.h>

#ifdef __FreeBSD__
    #include <machine/endian.h>
#else
    #include <endian.h>
#endif

namespace scriptv::crypto {

    uint16_t static inline ReadLE16(const unsigned char* ptr) { return le16toh(*((uint16_t*)ptr));}
    uint32_t static inline ReadLE32(const unsigned char* ptr) { return le32toh(*((uint32_t*)ptr));}
    uint64_t static inline ReadLE64(const unsigned char* ptr) { return le64toh(*((uint64_t*)ptr));}
    void static inline WriteLE16(unsigned char* ptr, uint16_t x) { *((uint16_t*)ptr) = htole16(x); }
    void static inline WriteLE32(unsigned char* ptr, uint32_t x) { *((uint32_t*)ptr) = htole32(x); }
    void static inline WriteLE64(unsigned char* ptr, uint64_t x) { *((uint64_t*)ptr) = htole64(x); }
    uint32_t static inline ReadBE32(const unsigned char* ptr) { return be32toh(*((uint32_t*)ptr)); }
    uint64_t static inline ReadBE64(const unsigned char* ptr) { return be64toh(*((uint64_t*)ptr)); }
    void static inline WriteBE32(unsigned char* ptr, uint32_t x) { *((uint32_t*)ptr) = htobe32(x); }
    void static inline WriteBE64(unsigned char* ptr, uint64_t x) { *((uint64_t*)ptr) = htobe64(x); }

}

