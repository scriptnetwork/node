#pragma once
#include <stdint.h>
#include <stdlib.h>
#include <string>
#include <cassert>
#include <cstring>
#include <array>
#include <iostream>
#include <vector>
#include <random>

#include <scriptv/config.h>

namespace scriptv::crypto {

    using namespace std;

    class ripemd160 {
    public:
        static constexpr size_t output_size = 20;
        static constexpr size_t mem_size = 20;

        struct value_type: array<uint8_t, output_size> {
            using b = array<uint8_t, output_size>;
            using hasher_t = ripemd160;

            static const value_type zero_;

            value_type();
            value_type(const value_type&);
            explicit value_type(unsigned int);
            explicit value_type(const string& b58);

            bool operator == (const value_type&) const;
            bool operator != (const value_type&) const;
            bool operator < (const value_type&) const;
            void set(unsigned int);
            value_type& operator = (const string& b58);
            value_type& operator = (unsigned int);
            bool is_zero() const;
            bool is_not_zero() const;
            void zero();
            string to_b58() const;
            string encode() const;
            string encode_path() const;
            pair<string, string> filename() const;
            string to_hex() const;
            static value_type from_b58(const string&);
            static value_type from_hex(const string&);
            bool set_b58(const string&);
            bool set_hex(const string&);
            uint32_t uint32() const;
            size_t ser_sz() const;
            unsigned char* write_to(uint8_t*) const;
            const unsigned char* read_from(const uint8_t* begin, const uint8_t* end);
            ko read(istream&);
            ko fill_random();
            void fill_random(mt19937&);
            uint32_t lsdw() const { return *reinterpret_cast<const uint32_t*>(&data()[mem_size - 4]); } //less significant dword

            template<typename T>
            static value_type compute(const T& o) {
                ripemd160 hasher;
                hasher.write(o);
                value_type r;
                hasher.finalize(r);
                return move(r);
            }

            template<typename T1, typename T2>
            static value_type compute(const T1& o1, const T2& o2) {
                ripemd160 hasher;
                hasher.write(o1);
                hasher.write(o2);
                value_type r;
                hasher.finalize(r);
                return move(r);
            }
        };

        ripemd160();

        void write(const vector<uint8_t>&);
        void write(const uint8_t* data, size_t len);
        void write(const value_type&);
        void write(const string&);
        void write(const uint64_t&);
        void write(const int64_t&);
        void write(const uint32_t&);
        void write(const int32_t&);
        void write(const uint8_t&);
        void write(bool);
        void write(const double&);
        void finalize(unsigned char hash[output_size]);
        void finalize(value_type&);
        void reset();
        static pair<ko, value_type> digest_file(const string& file);
        static value_type digest(const vector<uint8_t>& buf);
        static value_type digest(const string&);

    private:
        uint32_t s[5];
        unsigned char buf[64];
        uint64_t bytes;
        static const unsigned char pad[64];
    };

    inline ostream& operator << (ostream& os, const ripemd160::value_type& v) {
        os << v.to_b58();
        return os;
    }

    template<typename T>
    inline scriptv::crypto::ripemd160& operator << (ripemd160& h, const T& v) {
        h.write(v);
        return h;
    }

    inline istream& operator >> (istream& is, ripemd160::value_type& v) {
        string s;
        is >> s;
        if (!v.set_b58(s)) is.setstate(ios_base::failbit);
        return is;
      }

}

namespace std {

    template <>
    struct hash<scriptv::crypto::ripemd160::value_type> {
        size_t operator()(const scriptv::crypto::ripemd160::value_type& k) const {
            return *reinterpret_cast<const size_t*>(&k[0]);
        }
    };

}

