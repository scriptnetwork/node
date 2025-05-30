import React, { useEffect, useState } from 'react';
import { Select } from 'components/atoms/select/Select';
import { SEND_MOCK_OPTIONS } from 'utils/mocks/send/Send';
import { Button } from 'components/atoms/button/Button';
import { Input } from 'components/atoms/input/Input';
import { sendTokensTransaction } from 'utils/web3/transaction';
import { useAppSelector } from 'store';
import { ISendTokens, ValidationRule } from './types';
import { EToken } from 'utils/types/token';
import { toWei } from 'utils/web3/formater';
import { SPAY_FEE } from 'utils/constants/fee';
import styles from './send.module.scss';

const initialSendState: ISendTokens = {
    token: null,
    amount: 0,
    to: '',
};

export const Send: React.FC = () => {
    const [errors, setErrors] = useState<string[]>([]);
    const [sendTokensState, setSendTokensState] = useState<ISendTokens>(initialSendState);
    const [total, setTotal] = useState<Record<Exclude<EToken, EToken.SCRIPT | EToken.PTO>, number>>({
        [EToken.SPAY]: 0,
        [EToken.SCPT]: 0,
    });

    const { wallet } = useAppSelector((state) => state.wallet);

    const validate = (rules: ValidationRule[]) => {
        const errors = rules.filter((rule) => rule.condition).map((rule) => rule.message);
        setErrors(errors);
        return errors.length === 0;
    };

    const stepOneValidation = () =>
        validate([
            { condition: !sendTokensState.token, message: 'Token is required' },
            { condition: !sendTokensState.amount, message: 'Amount is required' },
            { condition: !sendTokensState.to, message: 'Reciver address is required' },
        ]);

    const sendTransaction = async (): Promise<void> => {
        try {
            if (!stepOneValidation()) return;

            const data = [
                {
                    address: sendTokensState.to,
                    scptwei: sendTokensState.token === EToken.SCPT ? toWei(sendTokensState.amount) : BigInt(0),
                    spaywei: sendTokensState.token !== EToken.SCPT ? toWei(sendTokensState.amount) : BigInt(0),
                },
            ];

            const success = await sendTokensTransaction(wallet.address, data, wallet.privateKey);

            if (success) {
                setSendTokensState(initialSendState);
            }
        } catch (err) {
            console.log(err, 'error in sending transaction');
        }
    };

    useEffect(() => {
        setTotal((prev) => ({
            ...prev,
            [EToken.SPAY]: sendTokensState.token === EToken.SPAY ? sendTokensState.amount : 0,
            [EToken.SCPT]: sendTokensState.token === EToken.SCPT ? sendTokensState.amount : 0,
        }));
    }, [sendTokensState]);

    return (
        <div className={styles.send}>
            <div className={styles.send_container}>
                <h1>Send Amount to User</h1>
                <Select label="Token" defaultValue={`Select Token`} options={SEND_MOCK_OPTIONS} selectedOption={SEND_MOCK_OPTIONS.find((elm) => elm.value === sendTokensState.token)} setSelectedOption={(e) => setSendTokensState((prev) => ({ ...prev, token: e.value as EToken }))} />
                <Input label="To (Wallet Address)" placeholder="Enter address here" value={sendTokensState.to} onChange={(e) => setSendTokensState((prev) => ({ ...prev, to: e.target.value }))} />
                <Input label="Amount (To be transferred)" placeholder="Enter amount to send " value={sendTokensState.amount} onChange={(e) => setSendTokensState((prev) => ({ ...prev, amount: +e.target.value }))} />
                <p className={styles.send_container_fee}>
                    Fee: {SPAY_FEE} SPAY
                    <br />
                    Total (SCPT: {total[EToken.SCPT]}, SPAY: {total[EToken.SPAY] + SPAY_FEE})
                </p>
                <Button label="Send" color="yellow" size="big" onClick={sendTransaction} />
                {!!errors.length && (
                    <div className={styles.send_error}>
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
