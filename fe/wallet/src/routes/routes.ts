import { lazy } from 'react';

import { type TRoutePageType } from './types';
import { ROUTE_PATHS } from './consts';

const UnlockWallet = lazy(() => import('pages/unlockWallet/UnlockWallet'));
const NodeRunner = lazy(() => import('pages/nodeRunner/NodeRunner'));
const Settings = lazy(() => import('pages/settings/Settings'));
const Stakes = lazy(() => import('pages/stakes/Stakes'));
const Tokens = lazy(() => import('pages/tokens/Tokens'));
const Faucet = lazy(() => import('pages/faucet/Faucet'));
const Error = lazy(() => import('pages/error/Error'));
const Send = lazy(() => import('pages/send/Send'));

const routesList: TRoutePageType[] = [
    {
        path: ROUTE_PATHS.UNLOCK_WALLET,
        title: 'Unlock Wallet',
        element: UnlockWallet,
        isPrivate: false,
    },
    {
        path: ROUTE_PATHS.TOKENS,
        title: 'Tokens Page',
        element: Tokens,
        isPrivate: true,
        hasLayout: true,
    },
    {
        path: ROUTE_PATHS.SEND,
        title: 'Send Page',
        element: Send,
        isPrivate: true,
        hasLayout: true,
    },
    {
        path: ROUTE_PATHS.NODE_RUNNER,
        title: 'Node-runner Page',
        element: NodeRunner,
        isPrivate: true,
        hasLayout: true,
    },
    {
        path: ROUTE_PATHS.FAUCET,
        title: 'Faucet Page',
        element: Faucet,
        isPrivate: true,
        hasLayout: true,
    },
    {
        path: ROUTE_PATHS.STAKES,
        title: 'Stakes Page',
        element: Stakes,
        isPrivate: true,
        hasLayout: true,
    },
    {
        path: ROUTE_PATHS.SETTINGS,
        title: 'Settings Page',
        element: Settings,
        isPrivate: true,
        hasLayout: true,
    },
    {
        path: ROUTE_PATHS.ERROR,
        title: 'Error',
        element: Error,
        isPrivate: false,
    },
];

export default routesList;
