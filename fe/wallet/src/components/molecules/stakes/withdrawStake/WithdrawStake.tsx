import React, { useState } from 'react';
import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { IWithdrawStake } from './types';
import { checkIsValidPassword } from 'utils/web3/wallet';
import { useAppSelector } from 'store';
import { toast } from 'react-toastify';
import { withdrawStakeTransaction } from 'utils/web3/transaction';
import { ENode } from 'utils/types/token';
import styles from './withdrawStake.module.scss';

type ValidationRule = {
    condition: boolean;
    message: string;
};

interface IWithdrawStakeComponent {
    onClose: CallableFunction;
}

export const WithdrawStake: React.FC<IWithdrawStakeComponent> = ({ onClose }) => {
    const [step, setStep] = useState<number>(0);
    const [errors, setErrors] = useState<string[]>([]);
    const [withdrawState, setWithdrawState] = useState<IWithdrawStake>({
        validatorNodeAddress: '',
        password: '',
    });

    const { wallet, keyStore } = useAppSelector((state) => state.wallet);

    const validate = (rules: ValidationRule[]) => {
        const errors = rules.filter((rule) => rule.condition).map((rule) => rule.message);
        setErrors(errors);
        return errors.length === 0;
    };

    const stepOneValidation = () => {
        return validate([{ condition: !withdrawState.validatorNodeAddress, message: 'Holder address required' }]);
    };

    const startWithdraw = async () => {
        try {
            const isValidPassword = await checkIsValidPassword(JSON.stringify(keyStore), withdrawState.password);

            if (!isValidPassword) {
                setErrors(['Invalid password']);
            } else {
                setErrors([]);
                try {
                    withdrawStakeTransaction(withdrawState.validatorNodeAddress, ENode.LIGHTING, wallet.address, wallet.privateKey).catch((error) => {
                        console.log(error, 'error in deposit');
                    });
                    toast.success('Withdraw was done successfully!');
                } catch (error) {
                    console.log(error, 'error in deposit');
                    toast.success('Something went wrong');
                }
            }

            return isValidPassword;
        } catch (error) {
            console.log(error);
        }
    };

    const changeStep = () => {
        const stepActions: { [key: number]: CallableFunction } = {
            0: stepOneValidation,
            1: startWithdraw,
        };

        if (!stepActions[step]()) {
            return;
        }

        if (step === 1) {
            onClose();
        } else {
            setStep((prev) => prev + 1);
        }
    };

    return (
        <div className={styles.withdrawStake}>
            {
                {
                    0: <StepOne withdrawState={withdrawState} setWithdrawState={setWithdrawState} changeStep={changeStep} />,
                    1: <StepTwo withdrawState={withdrawState} setWithdrawState={setWithdrawState} changeStep={changeStep} />,
                }[step]
            }
            {errors.map((error, index) => (
                <p key={index} className={styles.withdrawStake_error}>
                    {error}
                </p>
            ))}
        </div>
    );
};
