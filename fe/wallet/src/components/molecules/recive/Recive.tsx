import React, { useState } from 'react';
import { Button } from 'components/atoms/button/Button';
import { Select } from 'components/atoms/select/Select';
import { SEND_MOCK_OPTIONS } from 'utils/mocks/send/Send';
import { IOption } from 'utils/types/option';
import { Copy } from 'assets/svg';
import { QR } from 'assets/png';
import { useAppSelector } from 'store';
import { useCopyToClipboard } from 'hooks/useCopyToClipboard';
import styles from './recive.module.scss';

export const Recive: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<IOption>({
        label: 'Select Token',
        value: '',
    });
    const { wallet } = useAppSelector((state) => state.wallet);
    const { isCopied, copyToClipboard } = useCopyToClipboard();

    return (
        <div className={styles.recive}>
            <div className={styles.recive_container}>
                <div className={styles.recive_container_blured}>
                    <h1>Receive</h1>
                    <h2>My Public Address </h2>
                    <p>{wallet.address}</p>
                    <div className={styles.recive_container_blured_copyBox}>
                        <Button
                            label={
                                <div className={styles.copyButton}>
                                    <Copy />
                                    <span>Copy</span>
                                </div>
                            }
                            onClick={() => copyToClipboard(wallet.address)}
                            color="transparent"
                        />
                        {isCopied && <span className={styles.copyState}>Copied</span>}
                    </div>
                    <img src={QR} alt="QR" />
                    <Select label="Amount (to be tranasferred)" options={SEND_MOCK_OPTIONS} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
                    <Button label="Foucet" color="yellow" size="big" />
                    <span>Receive a small amount of SPAY and SCPT on Script Net</span>
                </div>
                <div className={styles.coming_soon}>Coming Soon</div>
            </div>
        </div>
    );
};
