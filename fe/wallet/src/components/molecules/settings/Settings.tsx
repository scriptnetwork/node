import React, { useState } from 'react';
import { Button } from 'components/atoms/button/Button';
import { Input } from 'components/atoms/input/Input';
import { IChangeState } from 'pages/settings/types';
import { checkPasswordsValidation, CREATE_WALLET_VALIDATION } from 'utils/validation/wallet';
import { downloadFile, exportKeystore } from 'utils/web3/wallet';
import { useAppSelector } from 'store';
import { useActions } from 'hooks/useActions';
import { ERROR_MESSAGES } from '../walletForm/consts';
import { toast } from 'react-toastify';
import styles from './settings.module.scss';

const initialChangeState: IChangeState = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
};

export const Settings: React.FC = () => {
    const [changeState, setChangeState] = useState<IChangeState>(initialChangeState);
    const { keyStore, wallet } = useAppSelector((state) => state.wallet);
    const { setKeyStore } = useActions();

    const checkIsValid = async (): Promise<boolean> => checkPasswordsValidation({ password: changeState.newPassword, rePassword: changeState.confirmNewPassword });

    const changePassword = async (): Promise<void> => {
        if (await checkIsValid()) {
            const keystore = await exportKeystore(changeState.currentPassword, changeState.newPassword, keyStore);

            if (keystore) {
                setKeyStore(keystore);
                setChangeState(initialChangeState);
                downloadFile(wallet.address + '.keystore', JSON.stringify(keystore));
                toast.success('Keystore exported successfully');
            } else {
                toast.error('Something went wrong');
            }
        }
    };

    return (
        <div className={styles.settings}>
            <div className={styles.settings_container}>
                <h1>Export Keystore</h1>
                <Input label="Current Password" type="password" placeholder="Current Password" value={changeState.currentPassword} onChange={(e) => setChangeState((prev) => ({ ...prev, currentPassword: e.target.value }))} pattern={CREATE_WALLET_VALIDATION.password} errorMessage={ERROR_MESSAGES.password} />
                <Input label="New Password" type="password" placeholder="New Password" value={changeState.newPassword} onChange={(e) => setChangeState((prev) => ({ ...prev, newPassword: e.target.value }))} pattern={CREATE_WALLET_VALIDATION.password} errorMessage={ERROR_MESSAGES.password} />
                <Input label="Confirm New Password" type="password" placeholder="Confirm New Password" value={changeState.confirmNewPassword} onChange={(e) => setChangeState((prev) => ({ ...prev, confirmNewPassword: e.target.value }))} pattern={CREATE_WALLET_VALIDATION.password} errorMessage={ERROR_MESSAGES.password} />
                <Button label="Export KeyStore" color="yellow" size="big" onClick={changePassword} />
            </div>
        </div>
    );
};
