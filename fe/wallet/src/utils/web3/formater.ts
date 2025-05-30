export const toWei = (number: number) => {
    const decimals = 18;
    return BigInt(number) * BigInt(10 ** decimals);
};
