import React, { useState } from 'react';
import { Input } from 'components/atoms/input/Input';
import { EWALLETS, EWalletUnlockStrategy } from 'utils/types/wallet';
import { ACTIVE_WALLET_FORM_LABELS } from 'components/organism/wallet/consts';
import { Button } from 'components/atoms/button/Button';
import { useNavigate } from 'react-router-dom';
import { checkIsValidMnemonic, checkPasswordsValidation, CREATE_WALLET_VALIDATION } from 'utils/validation/wallet';
import { ERROR_MESSAGES } from './consts';
import { unlockWallet } from 'utils/web3/wallet';
import { useActions } from 'hooks/useActions';
import styles from './walletForm.module.scss';

interface IWalletForm {
    login: string;
    setLogin: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    type?: EWALLETS;
    submit: () => void;
}

export const WalletForm: React.FC<IWalletForm> = ({ login, password, type, setLogin, setPassword, submit }) => {
    const [checked, setChecked] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const { setWalletData, setUnlockKey, setKeyStore } = useActions();

    const unlock = async (strategy: EWalletUnlockStrategy, data: { [key: string]: string }) => {
        try {
            setUnlockKey(password);
            const result = await unlockWallet(strategy, password, data);
            
            if (result?.wallet) {
                setWalletData({address: result.wallet.address, privateKey: result.wallet.privateKey});
                setKeyStore(result.keystore);
                localStorage.setItem('wallet', JSON.stringify(result.wallet));
                localStorage.setItem('keystore', JSON.stringify(result.keystore));
            }
        } catch (e) {
            console.log(e, 'error in WalletForm');
        }
    };
    const onKeystoreFileLoad = (e: ProgressEvent<FileReader>) => {
        const keystoreData = e.target?.result as string;

        if (keystoreData) {
            unlock(EWalletUnlockStrategy.KEYSTORE_FILE, {
                keystore: keystoreData,
            });
        }
    };

    const checkIsValidKeystore = () => {
        return file !== null && new RegExp(CREATE_WALLET_VALIDATION.password).test(password);
    };

    const isValidMnemonic = () => {
        return checkIsValidMnemonic(login) && new RegExp(CREATE_WALLET_VALIDATION.password).test(password);
    };

    const onSubmit = () => {
        if (
            !type &&
            checked &&
            checkPasswordsValidation({
                password: login,
                rePassword: password,
            })
        ) {
            submit();
        } else if (type === EWALLETS.KEYSTORE && checkIsValidKeystore()) {
            const fileReader = new FileReader();
            fileReader.onload = onKeystoreFileLoad;
            fileReader.readAsText(file!, 'UTF-8');
        } else if (type === EWALLETS.MNEMONIC && isValidMnemonic()) {
            unlock(EWalletUnlockStrategy.MNEMONIC_PHRASE, { mnemonic: login });
        } else if (type === EWALLETS.PRIVATE_KEY && login) {
            unlock(EWalletUnlockStrategy.PRIVATE_KEY, { privateKey: login });
        }
    };

    return (
        <div className={styles.walletForm}>
            {!type ? (
                <div className={styles.walletForm_create}>
                    <div className={styles.walletForm_create_header}>
                        <p>Create Keystore</p>
                        <span>This password will encrypt your private key.</span>
                    </div>
                    <div className={styles.walletForm_create_container}>
                        <Input value={login} onChange={(e) => setLogin(e.target.value)} label="Set a New Password" placeholder='Password' type="password" pattern={CREATE_WALLET_VALIDATION.password} errorMessage={ERROR_MESSAGES.password} />
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} label="Re-enter Password" placeholder='Re-enter password' type="password" pattern={CREATE_WALLET_VALIDATION.password} errorMessage={ERROR_MESSAGES.password} />
                        <div className={styles.walletForm_create_container_checkbox}>
                            <Input onChange={(e) => setChecked(e.target.checked)} type="checkbox" checked={checked} />
                            <span>I understand that Script cannot recover or reset my password or the keystore file. I will make a backup of the keystore file / password, keep them secret, complete all wallet creation steps.</span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <Input
                        value={login}
                        onChange={(e) => {
                            if (type === EWALLETS.KEYSTORE) {
                                setFile(e.target.files?.[0] || null);
                            }

                            setLogin(e.target.value);
                        }}
                        label={ACTIVE_WALLET_FORM_LABELS[type].login.label}
                        placeholder={ACTIVE_WALLET_FORM_LABELS[type].login.placeholder}
                        suggestion={ACTIVE_WALLET_FORM_LABELS[type].login.suggestion}
                        type={type === EWALLETS.KEYSTORE ? 'file' : 'text'}
                    />
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} label={ACTIVE_WALLET_FORM_LABELS[type].password.label} placeholder={ACTIVE_WALLET_FORM_LABELS[type].password.placeholder} error={ACTIVE_WALLET_FORM_LABELS[type].password.error} type="password" />
                </>
            )}
            {!type ? (
                <div className={styles.walletForm_bottom}>
                    <Button
                        onClick={onSubmit}
                        label="Download Keystore"
                        size="big"
                        color="yellow"
                        disabled={
                            !checked ||
                            !checkPasswordsValidation({
                                password: login,
                                rePassword: password,
                            })
                        }
                    />
                    <div className={styles.walletForm_bottom_create}>
                        <p>Already have a wallet?</p>
                        <span onClick={() => navigate('/unlock/keystore-file')}>Unlock Wallet</span>
                    </div>
                </div>
            ) : (
                <div className={styles.walletForm_bottom}>
                    <Button onClick={onSubmit} label="Unlock Wallet" size="big" color="yellow" />
                    <div className={styles.walletForm_bottom_create}>
                        <p>Don&apos;t have a wallet?</p>
                        <span onClick={() => navigate('/unlock/create')}>Create a Wallet</span>
                    </div>
                </div>
            )}
        </div>
    );
};
