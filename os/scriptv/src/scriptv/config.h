#pragma once
#include <string>
#include "ko.h"

/// <orma transpile dest="us/sdk/wallet/java/us/CFG.java.in"/>

//---- LOGS component patching panel
#define CFG_LOGS__CONCUR 1
#define CFG_LOGS__CRYPTO 1
#define CFG_LOGS__IO 1
//------------------

#define LOGDIR "./logs"

#define CFG_TEST 1
#define CFG_COPYRIGHT_LINE "Copyright line"
#define CFG_COPYRIGHT_LINE2 "Copyright line 1"
#define CFG_COPYRIGHT_LINE3 "Copyright line 2"
#define CFG_LICENSE_FILE "./doc/license.txt"

#define PLATFORM "scriptv"
#define DATADIR ".scriptv"

#define CFG_LOGS 1
#define CFG_FCGI 0

#define STVUSER "stv"

// unless a release build, disable 'final' keyword so tests can be compiled.
#if CFG_TEST == 0
    #define final_ final
#else
    #define final_
#endif

#define HAVE_CFG

