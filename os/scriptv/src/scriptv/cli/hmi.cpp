#include <string>

#include <scriptv/config.h>
#include <scriptv/vcs.h>
#include <scriptv/crypto/base58.h>
#include <scriptv/io/cfg0.h>
#include <scriptv/cli/hmi.h>

#include "types.h"
#include "hmi.h"

#define loglevel "cli"
#define logclass "hmi"
#include <scriptv/logs.inc>

using namespace std;
using namespace scriptv;
using namespace scriptv::cli;
using c = scriptv::cli::hmi;


const char* c::KO_11000 = "KO 11000 Invalid command.";
const char* c::KO_10020 = "KO 10020 Feature not available in RPC mode.";
const char* c::KO_10021 = "KO 10021 Feature only available in RPC mode.";
const char* c::KO_91810 = "KO 91810 Not an offline command.";
const char* c::KO_40322 = "KO 40322 Not implemented.";

c::hmi(ostream& os): scr(os) {
    log("arguments os:");
    constructor();
}

c::hmi(int argc, char** argv, ostream& os): scr(os), p(shell_args(argc, argv)) {
    log("arguments argc argv os:");
    constructor();
}

c::hmi(const params& p, ostream& os): scr(os), p(p) {
    log("arguments p os:");
    constructor();
}

c::hmi(const shell_args& a, ostream& os): scr(os), p(a) {
    log("arguments a os:");
    constructor();
}

void c::constructor() {
    logdump(p.args);
    home = p.get_home();
}

c::~hmi() {
    delete cfg;
    #if CFG_FCGI == 1
        delete fcgi;
    #endif
}

pair<ko, io::cfg0> c::load_cfg(const string& home) const {
    return io::cfg0::load(home);
}

void c::banner(const params& p, ostream& os) {
    using namespace std::chrono;
    string ind = "    ";
    os << PLATFORM << ". Copyright (C) " << CFG_COPYRIGHT_LINE << '\n';
    os << ind << CFG_COPYRIGHT_LINE2 << '\n';
    os << ind << CFG_COPYRIGHT_LINE3 << '\n';
    os << ind << "version: " << scriptv::vcs::version() << '\n';
    os << ind << "Build configuration: ";
    #if CFG_LOGS == 1
        os << "[with logs] ";
        if (p.nolog) {
            os << "[disabled] ";
        }
        if (p.verbose) {
            os << "[logs to screen] ";
        }
        os << "[logdir " << p.logd << "] ";
    #else
        os << "[without logs] ";
    #endif
    #ifdef DEBUG
        os << "[debug build] ";
    #else
        os << "[optimized build] ";
    #endif
    os << '\n';
    os << ind << "Parameters:\n";
    p.dump(ind + "    ", os);
}

namespace {

    template<typename t>
    string tostr(const t& o) {
        ostringstream os;
        os << " [" << o << ']';
        return os.str();
    }

    template<>
    string tostr(const bool& o) {
        ostringstream os;
        os << " [" << boolalpha << o << ']';
        return os.str();
    }

}

//static void twocol(const string& prefix, const string_view& left, const string_view& right, ostream&);
//static void twocol(const string& prefix, const string_view& left, const string_view& right, const string_view& r2, ostream&);

namespace fmt {
    vector<string> fit(const string_view& s, int w, bool left) {
        vector<string> lines;
        auto x = s;
        while(true) {
            if (x.empty()) break;
            auto s1 = x.substr(0, w);
            auto s2 = x.size() > w ? x.substr(w) : "";
            lines.push_back(string(s1));
            x = s2;
        }
        if (left) {
            for (auto& i: lines) {
                i = i + string(w - i.size(), ' ');
            }
        }
        else {
            for (auto& i: lines) {
                i = string(w - i.size(), ' ') + i;
            }
        }
        return move(lines);
    }

