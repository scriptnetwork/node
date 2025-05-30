#pragma once
#include <scriptv/config.h>

namespace scriptv::cli {
    struct hmi0 {
        virtual ~hmi0();

	virtual void setup_signals(bool on);
    };
}

