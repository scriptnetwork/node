import React from 'react';
import { IWithdrawStake } from '../types';
import { Input } from 'components/atoms/input/Input';
import { Button } from 'components/atoms/button/Button';
import dotool from 'dotool';
import styles from '../withdrawStake.module.scss';

interface IStepOne {
    withdrawState: IWithdrawStake;
    setWithdrawState: React.Dispatch<React.SetStateAction<IWithdrawStake>>;
    changeStep: () => void;
}

export const StepOne: React.FC<IStepOne> = ({ withdrawState, changeStep, setWithdrawState }) => {
    return (
        <div className={styles.withdrawStake_stepOne}>
            <h1>Withdraw Stake</h1>
            <div className={styles.withdrawStake_stepOne_node}>
                <Input label="Node Address" placeholder="Enter node address" value={withdrawState.validatorNodeAddress.toLowerCase()} onChange={(e) => setWithdrawState((prev) => ({ ...prev, validatorNodeAddress: e.target.value }))} />
                <Button label="This node" onClick={() => setWithdrawState((prev) => ({ ...prev, validatorNodeAddress: dotool.NODE_ADDRESS }))} size="big" color="transparent" />
            </div>
            <Button label="Withdraw Stake" onClick={changeStep} size="big" color="yellow" />
        </div>
    );
};