    void twocol(const string& prefix, const string_view& l, const string_view& r, const string_view& r2, ostream& os) {
        static const int w{80};
        vector<string> l1 = fit(l, w, true);
        vector<string> l2;
        {
            ostringstream os2;
            os2 << r << '.' << r2;
            l2 = fit(os2.str(), w, true);
        }
        auto l1i = l1.begin();
        auto l2i = l2.begin();
        while(true) {
            if (l2i == l2.end() && l1i == l1.end()) break;
            if (l1i == l1.begin()) {
                os << prefix;
            }
            else {
                os << string(prefix.size(), ' ');
            }
            if (l1i != l1.end()) {
                 if (l1i != l1.begin()) os << "    ";
                 os << *l1i;
                 ++l1i;
            }
            else {
                os << string(w, ' ');
            }
            os << "  ";
            if (l2i != l2.end()) {
                 if (l2i != l2.begin()) os << "    ";
                 os << *l2i;
                 ++l2i;
            }
            os << '\n';
        }
    }

    void twocol(const string& prefix, const string_view& l, const string_view& r, ostream& os) {
        static constexpr string_view e;
        twocol(prefix, l, r, e, os);
    }
}

void c::help(const params& p, ostream& os) { //moved
    if (p.banner) {
        banner(p, os);
    }
    os << "Usage: " << PLATFORM << "-wallet [options] [command]\n";
    os << "Options:\n";
    string ind = "    ";
    string ind____ = ind + "    ";
    fmt::twocol(ind, "General parameters:", "", os);
    fmt::twocol(ind____, "-home <homedir>", "homedir", tostr(p.get_home()), os);
    #if CFG_FCGI == 1
        fmt::twocol(ind____, "-fcgi", "Behave as a fast-cgi program. requires -d", tostr(p.fcgi ? "yes" : "no"), os);
    #endif
    #if CFG_LOGS == 1
        fmt::twocol(ind____, "-log", "Logs in screen.", os);
        fmt::twocol(ind____, "-logd <dir>", "Directory for writting log files.", os);
        fmt::twocol(ind____, "-nolog ", "Disable logs.", os);
    #endif
    fmt::twocol(ind____, "-n", "Omit field names in output", tostr(p.names), os);
    fmt::twocol(ind____, "-nb", "Don't show the banner.", os);
    os << '\n';
    os << "Commands:\n";
    fmt::twocol(ind, "misc:", "----------", os);
    fmt::twocol(ind____, "version", "Print software version.", os);
    os << '\n';
    fmt::twocol(ind, "keys:", "----------", os);
/*
    fmt::twocol(ind____, "address new", "Generates a new key-pair, adds the private key to the wallet and prints its asociated address", os);
    fmt::twocol(ind____, "address add <privkey>", "Imports a given private key in the wallet", os);
    fmt::twocol(ind____, "list [show_priv_keys=0|1]", "Lists all keys. Default value for show_priv_keys is 0", os);
    fmt::twocol(ind____, "gen_keys", "Generates a key pair without adding them to the wallet.", os);
    fmt::twocol(ind____, "mine_public_key <string>", "Creates a vanity address containing the specified string", os);
    fmt::twocol(ind____, "priv_key <private key>", "Gives information about the given private key", os);
    fmt::twocol(ind____, "pub_key <public key>", "Gives information about the given public key", os);
    fmt::twocol(ind____, "digest <filename>", "Computes RIPEMD160+base58 to the content of the file.", os);
    fmt::twocol(ind____, "sign -f <filename> <private key>", "Sign file.", os);
    fmt::twocol(ind____, "sign \"<message>\" <private key>", "Sign message", os);
    fmt::twocol(ind____, "verify -f <filename> <pubkey> <signature>", "Verify signed file.", os);
    fmt::twocol(ind____, "verify \"<message>\" <pubkey> <signature>", "Verify signed message", os);
    fmt::twocol(ind____, "encrypt -f <filename> <sender_private_key> <recipient_public_key>", "Encrypts file.", os);
    fmt::twocol(ind____, "encrypt \"<message>\" <sender_private_key> <recipient_public_key>", "Encrypts message", os);
    fmt::twocol(ind____, "decrypt \"<b58>\" <sender_public_key> <recipient_private_key>", "Decrypts message", os);
    fmt::twocol(ind____, "hash add <hash1> <hash2>", "Results in RIPEMD160(hash1, hash2).", os);
    fmt::twocol(ind____, "encode <file>", "Prints the content of a file in Base58 encoding.", os);
*/
    fmt::twocol(ind____, "b58 <cmd>", "Base58 Functions.", os);
    fmt::twocol(ind____, "    encode/decode <filename>", "B58 Encode the content of the given filename.", os);
    fmt::twocol(ind____, "    encode/decode - ", "B58 Encode the input captured from cin (pipes).", os);
    fmt::twocol(ind____, "    encode/decode -l msg", "B58 Encode the next argument.", os);
    fmt::twocol(ind____, "    check_address <address_b58>", "checks if it is a base58 ripemd160 address.", os);
    fmt::twocol(ind____, "hex <cmd>", "Hex Functions.", os);
    fmt::twocol(ind____, "    encode/decode <filename>", "Hex Encode the content of the given filename.", os);
    fmt::twocol(ind____, "    encode/decode -", "Hex Encode the input captured from cin (pipes).", os);
    fmt::twocol(ind____, "    encode/decode -l msg", "Hex Encode the next argument.", os);
    fmt::twocol(ind____, "    check_address <address_hex>", "checks if it is an hex address.", os);
    fmt::twocol(ind____, "ec <cmd>", "Sign and Verify using EC secp256k1.", os);
    fmt::twocol(ind____, "    gen_keys", "Generate private key and print it along with public key and address", os);
    fmt::twocol(ind____, "    sign <message_b58> <private_key>", "Sign message", os);
    fmt::twocol(ind____, "    verify <message_b58> <signature> <public_key>", "Verify signed message", os);
    fmt::twocol(ind____, "    priv_key <private_key_b58>", "calculates addresses and public keys", os);
    fmt::twocol(ind____, "    priv_key_hex <private_key_hex>", "calculates addresses and public keys", os);
    fmt::twocol(ind____, "    pub_key <public_key_b58>", "calculates address", os);
    os << '\n';
    fmt::twocol(ind, "Software:", "----------", os);
    fmt::twocol(ind____, "version", "Print version.", os);
    fmt::twocol(ind____, "h|-h|help|-help|--help", "This help screen", os);
    os << '\n';
}

