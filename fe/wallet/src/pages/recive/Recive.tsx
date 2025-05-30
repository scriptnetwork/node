import React from 'react';
import { Recive as RectiveComponent } from 'components/molecules/recive/Recive';
import styles from './recive.module.scss';

const Recive: React.FC = () => {
    return (
        <div className={styles.recive}>
            <RectiveComponent />
        </div>
    );
};

export default Recive;
