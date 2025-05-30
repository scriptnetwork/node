import React from 'react';
import { checkValidation } from 'utils/validation/wallet';
import styles from './input.module.scss';

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.LegacyRef<HTMLInputElement>;
    label?: string;
    error?: string;
    suggestion?: string;
    errorMessage?: string;
}

export const Input: React.FC<IInput> = ({ ref, onChange, name, type, id, label, value, placeholder, error, suggestion, errorMessage, ...rest }) => {
    return (
        <div className={`${styles.input} ${type !== 'checkbox' ? styles.fullWidth : ''}`}>
            <label htmlFor={id}>{label}</label>
            {type === 'file' ? (
                <div className={styles.input_file}>
                    <input id="file" type="file" onChange={onChange} />
                    <label htmlFor="file" className={value ? styles.input_file_active : ''}>
                        {value ? 'File Chosen' : placeholder}
                    </label>
                </div>
            ) : (
                <input id={id} type={type} name={name} ref={ref} onChange={onChange} className={`${value ? styles.input_active : ''} ${type === 'file' ? styles[type] : ''}`} placeholder={placeholder} value={value} {...rest} />
            )}
            {error && <span className={styles.input_error}>{error}</span>}
            {!!value && rest.pattern && !checkValidation({ value: value as string, regexp: rest.pattern }) && <span className={styles.input_error}>{errorMessage}</span>}
            {suggestion && <span className={styles.input_suggestion}>{suggestion}</span>}
        </div>
    );
};
