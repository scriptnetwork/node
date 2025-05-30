import dotool from "dotool";

export const NETWORKS = {
    __deprecated__ETHEREUM: 'ethereum',
    Script_PRIVATENET: dotool.ss_network,
};

export const NETWORK_CONFIG = {
    isScriptNetworkLive: true,
    defaultScriptChainID: NETWORKS.Script_PRIVATENET,
};

export const NETWORK_EXPLORER_URLS = {
    [NETWORKS.Script_PRIVATENET]: dotool.BE_EXPLORER_URL,
};
