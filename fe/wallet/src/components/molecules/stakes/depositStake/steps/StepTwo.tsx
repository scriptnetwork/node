import React from 'react';
import { IDepositStake } from '../types';
import { ENode } from 'utils/types/token';
import { Button } from 'components/atoms/button/Button';
import styles from '../depositStake.module.scss';

interface IStepTwo {
    depositState: IDepositStake;
    setDepositState: React.Dispatch<React.SetStateAction<IDepositStake>>;
    changeStep: () => void;
}

interface NodeOptionProps {
    isActive: boolean;
    title: string;
    description: string;
    onClick: () => void;
}

const NodeOption: React.FC<NodeOptionProps> = ({ isActive, onClick, title, description }) => (
    <div className={`${isActive ? styles.depositStake_second_active : ''} ${styles.depositStake_second_node}`} onClick={onClick}>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

export const StepTwo: React.FC<IStepTwo> = ({ depositState, setDepositState, changeStep }) => (
    <div className={styles.depositStake_second}>
        <h1>Deposit Stake</h1>
        <NodeOption isActive={depositState.node === ENode.VALIDATOR} onClick={() => setDepositState((prev) => ({ ...prev, node: ENode.VALIDATOR }))} title="Validator Node" description="Deposit stake to a Validator node" />
        <NodeOption isActive={depositState.node === ENode.LIGHTING} onClick={() => setDepositState((prev) => ({ ...prev, node: ENode.LIGHTING }))} title="Lighting Node" description="Deposit stake to a Lighting node" />
        {/* not avalible yet */}
        {/* <NodeOption isActive={depositState.node === ENode.EDGE} onClick={() => setDepositState((prev) => ({ ...prev, node: ENode.EDGE }))} title="Edge Node" description="Deposit stake to an Edge node" /> */}
        <Button label="Continue" onClick={changeStep} color="yellow" size="big" />
    </div>
);
