import { EToken } from 'utils/types/token';

export function tokenTypeToTokenName(tokenType: EToken): string {
    return EToken[tokenType] || '';
}
