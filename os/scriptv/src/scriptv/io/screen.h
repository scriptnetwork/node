#pragma once
#include <iostream>
#include <mutex>
#include <condition_variable>

#include <scriptv/crypto/types.h>
#include <scriptv/bgtask.h>

namespace scriptv::io {

    struct screen {

        screen(ostream&);

        template<typename t>
        void println(const t& o) {
            lock_guard<mutex> lock(mx);
            if (mute) return;
            os << o << '\n';
        }

        template<typename t>
        void print(const t& o) {
            lock_guard<mutex> lock(mx);
            if (mute) return;
            os << o;
        }

        void flush() {
            lock_guard<mutex> lock(mx);
            if (mute) return;
            os.flush();
        }

        static ostream null_os;

        struct lock_t {
            lock_t(screen& s, bool new_paragraph): new_paragraph(new_paragraph), os(s.mute ? null_os : s.get_os()) {
                lock = new unique_lock<mutex>(s.mx);
                if (new_paragraph) os << '\n';
            }

            ~lock_t() {
                if (new_paragraph) os << '\n';
                lock->unlock();
                delete lock;
            }
            unique_lock<mutex> *lock;
            bool new_paragraph;
            ostream& os;
        };

        bool toggle_mute();
        int getch();
        int getche();
        void print_prompt();
        void print_prompt_();
        inline bool is_capturing() const { return capturing; }

        struct supervisor {
            virtual ~supervisor() {}
            virtual bool is_active() const = 0;
        };

        string capture_input(const supervisor&);

        void set_mute(bool);
        inline ostream& get_os() { return os; };
        inline mutex& get_mx() { return mx; };
        void feed_if_interrupting_input();

        string prompt;
        bool mute{false};

private:
        string line;
        bool capturing{false};
        ostream&os;
        mutex mx;
    };

}

template<typename t>
inline scriptv::io::screen& operator << (scriptv::io::screen& scr, const t& o) {
    std::lock_guard<std::mutex> lock(scr.get_mx());
    scr.get_os() << o;
    return scr;
}

template<>
inline scriptv::io::screen& operator << (scriptv::io::screen& scr, const std::vector<std::pair<std::string, std::string>>& o) {
    std::lock_guard<std::mutex> lock(scr.get_mx());
    scr.get_os() << o.size() << "items.\n";
    for (auto& i: o) {
        scr.get_os() << i.first << ' ' << i.second << '\n';
    }
    return scr;
}

