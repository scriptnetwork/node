import { EToken } from 'utils/types/token';

export interface ISendTokens {
    token: EToken | null;
    amount: number;
    to: string;
}

export type ValidationRule = {
    condition: boolean;
    message: string;
};