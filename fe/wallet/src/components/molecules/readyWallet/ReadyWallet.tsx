import React from 'react';
import { Button } from 'components/atoms/button/Button';
import { WalletSuccess } from 'assets/png';
import styles from './readyWallet.module.scss';

interface IReadyWallet {
    onSumbit: () => void;
}

export const ReadyWallet: React.FC<IReadyWallet> = ({ onSumbit }) => {
    return (
        <div className={styles.readyWallet}>
            <div className={styles.readyWallet_container}>
                <img src={WalletSuccess} alt="wallet" />
                <h3>You&apos;re ready!</h3>
                <p>You are now ready to use your new Script wallet.</p>
                <Button onClick={onSumbit} label="Unlock Wallet" color="yellow" size="big" />
            </div>
        </div>
    );
};
