import React from 'react';
import { Send as SendComponent } from 'components/molecules/send/Send';
import styles from './send.module.scss';

const Send: React.FC = () => {
    return (
        <div className={styles.send}>
            <SendComponent />
        </div>
    );
};

export default Send;
