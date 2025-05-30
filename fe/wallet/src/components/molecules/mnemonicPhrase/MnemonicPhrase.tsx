import React, { useState } from 'react';
import { Button } from 'components/atoms/button/Button';
import { useNavigate } from 'react-router-dom';
import { MnemonicPhrase as MnemonicPhraseIMG } from 'assets/png';
import { useAppSelector } from 'store';
import { Wallet } from 'ethers';
import styles from './mnemonicPhrase.module.scss';

interface IMnemonicPhrase {
    showPhrase: boolean;
    onSubmit: () => void;
}

export const MnemonicPhrase: React.FC<IMnemonicPhrase> = ({ onSubmit, showPhrase }) => {
    const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
    const navigate = useNavigate();
    const { firstLoginWallet: wallet } = useAppSelector((state) => state.wallet);

    return (
        <div className={styles.mnemonicPhrase}>
            <div className={styles.mnemonicPhrase_container}>
                <div className={styles.mnemonicPhrase_container_header}>
                    <h2>Mnemonic Phrase</h2>
                    <p>12 words which allow you to recover your wallet.</p>
                </div>
                {showPhrase ? (
                    <div className={styles.mnemonicPhrase_container_main_phrase}>
                        <p>Back up the text below on paper and keep it somewhere secret and safe. It will not be shown again.</p>
                        <div className={styles.mnemonicPhrase_container_main_phrase_12}>
                            <p>{(wallet as Wallet).mnemonic.phrase}</p>
                        </div>
                        <span onClick={() => setShowPrivateKey((prev) => !prev)}>{showPrivateKey ? 'Hide' : 'Show'} my Private Key</span>
                        {showPrivateKey && (
                            <div className={styles.mnemonicPhrase_container_main_phrase_key}>
                                <p>{wallet.privateKey}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.mnemonicPhrase_container_main}>
                        <img src={MnemonicPhraseIMG} alt="mnemonic phrase" />
                        <p>WARNING!</p>
                        <span>We are about to show your Mnemonic phrase. Please ensure no one can see your screen before you continue.</span>
                    </div>
                )}
                <div className={styles.mnemonicPhrase_container_footer}>
                    <Button onClick={onSubmit} label="Continue" size="big" color="yellow" />
                    <div className={styles.mnemonicPhrase_container_footer_unlock}>
                        <p>Already have a wallet?</p>
                        <span onClick={() => navigate('/unlock/keystore-file')}>Unlock Wallet</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
