import React from 'react';
import { UnlockWalletHeader } from 'components/atoms/unlockWalletHeader/UnlockWalletHeader';
import { Wallet } from 'components/organism/wallet/Wallet';
import styles from './unlockWallet.module.scss';

const UnlockHeader: React.FC = () => (
    <h1>
        <span className={styles.odd}>Unlock</span> <span className={styles.even}>Your</span> <span className={styles.odd}>Wallet</span>
    </h1>
);

const UnlockWallet: React.FC = () => {
    return (
        <div className={styles.unlockWallet}>
            <UnlockWalletHeader />
            <div className={styles.unlockWallet_container}>
                <UnlockHeader />
                <Wallet />
            </div>
        </div>
    );
};

export default UnlockWallet;