void c::read_stdin(vector<unsigned char>& input) {
    input.reserve(20);
    unsigned char ch;
    while (std::cin.get(reinterpret_cast<char&>(ch))) {
        input.push_back(ch);
    }
    if (input[input.size()-1] == '\n') {
        input.resize(input.size() - 1); //remove trailing enter
    }
}

ko c::read_input(shell_args& args, vector<unsigned char>& payload) {
    auto file = args.next<string>();
    if (file == "-") {
        read_stdin(payload);
    }
    else if (file == "-l") {
        auto line = args.next_line();
        io::cfg0::trim(line);
        payload = vector<unsigned char>(line.begin(), line.end());
    }
    else {
        auto r = io::read_file_(file, payload);
        if (is_ko(r)) {
            return r;
        }
    }
    if (payload.empty()) {
        auto r = "KO 60382 Empty payload";
        log(r);
        return r;
    }
    return ok;
}

namespace {

    string strip_0x(const string& inp) {
        int offset = 0;
        if (inp.size() > 2) {
            if (inp[0] == '0' && inp[1] == 'x') offset = 2;
        }
        return string(inp.begin() + offset, inp.end());
    }


    template<typename t>
    vector<unsigned char> decode_hex(const t& payload) {
        int offset = 0;
        if (payload.size() > 2) {
            if (payload[0] == '0' && payload[1] == 'x') offset = 2;
        }
        return crypto::b58::from_hex(string(payload.begin() + offset, payload.end()));
    }

}

