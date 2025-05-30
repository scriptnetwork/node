import React, { ReactNode } from 'react';
import styles from './button.module.scss';

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string | ReactNode;
    color?: 'yellow' | 'black' | 'white' | 'transparent';
    size?: 'small' | 'big';
}

export const Button: React.FC<IButton> = ({ color = 'black', label, size = 'small', onClick, ...rest }) => {
    return (
        <button onClick={onClick} className={`${styles.button} ${styles[color]} ${styles[size]}`} {...rest}>
            {label}
        </button>
    );
};
