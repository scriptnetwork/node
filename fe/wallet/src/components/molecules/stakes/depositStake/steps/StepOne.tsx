import React from 'react';
import { IDepositStake } from '../types';
import { Input } from 'components/atoms/input/Input';
import { Button } from 'components/atoms/button/Button';
import axiosApi from 'config/axiosApi';
import { WALLET_API } from 'store/endpoints';
import styles from '../depositStake.module.scss';

interface IStepOne {
    depositState: IDepositStake;
    setDepositState: React.Dispatch<React.SetStateAction<IDepositStake>>;
    changeStep: () => void;
}

export const StepOne: React.FC<IStepOne> = ({ depositState, setDepositState, changeStep }) => {
    const setNode = async () => {
        try {
            const { data } = await axiosApi.get(WALLET_API.GET_LIGHTNING_NODE_INFO);
            setDepositState((prev) => ({ ...prev, validatorNodeHolder: data.data.result.summary }));
        } catch (e) {
            console.log(e, 'error in get node');
        }
    };

    return (
        <div className={styles.depositStake_first}>
            <h1>Deposit Stake</h1>
            <div className={styles.depositStake_first_node}>
                <Input label="Node Address" placeholder="Enter node address" value={depositState.validatorNodeHolder.toLowerCase()} onChange={(e) => setDepositState((prev) => ({ ...prev, validatorNodeHolder: e.target.value }))} />
                <Button label="This node" onClick={setNode} size="big" color="transparent" />
            </div>
            <Input label="Amount" placeholder="Enter amount to stake" value={depositState.amount} onChange={(e) => setDepositState((prev) => ({ ...prev, amount: +e.target.value }))} />
            <Button label="Deposit Stake" onClick={changeStep} size="big" color="yellow" />
        </div>
    );
};