#include <string>
#include <string_view>
#include <cctype>

bool c::check_address_hex(const string& input) const {
    std::string_view addr(input);
    // Remove optional "0x" or "0X" prefix.
    if (addr.starts_with("0x") || addr.starts_with("0X")) {
        addr.remove_prefix(2);
    }
    // Ethereum addresses should have exactly 40 hexadecimal characters.
    if (addr.size() != 40) {
        return false;
    }
    // Check each character to ensure it's a valid hexadecimal digit.
    for (char c : addr) {
        if (!std::isxdigit(static_cast<unsigned char>(c))) {
            return false;
        }
    }
    return true;
}

bool c::check_address_b58(const string& input) const {
    auto v = scriptv::crypto::b58::decode(input);
    if (v.size() != 20) [[unlikely]] return false;
    return true;
}


ko c::exec_offline__hex(shell_args& args) {
    auto cmd = args.next<string>();
    if (cmd == "encode") {
        vector<unsigned char> payload;
        auto r = read_input(args, payload);
        if (is_ko(r)) {
            return r;
        }
        auto s = crypto::b58::to_hex(payload);
        screen::lock_t lock(scr, interactive);
        lock.os << s << '\n';
        return ok;
    }
    if (cmd == "decode") {
        vector<unsigned char> payload;
        auto r = read_input(args, payload);
        if (is_ko(r)) {
            return r;
        }
        auto output = decode_hex(payload);
        screen::lock_t lock(scr, interactive);
        for (uint8_t byte: output) {
            lock.os << byte;
        }
        return ok;
    }
    if (cmd == "check_address") {
        auto addr = args.next<string>();
        if (check_address_hex(addr)) {
            return ok;
        }
        return "KO 40392 Not an hex address.";
    }
    auto r = "KO 30291 Invalid hex subcommand.";
    log(r);
    return r;
}

ko c::exec_offline__b58(shell_args& args) {
    auto cmd = args.next<string>();
    if (cmd == "encode") {
        vector<unsigned char> payload;
        auto r = read_input(args, payload);
        if (is_ko(r)) {
            return r;
        }
        auto s = crypto::b58::encode(payload);
        screen::lock_t lock(scr, interactive);
        lock.os << s << '\n';
        return ok;
    }
    if (cmd == "decode") {
        vector<unsigned char> payload;
        auto r = read_input(args, payload);
        if (is_ko(r)) {
            return r;
        }
        vector<uint8_t> output;
        if (!crypto::b58::decode(string(payload.begin(), payload.end()), output)) {
            auto r = "KO 40398 Cannot decode b58.";
            log(r);
            return r;
        }
        screen::lock_t lock(scr, interactive);
        for (uint8_t byte: output) {
            lock.os << byte;
        }
        return ok;
    }
    if (cmd == "check_address") {
        auto addr = args.next<string>();
        if (check_address_b58(addr)) {
            return ok;
        }
        return "KO 41332 Not a base58 ripemd160 address.";
    }
    auto r = "KO 30292 Invalid b58 subcommand";
    log(r);
    return r;
}

ko c::handle_sign(const vector<uint8_t>& msg, const priv_t& priv, pub_t& pub, sig_t& sig) {
    log("sign");
    crypto::ec::keys k(priv);
    auto r = crypto::ec::instance.sign(priv, msg, sig);
    if (is_ko(r)) {
        return r;
    }
    pub = k.pub;
    return ok;
}

ko c::handle_priv_key(const priv_t& priv, pub_t& pub, hash_t& addr) {
    log("priv_key");
    {
        auto r = crypto::ec::keys::verifyx(priv);
        if (is_ko(r)) {
            return r;
        }
    }
    pub = crypto::ec::keys::get_pubkey(priv);
    if (!pub.valid) {
        auto r = "KO 40049 Invalid secret key.";
        log(r);
        return r;
    }
    addr = pub.compute_hash();
    return ok;
}

