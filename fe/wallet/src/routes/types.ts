import dotool from 'dotool';
import type { FC } from 'react';

export type TRoutePageType = {
    sitebarVisible?: boolean;
    isPrivate?: boolean;
    title: string;
    icon?: string;
    hasLayout?: boolean;
    path: string;
    element: FC;
};

export interface ISubRoutes {
    Tokens: string;
    Send: string;
    NodeRunner: string;
    Stakes: string;
    Faucet: string;
    Contract: string;
    Settings: string;
    Explore: string;
    Logout: string;
}

export const ESubRoutes = {
    Tokens: 'tokens',
    Send: 'send',
    NodeRunner: 'node-runner',
    Stakes: 'stakes',
    Contract: 'https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.26+commit.8a97fa7a.js',
    Settings: 'settings',
    Explore: `${dotool.FE_EXPLORER__URL}/account`,
    Logout: 'logout',
} as const;
