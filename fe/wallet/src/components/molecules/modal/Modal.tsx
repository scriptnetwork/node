import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'components/atoms/button/Button';
import { useOutsideClick } from 'hooks/useOutSideClick';
import styles from './modal.module.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    useOutsideClick(ref, onClose);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className={styles.modal} onClick={onClose} ref={ref}>
            <div className={styles.modal_container} onClick={(e) => e.stopPropagation()}>
                <Button label="&times;" onClick={onClose} color="transparent" />
                <div>{children}</div>
            </div>
        </div>,
        document.body,
    );
};
