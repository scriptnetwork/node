// eslint-disable-next-line
// @ts-nocheck
import Bytes from 'eth-lib/lib/bytes';
import BigNumber from 'bignumber.js';
import RLP from 'eth-lib/lib/rlp';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import Hash from 'eth-lib/lib/hash';
import elliptic from 'elliptic';

const secp256k1 = new elliptic.ec('secp256k1');
const SHA3_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

class Tx {
    constructor() {}

    signBytes() {}

    getType() {}

    rlpInput() {}
}

// /**
//  * Check if string is HEX, requires a 0x in front
//  * @method isHexStrict
//  * @param {String} hex to be checked
//  * @returns {Boolean}
//  */
const isHexStrict = (hex) => {
    return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex);
};

/**
 * Convert a hex string to a byte array
 * Note: Implementation from crypto-js
 * @method hexToBytes
 * @param {String} hex
 * @returns {Array} the byte array
 */
const hexToBytes = (hex) => {
    hex = hex.toString(16);

    if (!isHexStrict(hex)) {
        throw new Error(`Given value "${hex}" is not a valid hex string.`);
    }

    hex = hex.replace(/^0x/i, '');
    hex = hex.length % 2 ? '0' + hex : hex;

    const bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }

    return bytes;
};

const bytesToHex = function (bytes) {
    const hex = [];
    for (let i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xf).toString(16));
    }
    return hex.join('');
};

BigNumber.prototype.pad = function (size) {
    let s = String(this);
    while (s.length < (size || 2)) {
        s = '0' + s;
    }
    return s;
};

const bnFromString = (str) => {
    const base = str.slice(0, 2) === '0x' ? 16 : 10;
    const bigNum = new BigNumber(str, base);
    const bigNumWithPad = '0x' + bigNum.pad(2);
    return bigNumWithPad; // Jieyi: return "0x00" instead of "0x" to be compatible with the Golang/Java signature
};

const encodeWei = (wei) => {
    if (wei === null || wei === undefined) {
        return Bytes.fromNat('0x0');
    } else if (wei.isEqualTo(new BigNumber(0))) {
        return Bytes.fromNat('0x0');
    } else {
        return Bytes.fromNumber(wei);
    }
};

class Coins {
    constructor(SCPTWei, SPAYWei) {
        this.SCPTWei = SCPTWei;
        this.SPAYWei = SPAYWei;
    }
    rlpInput() {
        const rlpInput = [encodeWei(this.SCPTWei), encodeWei(this.SPAYWei)];
        return rlpInput;
    }
}

class TxInput {
    constructor(address, SCPTWei, SPAYWei, sequence) {
        this.address = address;
        this.sequence = sequence;
        this.signature = '';

        if (SCPTWei || SPAYWei) {
            this.coins = new Coins(SCPTWei, SPAYWei);
        } else {
            //TODO should this be undefined or null?
            this.coins = new Coins(null, null);
        }
    }

    setSignature(signature) {
        this.signature = signature;
    }

    rlpInput() {
        let address = null;

        if (this.address) {
            address = this.address.toLowerCase();
        } else {
            address = Bytes.fromNat('0x0');
        }

        const rplInput = [address, this.coins.rlpInput(), Bytes.fromNumber(this.sequence), this.signature];

        return rplInput;
    }
}

class TxOutput {
    constructor(address, SCPTWei, SPAYWei) {
        this.address = address;
        if (SCPTWei || SPAYWei) {
            this.coins = new Coins(SCPTWei, SPAYWei);
        } else {
            //TODO should this be undefined or null?
            this.coins = new Coins(null, null);
        }
    }

    rlpInput() {
        let address = null;
        if (this.address) {
            address = this.address.toLowerCase();
        } else {
            address = '0x0000000000000000000000000000000000000000';
        }
        const rplInput = [address, this.coins.rlpInput()];
        return rplInput;
    }
}

const TxType = {
    TxTypeCoinbase: 0,
    TxTypeSlash: 1,
    TxTypeSend: 2,
    TxTypeReserveFund: 3,
    TxTypeReleaseFund: 4,
    TxTypeServicePayment: 5,
    TxTypeSplitRule: 6,
    TxTypeSmartContract: 7,
    TxTypeDepositStake: 8, // validator node
    TxTypeWithdrawStake: 9,
    TxTypeDepositStakeV2: 10, // lighting node
};

