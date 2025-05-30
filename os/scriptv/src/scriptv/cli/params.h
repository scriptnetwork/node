#pragma once
#include <string>

#include <scriptv/config.h>
#include <scriptv/io/shell_args.h>

#include "types.h"

namespace scriptv::cli {

    struct params {
        using shell_args = scriptv::io::shell_args;
        params();
        params(const shell_args&);

        void constructor();

        enum output_mode {
            om_human,
            om_text,
            om_xml,
            om_json,

            num_modes
        };

        constexpr static array<const char*, num_modes> omstr = {"human", "text", "xml", "json"};

        string get_output_mode() const { return omstr[om]; }
        string get_home() const;
        void dump(ostream&) const;
        void dump(const string& prefix, ostream&) const;

    public:
        string homedir;
        bool ncurses{false};
        bool verbose{false};
        string cmd;
        shell_args args;
        output_mode om{om_human};
        bool names{true};
        #if CFG_FCGI == 1
            bool fcgi{false};
        #endif
        bool banner{true};
        string logd{LOGDIR};
        bool nolog{false};
    };

}

