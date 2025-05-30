export enum EWALLETS {
    KEYSTORE = 'Keystore',
    MNEMONIC = 'Mnemonic',
    PRIVATE_KEY = 'Private Key',
}

export interface IWalletFormFields {
    login: {
        label: string;
        placeholder?: string;
        suggestion?: string;
    };
    password: {
        label: string;
        placeholder?: string;
        error?: string;
    };
}

export enum EWalletUnlockStrategy {
    KEYSTORE_FILE = 'keystore-file',
    MNEMONIC_PHRASE = 'mnemonic-phrase',
    COLD_WALLET = 'cold-wallet',
    PRIVATE_KEY = 'private-key',
}

export type IActiveWalletFormLabels = {
    [key in EWALLETS]: IWalletFormFields;
};
