import React from 'react';
import { useAppSelector } from 'store';
import { Button } from 'components/atoms/button/Button';
import axiosApi from 'config/axiosApi';
import styles from './faucet.module.scss';
import { WALLET_API } from 'store/endpoints';
import { toast } from 'react-toastify';

export const Faucet: React.FC = () => {
    const { wallet } = useAppSelector((state) => state.wallet);

    const faucet = async () => {
        try {
            axiosApi.post(WALLET_API.REQUEST_FAUCET, { receiver: wallet.address });
            toast.success("Faucet was claimed successfully!")
        } catch (error) {
            console.log(error, 'error in faucet');
            toast.error("Something went wrong")
        }
    };

    return (
        <div className={styles.faucet}>
            <div className={styles.faucet_container}>
                <h1>Receive Test Tokens</h1>
                <div className={styles.faucet_container_receive}>
                    <p>Receive to Address</p>
                    <span>{wallet.address}</span>
                </div>
                <div className={styles.faucet_container_button}>
                    <Button label="Receive" color="yellow" size="big" onClick={faucet} />
                    <p>Receive SPAY and SCPT on Script Testnet</p>
                    <p>Tokens are usually updated within one minute</p>
                </div>
            </div>
        </div>
    );
};
