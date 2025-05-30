import React from 'react';
import { Settings as SettingsComponent } from 'components/molecules/settings/Settings';
import styles from './settings.module.scss';

const Settings: React.FC = () => {
    return (
        <div className={styles.settings}>
            <SettingsComponent />
        </div>
    );
};

export default Settings;
