#include <scriptv/config.h>
#include <scriptv/logs.inc>
#if CFG_LOGS__IO == 0
    #if CFG_LOGS == 1
        #undef log
        #define log (void)sizeof
    #endif
#endif

