import React from 'react';
import { Token } from 'assets/svg';
import { IOption } from 'utils/types/option';
import { EToken } from 'utils/types/token';

export const SEND_MOCK_OPTIONS: IOption[] = [
    {
        label: (
            <div>
                <Token />
                <p>SCPT</p>
            </div>
        ),
        value: EToken.SCPT,
    },
    {
        label: (
            <div>
                <Token />
                <p>SPAY</p>
            </div>
        ),
        value: EToken.SPAY,
    },
];

export const TOKENS_OPTIONS: IOption[] = [
    {
        label: (
            <div>
                <Token />
                <p>SCPT (10000 Minimum)</p>
            </div>
        ),
        value: 'scpt',
    },
    {
        label: (
            <div>
                <Token />
                <p>SPAY (Not available)</p>
            </div>
        ),
        value: 'spay',
        type: 'disabled',
    },
];