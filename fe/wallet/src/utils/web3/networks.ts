import { NETWORKS } from 'utils/constants/networks';

export function isScriptNetwork(network: keyof typeof NETWORKS): boolean {
    return network !== NETWORKS.__deprecated__ETHEREUM;
}