class EthereumTx {
    constructor(payload) {
        this.nonce = '0x0';
        this.gasPrice = '0x0';
        this.gas = '0x0';
        this.to = '0x0000000000000000000000000000000000000000';
        this.value = '0x0';
        this.input = payload;
    }

    rlpInput() {
        const rplInput = [Bytes.fromNat(this.nonce), Bytes.fromNat(this.gasPrice), Bytes.fromNat(this.gas), this.to.toLowerCase(), Bytes.fromNat(this.value), this.input];

        return rplInput;
    }
}

class SendTx extends Tx {
    constructor(senderAddr, outputs, feeInSPAYWei, senderSequence) {
        super();
        let totalSCPTWeiBN = new BigNumber(0);
        let totalSPAYWeiBN = new BigNumber(0);
        const feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei) ? feeInSPAYWei : new BigNumber(feeInSPAYWei);
        for (let i = 0; i < outputs.length; i++) {
            const output = outputs[i];
            const SCPTWei = output.scptwei;
            const SPAYWei = output.spaywei;
            const SCPTWeiBN = BigNumber.isBigNumber(SCPTWei) ? SCPTWei : new BigNumber(SCPTWei);
            const SPAYWeiBN = BigNumber.isBigNumber(SPAYWei) ? SPAYWei : new BigNumber(SPAYWei);
            totalSCPTWeiBN = totalSCPTWeiBN.plus(SCPTWeiBN);
            totalSPAYWeiBN = totalSPAYWeiBN.plus(SPAYWeiBN);
        }
        this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);
        const txInput = new TxInput(senderAddr, totalSCPTWeiBN, totalSPAYWeiBN.plus(feeInSPAYWeiBN), senderSequence);
        this.inputs = [txInput];
        this.outputs = [];
        for (let j = 0; j < outputs.length; j++) {
            const output = outputs[j];
            const address = output.address;
            const SCPTWei = output.scptwei;
            const SPAYWei = output.spaywei;
            const SCPTWeiBN = BigNumber.isBigNumber(SCPTWei) ? SCPTWei : new BigNumber(SCPTWei);
            const SPAYWeiBN = BigNumber.isBigNumber(SPAYWei) ? SPAYWei : new BigNumber(SPAYWei);
            const txOutput = new TxOutput(address, SCPTWeiBN, SPAYWeiBN);
            this.outputs.push(txOutput);
        }
    }

    setSignature(signature) {
        const input = this.inputs[0];
        input.setSignature(signature);
    }

    signBytes(chainID) {
        const sigz = [];
        for (let i = 0; i < this.inputs.length; i++) {
            const input = this.inputs[i];

            sigz[i] = input.signature;
            input.signature = '';
        }
        const encodedChainID = RLP.encode(Bytes.fromString(chainID));
        const encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
        const encodedTx = RLP.encode(this.rlpInput());
        const payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);
        const ethTxWrapper = new EthereumTx(payload);
        const signedBytes = RLP.encode(ethTxWrapper.rlpInput());
        for (let j = 0; j < this.inputs.length; j++) {
            const input = this.inputs[j];
            input.signature = sigz[j];
        }
        return signedBytes;
    }

    getType() {
        return TxType.TxTypeSend;
    }

    rlpInput() {
        const numInputs = this.inputs.length;
        const numOutputs = this.outputs.length;
        const inputBytesArray = [];
        const outputBytesArray = [];
        for (let i = 0; i < numInputs; i++) {
            inputBytesArray[i] = this.inputs[i].rlpInput();
        }

        for (let i = 0; i < numOutputs; i++) {
            outputBytesArray[i] = this.outputs[i].rlpInput();
        }
        const rlpInput = [this.fee.rlpInput(), inputBytesArray, outputBytesArray];
        return rlpInput;
    }
}

const StakePurposes = {
    StakeForValidator: 0,
    StakeForGuardian: 1,
    StakeForEdge: 2,
};

class StakeTx extends Tx {}

