export const CREATE_WALLET_VALIDATION: { [key: string]: string } = {
    password: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
};

export const checkValidation = ({ value, regexp }: { value: string | number; regexp: string }): boolean => new RegExp(regexp).test(value as string);

export const checkPasswordsValidation = ({ password, rePassword }: { password: string; rePassword: string }): boolean => password === rePassword && new RegExp(CREATE_WALLET_VALIDATION.password).test(password);

export const checkIsValidMnemonic = (mnemonic: string): boolean => mnemonic.trim().split(' ').length === 12;
