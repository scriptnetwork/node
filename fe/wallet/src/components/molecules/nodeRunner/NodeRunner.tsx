import React from 'react';
import { Button } from 'components/atoms/button/Button';
import dotool from 'dotool';
import styles from './nodeRunner.module.scss';

export const NodeRunner: React.FC = () => {
    const openDownload = () => {
        window.open(dotool.FE_DOC_URL + '/nodes/lightning-node-overview/validator-lightning-node-setup', '_blank');
    };

    return (
        <div className={styles.nodeRunner}>
            <div className={styles.nodeRunner_container}>
                <h1>Run a Node</h1>
                <Button onClick={openDownload} label="Run a Validator Node" size="big" color="yellow" />
                <Button onClick={openDownload} label="Run a Lightning Node" size="big" color="white" />
            </div>
        </div>
    );
};