class DepositStakeTx extends StakeTx {
    constructor(source, holderAddress, stakeInSCPTWei, feeInSPAYWei, purpose, senderSequence) {
        super();
        const feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei) ? feeInSPAYWei : new BigNumber(feeInSPAYWei);
        this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);
        const stakeInSCPTWeiBN = BigNumber.isBigNumber(stakeInSCPTWei) ? stakeInSCPTWei : new BigNumber(stakeInSCPTWei);
        this.source = new TxInput(source, stakeInSCPTWeiBN, null, senderSequence);
        this.purpose = purpose;
        if (!holderAddress.startsWith('0x')) {
            holderAddress = '0x' + holderAddress;
        }
        this.holder = new TxOutput(holderAddress, stakeInSCPTWeiBN, null);
    }

    setSignature(signature) {
        const input = this.source;
        input.setSignature(signature);
    }

    signBytes(chainID) {
        const sig = this.source.signature;
        this.source.signature = '';
        const encodedChainID = RLP.encode(Bytes.fromString(chainID));
        const encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
        const encodedTx = RLP.encode(this.rlpInput());
        const payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);
        const ethTxWrapper = new EthereumTx(payload);
        const signedBytes = RLP.encode(ethTxWrapper.rlpInput());
        this.source.signature = sig;
        return signedBytes;
    }

    getType() {
        return TxType.TxTypeDepositStake;
    }

    rlpInput() {
        const rlpInput = [this.fee.rlpInput(), this.source.rlpInput(), this.holder.rlpInput(), this.purpose === 0 ? Bytes.fromNat('0x0') : Bytes.fromNumber(this.purpose)];

        return rlpInput;
    }
}

class DepositStakeV2Tx extends StakeTx {
    constructor(source, holderSummary, stakeInSCPTWei, feeInSPAYWei, purpose, senderSequence) {
        super();

        const feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei) ? feeInSPAYWei : new BigNumber(feeInSPAYWei);
        this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);

        const stakeInSCPTWeiBN = BigNumber.isBigNumber(stakeInSCPTWei) ? stakeInSCPTWei : new BigNumber(stakeInSCPTWei);
        this.source = new TxInput(source, stakeInSCPTWeiBN, null, senderSequence);

        this.purpose = purpose;

        //Parse out the info from the holder (summary) param
        if (!holderSummary.startsWith('0x')) {
            holderSummary = '0x' + holderSummary;
        }

        //Ensure correct size
        if (holderSummary.length !== 460) {
            //TODO: throw error
        }

        //let guardianKeyBytes = Bytes.fromString(holderSummary);
        const guardianKeyBytes = Bytes.toArray(holderSummary);

        //slice instead of subarray
        const holderAddressBytes = guardianKeyBytes.slice(0, 20);

        this.blsPubkeyBytes = guardianKeyBytes.slice(20, 68);
        this.blsPopBytes = guardianKeyBytes.slice(68, 164);
        this.holderSigBytes = guardianKeyBytes.slice(164);

        const holderAddress = Bytes.fromArray(holderAddressBytes);

        this.holder = new TxOutput(holderAddress, stakeInSCPTWeiBN, null);
    }

    setSignature(signature) {
        const input = this.source;
        input.setSignature(signature);
    }

    signBytes(chainID) {
        // Detach the existing signature from the source if any, so that we don't sign the signature
        const sig = this.source.signature;

        this.source.signature = '';

        const encodedChainID = RLP.encode(Bytes.fromString(chainID));
        const encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
        const encodedTx = RLP.encode(this.rlpInput());
        const payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

        // For ethereum tx compatibility, encode the tx as the payload
        const ethTxWrapper = new EthereumTx(payload);
        const signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

        // Attach the original signature back to the source
        this.source.signature = sig;

        return signedBytes;
    }

    getType() {
        return TxType.TxTypeDepositStakeV2;
    }

    rlpInput() {
        const rlpInput = [this.fee.rlpInput(), this.source.rlpInput(), this.holder.rlpInput(), Bytes.fromNumber(this.purpose), Bytes.fromArray(this.blsPubkeyBytes), Bytes.fromArray(this.blsPopBytes), Bytes.fromArray(this.holderSigBytes)];

        return rlpInput;
    }
}

