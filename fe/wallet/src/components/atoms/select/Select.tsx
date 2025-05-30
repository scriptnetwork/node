import React, { useRef, useState } from 'react';
import { IOption } from 'utils/types/option';
import { useOutsideClick } from 'hooks/useOutSideClick';
import { Arrow } from 'assets/svg';
import styles from './select.module.scss';

interface ISelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: IOption[];
    label?: string;
    suggestion?: string;
    errorMessage?: string;
    selectedOption?: IOption;
    setSelectedOption: (e: IOption) => void;
}

export const Select: React.FC<ISelect> = ({ defaultValue, label, suggestion, options, selectedOption, setSelectedOption, ...rest }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const handleOptionClick = (option: IOption) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    useOutsideClick(ref, () => setIsOpen(false));

    return (
        <div className={styles.select} ref={ref}>
            <label htmlFor={rest.id}>{label}</label>
            <div className={`${styles.select_selected} ${isOpen ? styles.select_active : ''}`} onClick={() => setIsOpen(!isOpen)}>
                {selectedOption?.label || defaultValue}
                <Arrow />
            </div>
            {isOpen && (
                <ul className={styles.select_options}>
                    {options.map((option) => (
                        <li key={option.value} onClick={() => option.type !== 'disabled' && handleOptionClick(option)} className={option.type === 'disabled' ? styles.select_options_disabled : ''}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
            {suggestion && <span className={styles.select_suggestion}>{suggestion}</span>}
        </div>
    );
};
