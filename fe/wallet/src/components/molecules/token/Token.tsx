import React from 'react';
import { IToken as TokenType } from 'utils/types/token';
import { Reverse } from 'assets/svg';
import { toast } from 'react-toastify';
import styles from './token.module.scss';

export interface IToken {
    token: TokenType;
    fetchData: () => void;
}

export const Token: React.FC<IToken> = ({ token, fetchData }) => {
    return (
        <div className={styles.token}>
            {token.token({ className: styles.token_coin })}
            <div className={styles.token_info}>
                <h1>{token.name}</h1>
                <p>{token.price}</p>
            </div>
            <div className={styles.token_reverse}>
                <Reverse
                    onClick={() => {
                        fetchData();
                        toast.success('Pending for Update');
                    }}
                />
            </div>
        </div>
    );
};
