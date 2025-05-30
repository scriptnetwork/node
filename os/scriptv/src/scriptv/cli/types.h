#pragma once
#ifdef DEBUG
   struct assert_is_root_namespace;
   static_assert(std::is_same<assert_is_root_namespace, ::assert_is_root_namespace>::value, "Not root namespace. Check includes.");
#endif

namespace us {

    using namespace std;

}

namespace us::gov::cli {

    using namespace us;
    using namespace us::gov;

}

