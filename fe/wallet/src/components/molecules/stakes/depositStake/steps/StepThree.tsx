import React from 'react';
import { IDepositStake } from '../types';
import { Input } from 'components/atoms/input/Input';
import { Button } from 'components/atoms/button/Button';
import { useAppSelector } from 'store';
import { SPAY_FEE } from 'utils/constants/fee';
import { EToken } from 'utils/types/token';
import styles from '../depositStake.module.scss';

interface IStepThree {
    depositState: IDepositStake;
    setDepositState: React.Dispatch<React.SetStateAction<IDepositStake>>;
    changeStep: () => void;
}

export const StepThree: React.FC<IStepThree> = ({ depositState, setDepositState, changeStep }) => {
    const { wallet } = useAppSelector((state) => state.wallet);

    return (
        <div className={styles.depositStake_last}>
            <h1>You are Depositing</h1>
            <h2>{EToken.SCPT}</h2>
            <p>{depositState.node} Node Holder( Address )</p>
            <p className={styles.depositStake_last_holder}>{depositState.validatorNodeHolder}</p>
            <div>
                <div className={styles.depositStake_last_line}>
                    <p>FROM</p>
                    <p>{wallet.address}</p>
                </div>
                <div className={styles.depositStake_last_line}>
                    <p>Transaction Fee</p>
                    <p>{SPAY_FEE} SPAY</p>
                </div>
            </div>
            <h3>Enter your wallet password to sign this transaction</h3>
            <Input type="password" value={depositState.password} onChange={(e) => setDepositState((prev) => ({ ...prev, password: e.target.value }))} placeholder="Write your password" />
            <Button label="Confirm & Deposit Stake" size="big" color="yellow" onClick={changeStep} />
        </div>
    );
};