ko c::handle_pub_key(const pub_t& pub, hash_t& addr) {
    log("pub_key");
    if (!pub.valid) {
        auto r = "KO 40049 Invalid public key.";
        log(r);
        return r;
    }
    addr = pub.compute_hash();
    return ok;
}

ko c::handle_gen_keys(priv_t& priv, pub_t& pub, hash_t& addr) {
    log("gen_keys");
    auto k = crypto::ec::keys::generate();
    priv = k.priv;
    pub = k.pub;
    addr = k.pub.compute_hash();
    return ok;
}

ko c::handle_verify(const vector<uint8_t>& msg, const pub_t& pub, const sig_t& sig, uint8_t& result) {
    log("verify");
    result = crypto::ec::instance.verify_not_normalized(pub, msg, sig) ? 1 : 0;
    return ok;
}

ko c::exec_offline__ec(shell_args& args) {
    string command = args.next<string>();
    if (command == "sign") {
        if (args.args_left() < 2) {
            return "KO 44093 Expected 2 args.";
        }
        string msgb58 = args.next<string>();
        auto priv = args.next<priv_t>();
        pub_t pub;
        sig_t sig;
        auto r = handle_sign(crypto::b58::decode(msgb58), priv, pub, sig);
        if (is_ko(r)) {
            return r;
        }
        cout << "sig " << sig << '\n';
        return ok;
    }
    else if (command == "verify") {
        if (args.args_left() < 3) {
            return "KO 44094 Expected 3 args.";
        }
        auto msgb58 = args.next<string>();
        auto sig = args.next<sig_t>();
        auto pub = args.next<pub_t>();
        uint8_t result = 0;
        auto r = handle_verify(crypto::b58::decode(msgb58), pub, sig, result);
        if (is_ko(r)) {
            return r;
        }
        bool is_valid = (result == 1);
        screen::lock_t lock(scr, interactive);
        lock.os << "verifies " << (is_valid ? "Valid" : "Invalid XXXX") << '\n';
        return is_valid ? ok : "KO 33092 Sig didn't verify.";
    }
    else if (command == "priv_key") {
        if (args.args_left() < 1) {
            return "KO 44095 Expected 1 arg.";
        }
        auto priv = args.next<priv_t>();
        pub_t pub;
        hash_t addr;
        auto r = handle_priv_key(priv, pub, addr);
        if (is_ko(r)) {
            return r;
        }
        screen::lock_t lock(scr, interactive);
        lock.os << "pub " << pub << '\n';
        lock.os << "addr " << addr << '\n';
        return ok;
    }
    else if (command == "priv_key_hex") {
        if (args.args_left() < 1) {
            return "KO 44095 Expected 1 arg.";
        }
        auto priv_hex = strip_0x(args.next<string>());
        auto priv = priv_t::from_hex(priv_hex);
        pub_t pub;
        hash_t addr;
        auto r = handle_priv_key(priv, pub, addr);
        if (is_ko(r)) {
            return r;
        }
        screen::lock_t lock(scr, interactive);
        lock.os << "priv " << priv << '\n';
        lock.os << "pub " << pub << '\n';
        lock.os << "addr " << addr << '\n';
        return ok;
    }
    else if (command == "pub_key") {
        if (args.args_left() < 1) {
            return "KO 44095 Expected 1 arg.";
        }
        auto pub = args.next<pub_t>();
        hash_t addr;
        auto r = handle_pub_key(pub, addr);
        if (is_ko(r)) {
            return r;
        }
        screen::lock_t lock(scr, interactive);
        lock.os << "pub " << pub << '\n';
        lock.os << "addr " << addr << '\n';
        return ok;
    }
    else if (command == "gen_keys") {
        if (args.args_left() != 0) {
            return "KO 44096 Expected no args.";
        }
        priv_t priv;
        pub_t pub;
        hash_t addr;
        ko r = handle_gen_keys(priv, pub, addr);
        if (is_ko(r)) {
            return r;
        }
        screen::lock_t lock(scr, interactive);
        lock.os << "priv " << priv << '\n';
        lock.os << "pub " << pub << '\n';
        lock.os << "addr " << addr << '\n';
        return ok;
    }
    return "KO 30292 Invalid command. Try --help";
}

