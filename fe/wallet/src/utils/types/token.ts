import React, { ReactNode } from 'react';

export enum EToken {
    SPAY = 'SPAY',
    SCRIPT = 'SCRIPT',
    SCPT = 'SCPT',
    PTO = 'PTO',
}

export enum ENode {
    VALIDATOR = 'Validator',
    LIGHTING = 'Lighting',
    EDGE = 'Edge',
}

export interface IToken {
    token: (props: React.SVGProps<SVGSVGElement>) => ReactNode;
    name: string;
    price: number;
}
