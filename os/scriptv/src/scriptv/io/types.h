#pragma once
#include <vector>
#include <inttypes.h>
#include <type_traits>
#ifdef DEBUG
   struct assert_is_root_namespace;
   static_assert(std::is_same<assert_is_root_namespace, ::assert_is_root_namespace>::value, "Not root namespace. Check includes.");
#endif

#include <scriptv/ko.h>

namespace scriptv {

    using namespace std;

}

namespace scriptv::io {

    using namespace scriptv;

}

