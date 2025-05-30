import { ENode, EToken } from 'utils/types/token';

export interface IDepositStake {
    validatorNodeHolder: string;
    amount: number;
    node: ENode | null;
    password: string;
}