ko c::exec_offline(const string& cmd, shell_args& args) {
    log("exec_offline", cmd);
    if (cmd == "print_home") {
        scr << p.get_home() << '\n';
        return ok;
    }
    if (cmd == "version") {
        scr << scriptv::vcs::version() << '\n';
        return ok;
    }
    if (cmd == "mine_public_key") {
        string pattern = args.next<string>();
        screen::lock_t lock(scr, interactive);
        return mine_public_key(pattern, lock.os);
    }
    if (cmd == "digest") {
        string file = args.next<string>();
        screen::lock_t lock(scr, interactive);
        return digest_file(file, lock.os);
    }
    if (cmd == "hash") {
        string cmd = args.next<string>();
        if (cmd == "add") {
            using hasher_t = scriptv::crypto::ripemd160;
            using hash_t = hasher_t::value_type;
            hash_t h1 = args.next<hash_t>();
            hash_t h2 = args.next<hash_t>();
            if (h1.is_zero() || h2.is_zero()) {
                auto r = "KO 54088 add requires two valid hashes.";
                log(r);
                return r;
            }
            hasher_t h;
            h.write(h1);
            h.write(h2);
            hash_t result;
            h.finalize(result);
            screen::lock_t lock(scr, interactive);
            lock.os << result << '\n';
            return ok;
        }
        auto r = "KO 54098 Invalid hash command. Valid are: add.";
        log(r);
        return r;
    }
    if (cmd == "b58") {
        return exec_offline__b58(args);
    }
    if (cmd == "hex") {
        return exec_offline__hex(args);
    }
    if (cmd == "ec") {
        return exec_offline__ec(args);
    }
    if (cmd == "show") {
        string cmd = args.next<string>();
        if (cmd == "c" || cmd == "w") {
            string l;
            ko r = io::read_text_file_(CFG_LICENSE_FILE, l);
            if (is_ko(r)) {
                return r;
            }
            screen::lock_t lock(scr, interactive);
            lock.os << l << '\n';
            return ok;
        }
        return "KO 70693 Invalid command show";
    }
    if (cmd == "h" || cmd == "-h" || cmd == "help" || cmd == "-help" || cmd == "--help") {
        screen::lock_t lock(scr, interactive);
        help(p, lock.os);
        return ok;
    }
    if (cmd.empty()) {
        if (interactive) {
            screen::lock_t lock(scr, interactive);
            help(p, lock.os);
            return ok;
        }
    }
    log("not an hmi offline command");
    return KO_91810;
}



ko c::exec(const string& command_line) {
    log("exec line", command_line);
    auto args = shell_args(command_line);
    auto cmd = args.next<string>();
    auto r = exec_offline(cmd, args);
//    if (r == KO_91810) {
//        r = exec_online(cmd, args);
//    }
    return r;
}

void c::interactive_shell() {
    assert(p.cmd.empty());
    interactive = true;
    bool was_mute = scr.mute;
    scr.set_mute(false);
    {
        screen::lock_t lock(scr, interactive);
        if (p.banner) {
            banner(p, lock.os);
        }
        lock.os << '\n';
        lock.os << "Type 'h' for help, or 'q' to quit.\n";
    }
    while (true) {
        {
            screen::lock_t lock(scr, false);
            lock.os << "scriptv> "; lock.os.flush();
        }
        string line;
        getline(cin, line);
        io::cfg0::trim(line);
        if (line == "q" || line == "exit") {
            scr << "quitting...\n";
            break;
        }
        auto r = exec(line);
        if (is_ko(r)) {
            screen::lock_t lock(scr, false);
            lock.os << rewrite(r) << '\n';
        }
    }
    interactive = false;
    scr.set_mute(was_mute);
}

