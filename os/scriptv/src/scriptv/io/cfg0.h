#pragma once
#include <string>
#include <string_view>
#include <vector>
#include <scriptv/config.h>
#include "types.h"

namespace scriptv::io {

    using namespace std;

    ko read_file_(const string& filename, vector<uint8_t>&);
    ko read_file_(istream& is, vector<unsigned char>&);
    ko read_text_file_(const string& filename, string&);
    ko write_file_(const vector<uint8_t>&, const string& filename);

    ko system_command(const string& command, string& result);

    struct cfg0 {

        static const char* KO_60534, *KO_84012;

        static void check_platform();
        static bool is_big_endian();
        static bool mkdir(const string& d);
        static bool file_exists(const string& f);
        static uint32_t file_size(const string& f);
        static bool ensure_dir(const string&);
        static string rewrite_path(const string&);
        static bool dir_exists(const string&);
        static string abs_file(const string& home, const string& fn);
        static void mkdir_tree(string sub, string dir);
        static pair<ko, cfg0> load(const string& home);
        static void trim(string&);
        static void to_identifier(string&);
        static string directory_of_file(const string& file);
        static bool ensure_writable(const string& file);
        static pair<ko, pair<string, string>> split_fqn(string fqn);
        static string replace(const string& src, const string& find, const string& replace);
        static vector<string> split(const string_view& src, const string_view& sep);


        cfg0(const string& home);
        cfg0(const cfg0& other);
        virtual ~cfg0();

        string home;
    };

    using cfg_filesystem = cfg0;

}

