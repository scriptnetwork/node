import React from 'react';
import { IWithdrawStake } from '../types';
import { Input } from 'components/atoms/input/Input';
import { Button } from 'components/atoms/button/Button';
import { SPAY_FEE } from 'utils/constants/fee';
import styles from '../withdrawStake.module.scss';

interface IStepTwo {
    withdrawState: IWithdrawStake;
    setWithdrawState: React.Dispatch<React.SetStateAction<IWithdrawStake>>;
    changeStep: () => void;
}

export const StepTwo: React.FC<IStepTwo> = ({ withdrawState, changeStep, setWithdrawState }) => {
    return (
        <div className={styles.withdrawStake_stepTwo}>
            <h1>You are Withdraw Stake From</h1>
            <p>Node Address</p>
            <div>
                <div className={styles.withdrawStake_stepTwo_line}>
                    <p>FROM</p>
                    <p>0x93EBDcE5d490B413ABde5d46E52f1595B3268C12</p>
                </div>
                <div className={styles.withdrawStake_stepTwo_line}>
                    <p>Transaction Fee</p>
                    <p>{SPAY_FEE} SPAY</p>
                </div>
            </div>
            <h3>Enter your wallet password to sign this transaction</h3>
            <Input type="password" value={withdrawState.password} onChange={(e) => setWithdrawState((prev) => ({ ...prev, password: e.target.value }))} placeholder="Write your password" />
            <Button label="Confirm & Withdraw Stake" size="big" color="yellow" onClick={changeStep} />
        </div>
    );
};
