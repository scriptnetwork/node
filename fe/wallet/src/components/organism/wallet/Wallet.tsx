import React, { useEffect, useState } from 'react';
import { Wallet as WalletImg } from 'assets/png';
import { EWALLETS } from 'utils/types/wallet';
import { useParams, useNavigate } from 'react-router-dom';
import { ACTIVE_WALLET_LINK } from './consts';
import { WalletForm } from 'components/molecules/walletForm/WalletForm';
import { ITabs } from './types';
import { MnemonicPhrase } from 'components/molecules/mnemonicPhrase/MnemonicPhrase';
import { ReadyWallet } from 'components/molecules/readyWallet/ReadyWallet';
import { createWallet, downloadFile } from 'utils/web3/wallet';
import { useActions } from 'hooks/useActions';
import styles from './wallet.module.scss';

export const Wallet: React.FC = () => {
    const [step, setStep] = useState<number>(0);
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPhrase, setShowPhrase] = useState<boolean>(false);
    const [tabs, setTabs] = useState<ITabs[]>(
        Object.values(EWALLETS).map((wallet, index) => ({
            title: wallet,
            active: false,
            link: '/unlock/' + Object.keys(ACTIVE_WALLET_LINK)[index],
        })),
    );
    const { setOneTimeWallet } = useActions();
    const navigate = useNavigate();
    const { type } = useParams<{ type: string }>();

    const submitSecondStep = () => {
        if (!showPhrase) {
            setShowPhrase(true);
        } else {
            setStep((prev) => ++prev);
        }
    };

    const submitFirstStep = async () => {
        if (type === 'create') {
            const data = await createWallet(password);
            if (data) {
                setOneTimeWallet(data.wallet);
                downloadFile(data.wallet.address + '.keystore', JSON.stringify(data.keystore));
                setStep((prev) => ++prev);
            }
        }
    };

    useEffect(() => {
        if (type) {
            const newTabs = tabs.map((tab) => ({
                ...tab,
                active: tab.title === ACTIVE_WALLET_LINK[type],
            }));
            setTabs(newTabs);
            setLogin('');
            setPassword('');
            setStep(0);
        }
    }, [type]);

    return (
        <div className={styles.wallet}>
            <img src={WalletImg} alt="wallet" />
            {
                {
                    0: (
                        <>
                            {type === 'create' ? (
                                <WalletForm login={login} setLogin={setLogin} password={password} setPassword={setPassword} submit={submitFirstStep} />
                            ) : (
                                <div className={styles.wallet_container}>
                                    <div className={styles.wallet_container_tabs}>
                                        {tabs.map((tab, index) => (
                                            <div key={index} className={tab.active ? styles.wallet_container_tabs_active : ''} onClick={() => navigate(tab.link)}>
                                                {tab.title}
                                            </div>
                                        ))}
                                    </div>
                                    <WalletForm login={login} setLogin={setLogin} password={password} setPassword={setPassword} type={ACTIVE_WALLET_LINK[type!]} submit={submitFirstStep} />
                                </div>
                            )}
                        </>
                    ),
                    1: <MnemonicPhrase onSubmit={submitSecondStep} showPhrase={showPhrase} />,
                    2: <ReadyWallet onSumbit={() => navigate('/unlock/keystore-file')} />,
                }[step]
            }
        </div>
    );
};
