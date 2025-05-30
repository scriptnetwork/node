import React from 'react';
import { Faucet as FaucetComponent } from '../../components/molecules/faucet/Faucet';
import styles from './faucet.module.scss';

const Faucet = () => {
    return (
        <div className={styles.faucet}>
            <FaucetComponent />
        </div>
    );
};

export default Faucet;