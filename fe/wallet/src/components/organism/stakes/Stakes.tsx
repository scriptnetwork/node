import React, { useEffect, useState } from 'react';
import { WithdrawStake } from 'components/molecules/stakes/withdrawStake/WithdrawStake';
import { DepositStake } from 'components/molecules/stakes/depositStake/DepositStake';
import { TableBody } from 'components/molecules/table/types';
import { Table } from 'components/molecules/table/Table';
import { Button } from 'components/atoms/button/Button';
import { TABLE_HEADER } from 'utils/mocks/stakes/table';
import { Modal } from '../../molecules/modal/Modal';
import { useAppSelector } from 'store';
import { IStakesHistoryBack } from './types';
import { WALLET_API } from 'store/endpoints';
import axios from 'axios';
import dotool from 'dotool';
import { Reverse } from 'assets/svg';
import { toast } from 'react-toastify';
import styles from './stakes.module.scss';

export const Stakes: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showNextStep, setShowNextStep] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'Deposit' | 'Withdraw'>('Deposit');
    const [stakeHistory, setStakeHistory] = useState<TableBody>({} as TableBody);
    const { wallet } = useAppSelector((state) => state.wallet);

    const transformData = (data: IStakesHistoryBack[]) => {
        return data.reduce(
            (acc: TableBody, item) => {
                acc.type.push(item.type === 'gcp' ? 'Lightning' : item.type);
                acc.holder.push(item.holder);
                acc.scpt.push(item.amount.slice(0, -18));
                acc.withdrawn.push(item.withdrawn + '');
                acc.time.push(item.return_height);
                return acc;
            },
            { type: [], holder: [], scpt: [], withdrawn: [], time: [] },
        );
    };

    const openModal = (type: 'Deposit' | 'Withdraw'): void => {
        if (window.innerWidth >= 1024) {
            setIsOpen(true);
        } else {
            setShowNextStep(true);
        }
        setModalType(type);
    };

    const getStakingData = async (showToast: boolean = true) => {
        try {
            const { data } = await axios.get(`${dotool.BE_EXPLORER_URL}${WALLET_API.STAKE}/${wallet.address}`);
            const stakeHistory = transformData(data.body.sourceRecords);
            setStakeHistory(stakeHistory);
            if (showToast) {
                toast.success('Everything is up to date');
            }
        } catch (e) {
            console.log(e, 'error');
        }
    };

    useEffect(() => {
        getStakingData(false);
    }, []);

    return (
        <div className={styles.stakes}>
            <div className={styles.stakes_container}>
                {showNextStep ? (
                    <div className={styles.stakes_container_mobile_modal}>
                        <Button label="&times;" onClick={() => setShowNextStep(false)} color="transparent" />
                        {
                            {
                                Deposit: <DepositStake onClose={() => setIsOpen(false)} />,
                                Withdraw: <WithdrawStake onClose={() => setIsOpen(false)} />,
                            }[modalType]
                        }
                    </div>
                ) : (
                    <>
                        <h2>Stakes</h2>
                        <div className={styles.stakes_container_buttons}>
                            <Button label="Deposit Stake" size="big" color="transparent" onClick={() => openModal('Deposit')} />
                            <Button label="Withdraw Stake" size="big" color="transparent" onClick={() => openModal('Withdraw')} />
                            <Reverse className={styles.stakes_reverse} onClick={() => getStakingData()} />
                        </div>
                    </>
                )}
            </div>
            <Table header={TABLE_HEADER} body={stakeHistory} />
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                {
                    {
                        Deposit: <DepositStake onClose={() => setIsOpen(false)} />,
                        Withdraw: <WithdrawStake onClose={() => setIsOpen(false)} />,
                    }[modalType]
                }
            </Modal>
        </div>
    );
};
