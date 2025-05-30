import React from 'react';
import { TableBody, TableHeader } from 'components/molecules/table/types';
import styles from './table.module.scss';

export const TABLE_HEADER: TableHeader = [
    {
        title: 'TXN No',
        value: 'txnNo',
        show: true,
    },
    {
        title: 'Date',
        value: 'date',
        show: true,
    },
    {
        title: 'TXN HASH',
        value: 'txnHash',
        show: true,
    },
    {
        title: 'TYPE',
        value: 'type',
        show: true,
    },
    {
        title: 'BLOCK',
        value: 'block',
        show: true,
    },
    {
        title: 'AMOUNT',
        value: 'amount',
        show: true,
    },
    {
        title: 'FROM',
        value: 'from',
        show: true,
    },
    {
        title: 'TO',
        value: 'to',
        show: true,
    },
];

export const TABLE_BODY_MOCK: TableBody = {
    txnNo: ['01', '02', '03', '04', '05'],
    date: ['5/1/24', '6/1/24', '7/1/24', '8/1/24', '9/1/24'],
    txnHash: [
        <p key={1} className={styles.yellow}>
            0x93ebdce5d490b413444444445
        </p>,
        <p key={2} className={styles.yellow}>
            0x93ebdce5d490b413444444445
        </p>,
        <p key={3} className={styles.yellow}>
            0x93ebdce5d490b413444444445
        </p>,
        <p key={4} className={styles.yellow}>
            0x93ebdce5d490b413444444445
        </p>,
        <p key={5} className={styles.yellow}>
            0x93ebdce5d490b413444444445
        </p>,
    ],
    type: ['Receive', 'Send', 'Receive', 'Send', 'Receive'],
    block: ['2334073', '2334073', '2334073', '2334073', '2334073'],
    amount: [
        '2SCPT & 5SPAY',
        '2SCPT & 5SPAY',
        '2SCPT & 5SPAY',
        '2SCPT & 5SPAY',
        '2SCPT & 5SPAY',
    ],
    from: [
        <p key={1} className={styles.yellow}>
            0xcaea64853e8c23d0
        </p>,
        <p key={2} className={styles.yellow}>
            0xcaea64853e8c23d0
        </p>,
        <p key={3} className={styles.yellow}>
            0xcaea64853e8c23d0
        </p>,
        <p key={4} className={styles.yellow}>
            0xcaea64853e8c23d0
        </p>,
        <p key={5} className={styles.yellow}>
            0xcaea64853e8c23d0
        </p>,
    ],
    to: [
        <p key={1} className={styles.yellow}>
            0x93ebdce5d490b413
        </p>,
        <p key={2} className={styles.yellow}>
            0x93ebdce5d490b413
        </p>,
        <p key={3} className={styles.yellow}>
            0x93ebdce5d490b413
        </p>,
        <p key={4} className={styles.yellow}>
            0x93ebdce5d490b413
        </p>,
        <p key={5} className={styles.yellow}>
            0x93ebdce5d490b413
        </p>,
    ],
};
