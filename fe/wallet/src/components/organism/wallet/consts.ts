import { EWALLETS, IActiveWalletFormLabels } from 'utils/types/wallet';

export const ACTIVE_WALLET_LINK: { [key: string]: EWALLETS } = {
    'keystore-file': EWALLETS.KEYSTORE,
    'mnemonic-phrase': EWALLETS.MNEMONIC,
    'private-key': EWALLETS.PRIVATE_KEY,
};

export const ACTIVE_WALLET_FORM_LABELS: IActiveWalletFormLabels = {
    [EWALLETS.KEYSTORE]: {
        login: {
            label: 'Please select your keystore file',
            placeholder: 'Choose Keystore File',
        },
        password: {
            label: 'Enter your wallet password',
            placeholder: 'Enter wallet password',
        },
    },
    [EWALLETS.MNEMONIC]: {
        login: {
            label: 'Please enter your 12 word phrase',
            suggestion: '*Please separate each Mnemonic Phrase with a space.',
            placeholder: 'Enter your 12 word phrase',
        },
        password: {
            label: 'Enter your wallet password',
            placeholder: 'Enter temporary session password',
            error: 'Before you enter your mnemonic phrase, we recommend you disconnect your device from the internet. You will be able to reconnect once your wallet is unlocked.',
        },
    },
    [EWALLETS.PRIVATE_KEY]: {
        login: {
            label: 'Please enter your private key',
            placeholder: 'Enter your private key',
            suggestion: 'Please enter your private key in HEX format.',
        },
        password: {
            label: 'Enter your wallet password',
            placeholder: 'Enter temporary session password',
            error: 'Before you enter your private key, we recommend you disconnect your device from the internet. You will be able to reconnect once your wallet is unlocked.',
        },
    },
};
