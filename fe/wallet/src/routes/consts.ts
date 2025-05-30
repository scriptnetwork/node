import dotool from 'dotool';
import { ISubRoutes } from './types';

export const STATUS_ROUTE = {
    notAuthorized: '/unlock/keystore-file',
    authorized: '/wallet/tokens',
};

export const ROUTE_PATHS = {
    UNLOCK_WALLET: '/unlock/:type',
    TOKENS: '/wallet/tokens',
    FAUCET: '/wallet/faucet',
    SEND: '/wallet/send',
    NODE_RUNNER: '/wallet/node-runner',
    STAKES: '/wallet/stakes',
    CONTRACT: 'https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.26+commit.8a97fa7a.js',
    SETTINGS: '/wallet/settings',
    EXPLORE: dotool.FE_EXPLORER__URL,
    ERROR: '*',
};

export const SUB_ROUTES: ISubRoutes = { Tokens: 'tokens', Send: 'send', Faucet: 'faucet', NodeRunner: 'node-runner', Stakes: 'stakes', Contract: 'https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.26+commit.8a97fa7a.js', Settings: 'settings', Explore: dotool.FE_EXPLORER__URL + '/account', Logout: 'logout' };
