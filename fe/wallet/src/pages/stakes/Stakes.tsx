import React from 'react';
import { Stakes as StakesComponent } from 'components/organism/stakes/Stakes';
import styles from './stakes.module.scss';

const Stakes: React.FC = () => {
    return (
        <div className={styles.stakes}>
            <StakesComponent />
        </div>
    );
};

export default Stakes;
