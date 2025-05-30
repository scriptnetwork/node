# wallet.script.tv

## BASE_URL

local - [http://localhost:3000]
live(testnet) - [https://wallet-testnet.script.tv]
live(mainnet) - [https://wallet-mainnet.script.tv]

## SS info

1. We are now able to create wallet and login in 3 ways: [src/pages/unlockWallet]
    1) key storage > [`BASE_URL`/unlock/keystore-file]
    2) mnemonic > [`BASE_URL`/unlock/mnemonic-phrase]
    3) private key > [`BASE_URL`/unlock/private-key]

2. After login:
    1) Tokens Page -> [`BASE_URL`/wallet/tokens] (src/pages/tokens)
    2) Send Page -> [`BASE_URL`/wallet/send] (src/pages/send)
    3) Receive Page -> [`BASE_URL`/wallet/receive] (src/pages/receive)
    4) Node Runner Page -> [`BASE_URL`/wallet/node-runner] (src/pages/node-runner)
    5) Stakes Page -> [`BASE_URL`/wallet/stakes] (src/pages/stakes)
    6) Contract Page -> [`BASE_URL`/wallet/contract] (src/pages/contract)
    7) Settings Page -> [`BASE_URL`/wallet/settings] (src/pages/settings)
    8) Explore Page -> [`BASE_URL`/wallet/explore] (src/pages/explore)

## code structure [src]

• assets -> For images [jpeg], [png], [svg], etc
• components 
    1. [atoms] -> Atoms are the smallest, most basic building blocks
    2. [molecules] -> Molecules are groups of atoms that are combined to form more complex components
    3. [organism] -> Organisms are more complex components that are made up of groups of molecules and atoms.
• dotool -> Genereted file for env's 
• hooks -> For custom hooks (e.g. [useOutsideClick], [useEnter], [useActions]...)
• layouts -> For different UI cliché (e.g. [header], [footer], [sidebar]...)
• libs -> For different libs (e.g. [Script.esm.js] for eth)
• routes -> For routing`
    1. [consts.ts] - constant routes for navigation
    2. [routes.ts] - defined routes and pages for those
    3. [types.ts] - types and enums regarding routes
    4. [RouteController.tsx] - Routing staff (e.g. [private-routing])
    5. [index.tsx] - main file for routing including all files in [src/routes]
• store -> redux-toolkit`
    1. [endpoints.ts] - constant endpoints 
    2. [selectors.ts] - for easy selection from any reducer  
    3. [index.ts] - for store configuration and custom hooks for store managment
• styles -> SASS`
    1. [colors.scss] - variables for recurring colors
    2. [fonts.scss] - variables for recurring fonts
    3. [typography.scss] - variables for recurring typographies (e.g. [headings], [paragraphs])
    4  [breakPoints] - variables for responsive design
• utils -> any helpers (e.g. [functions], [constants], [types])
• pages -> concrete page based on route (e.g. [stakes], [unlockWallet])

## code formattors

Prettier > [.prettierrc.json]
Eslint >  [.eslintrc.json]

## state management

redux
redux-toolkit > [src/store]


## language

TypeScript > [tsconfig.json]

## design patterns

Code organization structure
Atomic components
HOCs
Custom Hooks
State managment 
Optimisation 

## routing
react-router-dom > [src/routes]

## styles 

SASS
modules

## tasks

[https://github.com/scriptnetwork/system/issues/151]
[https://github.com/scriptnetwork/system/issues/312]

## configs

rewire-hot-loader > [config-overrides.js]

## build

```sh
npm install --legacy-peer-deps
npm run build
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000] to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)