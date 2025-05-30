#pragma once
#include <string>
#include <sstream>

namespace scriptv::vcs {

    using namespace std;

    extern string src;
    extern string devjob;
    extern string devjobtag;
    extern string brand;
    extern string branch;
    extern string codehash;
    extern string cfghash;
    extern string hashname;
    extern string version_name;
    extern string build_date;

    static inline void version(ostream& os) {
        os << version_name << ' ' << codehash << ' ' << build_date;
    }

    static inline void name_date(ostream& os) {
        os << version_name << ' ' << build_date;
    }

    static inline string apkfilename() {
        ostringstream os;
        os << brand << "-wallet_android_" << branch << '_' << hashname << ".apk";
        return os.str();
    }

    static inline string sdk_name() {
        ostringstream os;
        os << brand << "-wallet-sdk_java_" << branch;
        return os.str();
    }

    static string version() {
        ostringstream os;
        version(os);
        return os.str();
    }

    static string name_date() {
        ostringstream os;
        name_date(os);
        return os.str();
    }

}

