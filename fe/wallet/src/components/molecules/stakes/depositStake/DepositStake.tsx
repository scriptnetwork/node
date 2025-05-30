import React, { useState } from 'react';
import { IDepositStake } from './types';
import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { StepThree } from './steps/StepThree';
import { useAppSelector } from 'store';
import { checkIsValidPassword } from 'utils/web3/wallet';
import { toast } from 'react-toastify';
import { stakeTransaction } from 'utils/web3/transaction';
import styles from './depositStake.module.scss';

type ValidationRule = {
    condition: boolean;
    message: string;
};

interface IDepositStakeComponent {
    onClose: CallableFunction;
}

export const DepositStake: React.FC<IDepositStakeComponent> = ({ onClose }) => {
    const [step, setStep] = useState<number>(0);
    const [errors, setErrors] = useState<string[]>([]);
    const [depositState, setDepositState] = useState<IDepositStake>({
        validatorNodeHolder: '',
        amount: 0,
        node: null,
        password: '',
    });

    const { wallet, keyStore } = useAppSelector((state) => state.wallet);

    const validate = (rules: ValidationRule[]) => {
        const errors = rules.filter((rule) => rule.condition).map((rule) => rule.message);
        setErrors(errors);
        return errors.length === 0;
    };

    const stepOneValidation = () => {
        return validate([
            { condition: depositState.amount ===  0, message: 'Amount must be greater than 0' },
            { condition: !depositState.validatorNodeHolder, message: 'Node Address is required' },
        ]);
    };

    const stepTwoValidation = () => {
        return validate([{ condition: depositState.node === null, message: 'Node is required' }]);
    };

    const setDeposit = async () => {
        try {
            const isValidPassword = await checkIsValidPassword(JSON.stringify(keyStore), depositState.password);

            if (!isValidPassword) {
                setErrors(['Invalid password']);
            } else {
                setErrors([]);
                try {
                    stakeTransaction(depositState.validatorNodeHolder, depositState.node!, wallet.address, depositState.amount, wallet.privateKey)
                        .then(() => toast.success('Staking was done successfully!'))
                        .catch((error) => {
                            console.log(error, 'error in deposit');
                        });
                } catch (error) {
                    console.log(error, 'error in deposit');
                    toast.error('Something went wrong');
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
            1: stepTwoValidation,
            2: setDeposit,
        };

        if (!stepActions[step]()) {
            return;
        }

        if (step === 2) {
            onClose();
        } else {
            setStep((prev) => prev + 1);
        }
    };

    return (
        <div className={styles.depositStake}>
            {
                {
                    0: <StepOne depositState={depositState} setDepositState={setDepositState} changeStep={changeStep} />,
                    1: <StepTwo depositState={depositState} setDepositState={setDepositState} changeStep={changeStep} />,
                    2: <StepThree depositState={depositState} setDepositState={setDepositState} changeStep={changeStep} />,
                }[step]
            }
            {errors.map((error, index) => (
                <p key={index} className={styles.depositStake_error}>
                    {error}
                </p>
            ))}
        </div>
    );
};
