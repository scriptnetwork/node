import React from 'react';
import { Logo } from 'assets/svg';
import styles from './unlockWalletHeader.module.scss';
import dotool from 'dotool';

export const UnlockWalletHeader: React.FC = () => {
    return (
        <div className={styles.container}>
            <Logo />
            <p className={styles.container_subHead}>
                {`${dotool.ss_network} ${dotool.system_version}`}
            </p>
        </div>
    );
};