class WithdrawStakeTx extends StakeTx {
    constructor(source, holder, feeInSPAYWei, purpose, senderSequence) {
        super();

        const feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei) ? feeInSPAYWei : new BigNumber(feeInSPAYWei);
        this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);

        this.source = new TxInput(source, null, null, senderSequence);

        this.holder = new TxOutput(holder, null, null);

        this.purpose = purpose;
    }

    setSignature(signature) {
        const input = this.source;
        input.setSignature(signature);
    }

    signBytes(chainID) {
        // Detach the existing signature from the source if any, so that we don't sign the signature
        const sig = this.source.signature;
        this.source.signature = '';

        const encodedChainID = RLP.encode(Bytes.fromString(chainID));
        const encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
        const encodedTx = RLP.encode(this.rlpInput());
        const payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

        // For ethereum tx compatibility, encode the tx as the payload
        const ethTxWrapper = new EthereumTx(payload);
        const signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

        // Attach the original signature back to the source
        this.source.signature = sig;

        return signedBytes;
    }

    getType() {
        return TxType.TxTypeWithdrawStake;
    }

    rlpInput() {
        const rlpInput = [this.fee.rlpInput(), this.source.rlpInput(), this.holder.rlpInput(), this.purpose === 0 ? Bytes.fromNat('0x0') : Bytes.fromNumber(this.purpose)];

        return rlpInput;
    }
}

const sha3 = (value) => {
    if (isHexStrict(value) && /^0x/i.test(value.toString())) {
        value = hexToBytes(value);
    }

    const returnValue = Hash.keccak256(value);

    if (returnValue === SHA3_NULL_S) {
        return null;
    } else {
        return returnValue;
    }
};

const encodeSignature = ([v, r, s]) => Bytes.flatten([r, s, v]);

const makeSigner = (addToV) => (hash, privateKey) => {
    const ecKey = secp256k1.keyFromPrivate(new Buffer(privateKey.slice(2), 'hex'));
    const signature = ecKey.sign(new Buffer(hash.slice(2), 'hex'), { canonical: true });
    return encodeSignature([bnFromString(Bytes.fromNumber(addToV + signature.recoveryParam)), Bytes.pad(32, Bytes.fromNat('0x' + signature.r.toString(16))), Bytes.pad(32, Bytes.fromNat('0x' + signature.s.toString(16)))]);
};

const sign = makeSigner(0);

class TxSigner {
    static signAndSerializeTx(chainID, tx, privateKey) {
        const signedTx = this.signTx(chainID, tx, privateKey);

        const signedRawBytes = this.serializeTx(signedTx);

        return signedRawBytes;
    }

    static signTx(chainID, tx, privateKey) {
        const txRawBytes = tx.signBytes(chainID);
        const txHash = sha3(txRawBytes);
        const signature = sign(txHash, privateKey);
        tx.setSignature(signature);

        return tx;
    }

    static serializeTx(tx) {
        const encodedTxType = RLP.encode(Bytes.fromNumber(tx.getType()));
        const encodedTx = RLP.encode(tx.rlpInput());
        const signedRawBytes = encodedTxType + encodedTx.slice(2);

        return signedRawBytes;
    }
}

class SmartContractTx extends Tx {
    constructor(fromAddress, toAddress, gasLimit, gasPrice, data, value, senderSequence) {
        super();

        const valueWeiBN = BigNumber.isBigNumber(value) ? value : new BigNumber(value);

        this.from = new TxInput(fromAddress, null, valueWeiBN, senderSequence);
        this.to = new TxOutput(toAddress, null, null);

        this.gasLimit = gasLimit;
        this.gasPrice = gasPrice;

        if (!data.toLowerCase().startsWith('0x')) {
            data = '0x' + data;
        }

        this.data = Bytes.toArray(data);
    }

    setSignature(signature) {
        const input = this.from;
        input.setSignature(signature);
    }

    signBytes(chainID) {
        // Detach the existing signature from the source if any, so that we don't sign the signature
        const sig = this.from.signature;

        this.from.signature = '';

        const encodedChainID = RLP.encode(Bytes.fromString(chainID));
        const encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
        const encodedTx = RLP.encode(this.rlpInput());
        const payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

        // For ethereum tx compatibility, encode the tx as the payload
        const ethTxWrapper = new EthereumTx(payload);
        const signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

        // Attach the original signature back to the source
        this.from.signature = sig;

        return signedBytes;
    }

