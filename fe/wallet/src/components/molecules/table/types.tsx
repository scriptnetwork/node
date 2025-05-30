import React from 'react';

export type TableHeader = {
    title: string | React.ReactNode;
    value: string;
    show: boolean;
}[];

export type TableBody = {
    [key: string]: (string | number | React.ReactNode)[]
};
