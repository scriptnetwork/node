import Web3, { KeyStore, Web3Account } from 'web3';
import { ethers, Wallet } from 'ethers';
import { EWalletUnlockStrategy } from 'utils/types/wallet';

const MNEMONIC_PATH: string = "m/44'/500'/0'/0/0";
const RPC_URL = 'https://mainnet.infura.io/v3/40980e2189924c8abfc5f60dd2e5dc4b'; //get this from dotool
const web3 = new Web3(RPC_URL);

export const unlockWallet = async (strategy: string, password: string, data: { [key: string]: string }): Promise<{ wallet: Web3Account | ethers.Wallet; keystore: KeyStore } | null> => {
    try {
        let wallet = null;
        const { mnemonic, privateKey, keystore } = data;

        if (strategy === EWalletUnlockStrategy.KEYSTORE_FILE) {
            wallet = await web3.eth.accounts.decrypt(keystore, password);
        } else if (strategy === EWalletUnlockStrategy.MNEMONIC_PHRASE) {
            wallet = ethers.Wallet.fromMnemonic(mnemonic, MNEMONIC_PATH);
        } else if (strategy === EWalletUnlockStrategy.PRIVATE_KEY) {
            wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
        }
        if (!wallet) return null;
        const keystoreData = await web3.eth.accounts.encrypt(wallet.privateKey, password);

        return { wallet, keystore: keystoreData };
    } catch (e) {
        console.log(e, 'error in unlockWallet');
        let message = '';

        if (strategy === EWalletUnlockStrategy.KEYSTORE_FILE) {
            message = 'Wrong password OR invalid keystore.';
        } else if (strategy === EWalletUnlockStrategy.MNEMONIC_PHRASE) {
            message = 'No wallet found for this mnemonic phrase.';
        } else if (strategy === EWalletUnlockStrategy.PRIVATE_KEY) {
            message = 'No wallet found for this private key.';
        }

        throw new Error(message);
    }
};

export const walletFromMnemonic = (mnemonic: string): Wallet => {
    return ethers.Wallet.fromMnemonic(mnemonic, MNEMONIC_PATH);
};

export const encryptToKeystore = (privateKey: string, password: string): Promise<KeyStore> => {
    return web3.eth.accounts.encrypt(privateKey, password);
};

export const createWallet = async (password: string): Promise<{ wallet: Wallet; keystore: KeyStore }> => {
    const randomBytes = ethers.utils.randomBytes(16);
    const mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
    const wallet = walletFromMnemonic(mnemonic);
    const keystore = await encryptToKeystore(wallet.privateKey, password).then((resp) => resp);

    return {
        wallet,
        keystore,
    };
};

export const downloadFile = (filename: string, contents: string): void => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export const exportKeystore = async (currentPassword: string, newPassword: string, keyStore: KeyStore): Promise<KeyStore | null> => {
    try {
        const wallet = await web3.eth.accounts.decrypt(JSON.stringify(keyStore), currentPassword);
        if (wallet) {
            const keystore = await web3.eth.accounts.encrypt(wallet.privateKey, newPassword);
            return keystore;
        } else {
            throw new Error('Wrong password.  Your keystore could not be exported.');
        }
    } catch (e) {
        console.log(e, 'error in exportKeystore');
        return null;
    }
};

export const checkIsValidPassword = async (keyStore: string, password: string) => {
    try{
        await web3.eth.accounts.decrypt(keyStore, password)
        return true;
    }catch(e){
        console.log(e, 'error in checkIsValidPassword');
        return false;
    }
}