string c::rewrite(ko r) const {
    if (r == KO_11000) {
        return string(r) + "; Type -h for help.";
    }
    if (is_ko(r)) {
        return r;
    }
    return "";
}

string c::run_() {
    log("run cmd=", p.cmd);
    {
        if (!p.cmd.empty()) {
            ko r = exec_offline(p.cmd, p.args);
            if (is_ko(r)) {
                if (r == KO_91810) {
                    return KO_11000;
                }
                return r;
            }
            return "";
        }
    }
    string ret;
    if (p.cmd.empty()) {
        interactive_shell();
    }
    return ret;
}

string c::run() {
//    if (p.local) {
//        string keyfile = p.get_home() + "/wallet/keys";
//        scr << "keyfile " << keyfile << '\n';
//        us::wallet::wallet::algorithm algo(keyfile);
//        ostringstream os;
//        algo.list(1, os);
//        scr << os.str() << '\n';
//        return "";
//    }

    auto r = run_();
    if (!r.empty()) {
        screen::lock_t lock(scr, false);
        lock.os << r << '\n';
    }
    return r;
}

void c::set_mute(bool m) {
    scr.mute = m;
}

#if CFG_FCGI == 1
void c::run_fcgi(const params& p) {
    log("run_fcgi");
cerr << "DBG 1" << endl;
    assert(fcgi == nullptr);
    try {
cerr << "DBG 2" << endl;
        fcgi = new Fastcgipp::Manager<fcgi_t>();
//cerr << "DBG 3" << endl;
        //fcgi->setupSignals();
cerr << "DBG 4" << endl;
        if (!fcgi->listen("127.0.0.1", "9000")) {
cerr << "DBG 5" << endl;
            cerr << "Cannot listen on FCGI port.\n";
cerr << "DBG 6" << endl;
            exit(1);
        }
cerr << "DBG 7" << endl;
        thread th([&] {
cerr << "DBG 8" << endl;
            fcgi->start();
cerr << "DBG 9" << endl;
            fcgi->join();
cerr << "DBG 10" << endl;
            delete fcgi;
            fcgi = nullptr;
cerr << "DBG 11" << endl;
            cerr << "fcgi interface is down.\n";
        });
cerr << "DBG 12" << endl;
        th.detach();
cerr << "DBG 13" << endl;
    }
    catch (std::exception& ex) {
cerr << "DBG 14" << endl;
        delete fcgi;
        fcgi = nullptr;
cerr << "DBG 15" << endl;
        cerr << ex.what() << '\n';
cerr << "DBG 16" << endl;
    }
cerr << "DBG 17" << endl;
}
#endif

/*
#include <ncurses.h>

int c::run_ncurses(shell_args args, params& p ) {
  //  signal(SIGWINCH, resizeHandler);
    initscr();
    printw("other.wallet");
    refresh();
    getch();
    endwin();
    return 0;
}
*/

ko c::digest_file(const string& file, ostream& os) {
    log("digest_file");
    auto r = crypto::ripemd160::digest_file(file);
    if (is_ko(r.first)) return r.first;
    os << r.second << '\n';
    return ok;
}

ko c::mine_public_key(const string& pattern, ostream& os) {
    log("mine_public_key");
    while(true) {
        crypto::ec::keys k = crypto::ec::keys::generate();
        string pubkey = k.pub.to_b58();
        if (pubkey.find(pattern) != string::npos) {
            os << "Private key: " << k.priv.to_b58() << '\n';
            os << "Public key: " << k.pub.to_b58() << '\n';
            return ok;
        }
    }
    return ok;
}

void c::process_cleanup() {
}

void c::setup_signals(bool on) {
}


