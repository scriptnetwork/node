import React from 'react';
import { footerItems } from './const';
import styles from './footer.module.scss';

export const Footer: React.FC = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footer_container}>
                {Object.keys(footerItems).map((key, index) => {
                    return (
                        <div key={index}>
                            <h3>{key}</h3>
                            <div>
                                {footerItems[key].map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <a href={item.link}>{item.title}</a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <p>Copyright © 2025 script network</p>
        </div>
    );
};
