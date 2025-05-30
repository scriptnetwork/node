#pragma once
#include <scriptv/config.h>
#include <scriptv/crypto/ripemd160.h>
#include <scriptv/crypto/ec.h>
#include <scriptv/io/screen.h>
#include <scriptv/io/shell_args.h>
#include <scriptv/io/cfg0.h>
#include <scriptv/cli/hmi0.h>

#include "params.h"
//#include "fcgi.h"

namespace scriptv::cli {

    struct hmi: hmi0 {
        using b = hmi0;
        using shell_args = scriptv::io::shell_args;
        using screen = scriptv::io::screen;
        using hasher_t = scriptv::crypto::ripemd160;
        using hash_t = hasher_t::value_type;
        using pub_t = scriptv::crypto::ec::keys::pub_t;

    public:
        static const char *KO_11000, *KO_10020, *KO_10021, *KO_91810, *KO_40322;

    public:
        hmi(ostream&);
        hmi(const params&, ostream&);
        hmi(const shell_args&, ostream&);
        hmi(int argc, char** argv, ostream&);
        ~hmi() override;

        void constructor();

    public:
        static void banner(const params&, ostream&);
        void interactive_shell();
        string run(); // empty ok; otw KO
        string run_();
        ko exec(const string& cmdline);
        ko exec_offline(const string& cmd, shell_args& args);
        static void help(const params& p, ostream&);
        virtual void setup_signals(bool on);
        void set_mute(bool);

        virtual pair<ko, io::cfg0> load_cfg(const string& home) const;
        static void process_cleanup();

    public:
        void read_stdin(vector<unsigned char>& input);
        ko exec_offline__b58(shell_args&);
        ko exec_offline__hex(shell_args&);
        ko exec_offline__ec(shell_args& args);

        ko read_input(shell_args& args, vector<unsigned char>& payload);

    public:
        virtual string rewrite(ko r) const;

    public:
        ko mine_public_key(const string& pattern, ostream&); //vanity addresses
        ko digest_file(const string& file, ostream&);

        ko handle_sign(const vector<uint8_t>& msg, const priv_t&, pub_t&, sig_t&);
        ko handle_priv_key(const priv_t&, pub_t&, hash_t& addr);
        ko handle_gen_keys(priv_t&, pub_t&, hash_t& addr);
        ko handle_verify(const vector<uint8_t>& msg, const pub_t&, const sig_t&, uint8_t& result);
        ko handle_pub_key(const pub_t&, hash_t&);

        bool check_address_b58(const string& input) const;
        bool check_address_hex(const string& input) const;

    public:
        string home;
        mutable screen scr;
        bool interactive{false};
        params p;
        io::cfg0* cfg{nullptr};
        hash_t cur{0};
        string curpro;

    public:
        #if CFG_FCGI == 1
            Fastcgipp::Manager<fcgi_t>* fcgi{nullptr};
            void run_fcgi(const params&);
        #endif

    public:
        #if CFG_LOGS == 1
            string logdir;
        #endif
    };

}

