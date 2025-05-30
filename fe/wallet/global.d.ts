declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

interface Window {
    env: {
        [key: string]: string;
    };
    ethereum?: import('ethers').providers.ExternalProvider;
}