    getType() {
        return TxType.TxTypeSmartContract;
    }

    rlpInput() {
        const rlpInput = [this.from.rlpInput(), this.to.rlpInput(), Bytes.fromNumber(this.gasLimit), encodeWei(this.gasPrice), Bytes.fromArray(this.data)];

        return rlpInput;
    }
}

class EdgeNodeTx extends Tx {
    constructor(senderAddr, outputs, feeInSPAYWei, senderSequence) {
        super();

        let totalSCPTWeiBN = new BigNumber(0);
        let totalSPAYWeiBN = new BigNumber(0);
        const feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei) ? feeInSPAYWei : new BigNumber(feeInSPAYWei);

        for (let i = 0; i < outputs.length; i++) {
            const output = outputs[i];
            const SCPTWei = output.SCPTWei;
            const SPAYWei = output.SPAYWei;

            const SCPTWeiBN = BigNumber.isBigNumber(SCPTWei) ? SCPTWei : new BigNumber(SCPTWei);
            const SPAYWeiBN = BigNumber.isBigNumber(SPAYWei) ? SPAYWei : new BigNumber(SPAYWei);

            totalSCPTWeiBN = totalSCPTWeiBN.plus(SCPTWeiBN);
            totalSPAYWeiBN = totalSPAYWeiBN.plus(SPAYWeiBN);
        }

        this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);

        const txInput = new TxInput(senderAddr, totalSCPTWeiBN, totalSPAYWeiBN.plus(feeInSPAYWeiBN), senderSequence);
        this.inputs = [txInput];

        this.outputs = [];
        for (let j = 0; j < outputs.length; j++) {
            const output = outputs[j];
            const address = output.address;
            const SCPTWei = output.SCPTWei;
            const SPAYWei = output.SPAYWei;

            const SCPTWeiBN = BigNumber.isBigNumber(SCPTWei) ? SCPTWei : new BigNumber(SCPTWei);
            const SPAYWeiBN = BigNumber.isBigNumber(SPAYWei) ? SPAYWei : new BigNumber(SPAYWei);

            const txOutput = new TxOutput(address, SCPTWeiBN, SPAYWeiBN);

            this.outputs.push(txOutput);
        }
    }

    setSignature(signature) {
        const input = this.inputs[0];
        input.setSignature(signature);
    }

    signBytes(chainID) {
        const sigz = [];

        for (let i = 0; i < this.inputs.length; i++) {
            const input = this.inputs[i];

            sigz[i] = input.signature;
            input.signature = '';
        }

        const encodedChainID = RLP.encode(Bytes.fromString(chainID));
        const encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
        const encodedTx = RLP.encode(this.rlpInput());
        const payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

        // For ethereum tx compatibility, encode the tx as the payload
        const ethTxWrapper = new EthereumTx(payload);
        const signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

        // Attach the original signature back to the inputs
        for (let j = 0; j < this.inputs.length; j++) {
            const input = this.inputs[j];

            input.signature = sigz[j];
        }

        return signedBytes;
    }

    getType() {
        return TxType.TxTypeReserveFund;
    }

    rlpInput() {
        const numInputs = this.inputs.length;
        const numOutputs = this.outputs.length;
        const inputBytesArray = [];
        const outputBytesArray = [];

        for (let i = 0; i < numInputs; i++) {
            inputBytesArray[i] = this.inputs[i].rlpInput();
        }

        for (let i = 0; i < numOutputs; i++) {
            outputBytesArray[i] = this.outputs[i].rlpInput();
        }

        const rlpInput = [this.fee.rlpInput(), inputBytesArray, outputBytesArray];

        return rlpInput;
    }
}

export const scriptJS = {
    SendTx,
    DepositStakeTx,
    DepositStakeV2Tx,
    WithdrawStakeTx,
    SmartContractTx,
    TxSigner,
    EdgeNodeTx,
    StakePurposes,
    Utils: {
        hexToBytes,
        bytesToHex,
    },
};
