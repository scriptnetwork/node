import React, { useEffect, useState } from 'react';
import { TableBody, TableHeader } from './types';
import { Button } from 'components/atoms/button/Button';
import styles from './table.module.scss';

interface ITable {
    header: TableHeader;
    body: TableBody;
    linesCount?: number;
}

export const Table: React.FC<ITable> = ({ header, body, linesCount }) => {
    const [showMore, setShowMore] = useState<boolean>(false);
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);

    useEffect(() => {
        if (linesCount) {
            setIsButtonVisible(linesCount < body[header[0].value].length);
        }
    }, [linesCount, body]);
 
    return (
        <div className={styles.container}>
            <div className={styles.table}>
                <table>
                    <thead>
                        <tr>
                            {header.map((item, index) => {
                                return <th key={index}>{item.title}</th>;
                            })}
                        </tr>
                    </thead>
                    {body[header[0].value] && <tbody>{!showMore ? body[header[0].value].slice(0, linesCount).map((_, rowIndex) => <tr key={rowIndex}>{header.map((col) => col.show && <td key={col.value}>{body[col.value][rowIndex]}</td>)}</tr>) : body[header[0].value].map((_, rowIndex) => <tr key={rowIndex}>{header.map((col) => col.show && <td key={col.value}>{body[col.value][rowIndex]}</td>)}</tr>)}</tbody>}
                </table>
            </div>
            {isButtonVisible && <Button label={!showMore ? 'View all' : 'Show less'} onClick={() => setShowMore(!showMore)} color="yellow" />}
        </div>
    );
};
