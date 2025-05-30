import Axios from "axios";

export const RemixService = {
    getCompilerVersion: () => {
        return Axios.get('https://binaries.soliditylang.org/bin/list.json');
    }
}
