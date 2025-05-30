import React from 'react';
import { Token } from 'assets/svg';
import { IToken } from 'utils/types/token';

export const TOKEN_MOCK: IToken[] = [
    {
        token: (props) => <Token {...props} />,
        name: 'SCPT',
        price: 0,
    },
    {
        token: (props) => <Token {...props} />,
        name: 'SPAY',
        price: 0,
    },
];
