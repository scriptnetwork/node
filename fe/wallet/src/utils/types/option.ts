import React, { ReactNode } from 'react';

export interface IOption {
  value: string | number;
  label: string | ReactNode;
  type?: 'disabled';
}
