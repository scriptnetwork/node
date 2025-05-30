import React from 'react';
import { NodeRunner as NodeRunnerComponent } from 'components/molecules/nodeRunner/NodeRunner';
import styles from './nodeRunner.module.scss';

const NodeRunner: React.FC = () => {
    return (
        <div className={styles.nodeRunner}>
            <NodeRunnerComponent />
        </div>
    );
};

export default NodeRunner;
