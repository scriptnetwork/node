// import isString from 'lodash/isString';
// import isNumber from 'lodash/isNumber';
// import BigNumber from 'bignumber.js';
// import Bytes from 'eth-lib/lib/bytes';
// import RLP from 'eth-lib/lib/rlp';
// import Hash from 'eth-lib/lib/hash';

const Bytes = require("eth-lib/lib/bytes");
const BigNumber = require("bignumber.js");
const RLP = require("eth-lib/lib/rlp");
const isString = require("lodash/isString");
const isNumber = require("lodash/isNumber");
const Hash = require("eth-lib/lib/hash");

class Tx {
  constructor() {}

  signBytes(chainID) {}

  getType() {}

  rlpInput() {}
}

// /**
//  * Check if string is HEX, requires a 0x in front
//  *
//  * @method isHexStrict
//  *
//  * @param {String} hex to be checked
//  *
//  * @returns {Boolean}
//  */
const isHexStrict = (hex) => {
  return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex);
};

/**
 * Convert a hex string to a byte array
 *
 * Note: Implementation from crypto-js
 *
 * @method hexToBytes
 *
 * @param {String} hex
 *
 * @returns {Array} the byte array
 */
const hexToBytes = (hex) => {
  hex = hex.toString(16);

  if (!isHexStrict(hex)) {
    throw new Error(`Given value "${hex}" is not a valid hex string.`);
  }

  hex = hex.replace(/^0x/i, "");
  hex = hex.length % 2 ? "0" + hex : hex;

  let bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

  return bytes;
};

// Convert a byte array to a hex string
const bytesToHex = function (bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xf).toString(16));
  }
  return hex.join("");
};

BigNumber.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

const bnFromString = (str) => {
  const base = str.slice(0, 2) === "0x" ? 16 : 10;
  const bigNum = new BigNumber(str, base);
  const bigNumWithPad = "0x" + bigNum.pad(2);
  return bigNumWithPad; // Jieyi: return "0x00" instead of "0x" to be compatible with the Golang/Java signature
};

const encodeWei = (wei) => {
  if (wei === null || wei === undefined) {
    return Bytes.fromNat("0x0");
  } else if (wei.isEqualTo(new BigNumber(0))) {
    return Bytes.fromNat("0x0");
  } else {
    return Bytes.fromNumber(wei);
  }
};

class Coins {
  constructor(SCPTWei, SPAYWei) {
    this.SCPTWei = SCPTWei;
    this.SPAYWei = SPAYWei;
  }

  // encodeWei(wei){
  //     if(wei === null || wei === undefined){
  //         return Bytes.fromNat("0x0");
  //     }
  //     else if(wei.isEqualTo(new BigNumber(0))){
  //         return Bytes.fromNat("0x0");
  //     }
  //     else{
  //         return Bytes.fromNumber(wei);
  //     }
  // }

  rlpInput() {
    let rlpInput = [
      encodeWei(this.SCPTWei),
      encodeWei(this.SPAYWei),
      //(this.SCPTWei.isEqualTo(new BigNumber(0))) ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.SCPTWei),
      //(this.SPAYWei.isEqualTo(new BigNumber(0))) ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.SPAYWei)
    ];

    return rlpInput;
  }
}

class TxInput {
  constructor(address, SCPTWei, SPAYWei, sequence) {
    this.address = address;
    this.sequence = sequence;
    this.signature = "";

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
      address = Bytes.fromNat("0x0");
    }

    let rplInput = [
      address,
      this.coins.rlpInput(),
      Bytes.fromNumber(this.sequence),
      this.signature,
    ];

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
      //Empty address
      address = "0x0000000000000000000000000000000000000000";
    }

    let rplInput = [address, this.coins.rlpInput()];

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
  TxTypeDepositStake: 8,
  TxTypeWithdrawStake: 9,
  TxTypeDepositStakeV2: 10,
};

class EthereumTx {
  constructor(payload) {
    this.nonce = "0x0";
    this.gasPrice = "0x0";
    this.gas = "0x0";
    this.to = "0x0000000000000000000000000000000000000000";
    this.value = "0x0";
    this.input = payload;
  }

  rlpInput() {
    let rplInput = [
      Bytes.fromNat(this.nonce),
      Bytes.fromNat(this.gasPrice),
      Bytes.fromNat(this.gas),
      this.to.toLowerCase(),
      Bytes.fromNat(this.value),
      this.input,
    ];

    return rplInput;
  }
}

class SendTx extends Tx {
  constructor(senderAddr, outputs, feeInSPAYWei, senderSequence) {
    super();

    let totalSCPTWeiBN = new BigNumber(0);
    let totalSPAYWeiBN = new BigNumber(0);
    let feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei)
      ? feeInSPAYWei
      : new BigNumber(feeInSPAYWei);

    for (var i = 0; i < outputs.length; i++) {
      let output = outputs[i];
      let SCPTWei = output.SCPTWei;
      let SPAYWei = output.SPAYWei;

      let SCPTWeiBN = BigNumber.isBigNumber(SCPTWei)
        ? SCPTWei
        : new BigNumber(SCPTWei);
      let SPAYWeiBN = BigNumber.isBigNumber(SPAYWei)
        ? SPAYWei
        : new BigNumber(SPAYWei);

      totalSCPTWeiBN = totalSCPTWeiBN.plus(SCPTWeiBN);
      totalSPAYWeiBN = totalSPAYWeiBN.plus(SPAYWeiBN);
    }

    this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);

    let txInput = new TxInput(
      senderAddr,
      totalSCPTWeiBN,
      totalSPAYWeiBN.plus(feeInSPAYWeiBN),
      senderSequence
    );

    this.inputs = [txInput];
    console.log(txInput, "tx input");

    this.outputs = [];
    for (var j = 0; j < outputs.length; j++) {
      let output = outputs[j];
      let address = output.address;
      let SCPTWei = output.SCPTWei;
      let SPAYWei = output.SPAYWei;

      let SCPTWeiBN = BigNumber.isBigNumber(SCPTWei)
        ? SCPTWei
        : new BigNumber(SCPTWei);
      let SPAYWeiBN = BigNumber.isBigNumber(SPAYWei)
        ? SPAYWei
        : new BigNumber(SPAYWei);

      let txOutput = new TxOutput(address, SCPTWeiBN, SPAYWeiBN);

      this.outputs.push(txOutput);
    }
  }

  setSignature(signature) {
    //TODO support multiple inputs
    let input = this.inputs[0];
    input.setSignature(signature);
  }

  signBytes(chainID) {
    let sigz = [];
    //let input = this.inputs[0];

    // Detach the existing signatures from the input if any, so that we don't sign the signature
    //let originalSignature = input.signature;
    //input.signature = "";

    // Detach the existing signatures from the input if any, so that we don't sign the signature
    for (var i = 0; i < this.inputs.length; i++) {
      let input = this.inputs[i];

      sigz[i] = input.signature;
      input.signature = "";
    }

    let encodedChainID = RLP.encode(Bytes.fromString(chainID));
    let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
    console.log("encodedTxType ", encodedTxType, this.getType());
    let encodedTx = RLP.encode(this.rlpInput());
    let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

    // For ethereum tx compatibility, encode the tx as the payload
    let ethTxWrapper = new EthereumTx(payload);
    let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

    // Attach the original signature back to the inputs
    //input.signature = originalSignature;

    // Attach the original signature back to the inputs
    for (var j = 0; j < this.inputs.length; j++) {
      let input = this.inputs[j];

      input.signature = sigz[j];
    }

    return signedBytes;
  }

  getType() {
    return TxType.TxTypeSend;
  }

  rlpInput() {
    let numInputs = this.inputs.length;
    let numOutputs = this.outputs.length;
    let inputBytesArray = [];
    let outputBytesArray = [];

    for (let i = 0; i < numInputs; i++) {
      inputBytesArray[i] = this.inputs[i].rlpInput();
    }

    for (let i = 0; i < numOutputs; i++) {
      outputBytesArray[i] = this.outputs[i].rlpInput();
    }

    let rlpInput = [this.fee.rlpInput(), inputBytesArray, outputBytesArray];

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
  constructor(
    source,
    holderAddress,
    stakeInSCPTWei,
    feeInSPAYWei,
    purpose,
    senderSequence
  ) {
    super();

    let feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei)
      ? feeInSPAYWei
      : new BigNumber(feeInSPAYWei);
    this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);

    let stakeInSCPTWeiBN = BigNumber.isBigNumber(stakeInSCPTWei)
      ? stakeInSCPTWei
      : new BigNumber(stakeInSCPTWei);
    this.source = new TxInput(source, stakeInSCPTWeiBN, null, senderSequence);

    this.purpose = purpose;

    //Parse out the info from the holder (summary) param
    if (!holderAddress.startsWith("0x")) {
      holderAddress = "0x" + holderAddress;
    }

    //Ensure correct size
    if (holderAddress.length !== 42) {
      //TODO: throw error
    }

    this.holder = new TxOutput(holderAddress, stakeInSCPTWeiBN, null);
  }

  setSignature(signature) {
    let input = this.source;
    input.setSignature(signature);
  }

  signBytes(chainID) {
    // Detach the existing signature from the source if any, so that we don't sign the signature
    let sig = this.source.signature;

    this.source.signature = "";

    let encodedChainID = RLP.encode(Bytes.fromString(chainID));
    let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
    console.log("encodedTxType 1-- ", this.getType(), encodedTxType);
    let encodedTx = RLP.encode(this.rlpInput());
    let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

    // For ethereum tx compatibility, encode the tx as the payload
    let ethTxWrapper = new EthereumTx(payload);
    let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

    // Attach the original signature back to the source
    this.source.signature = sig;
    return signedBytes;
  }

  getType() {
    return TxType.TxTypeDepositStake;
  }

  rlpInput() {
    let rlpInput = [
      this.fee.rlpInput(),
      this.source.rlpInput(),
      this.holder.rlpInput(),

      this.purpose === 0
        ? Bytes.fromNat("0x0")
        : Bytes.fromNumber(this.purpose),
    ];

    return rlpInput;
  }
}

class DepositStakeV2Tx extends StakeTx {
  constructor(
    source,
    holderSummary,
    stakeInSCPTWei,
    feeInSPAYWei,
    purpose,
    senderSequence
  ) {
    super();

    let feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei)
      ? feeInSPAYWei
      : new BigNumber(feeInSPAYWei);
    this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);

    let stakeInSCPTWeiBN = BigNumber.isBigNumber(stakeInSCPTWei)
      ? stakeInSCPTWei
      : new BigNumber(stakeInSCPTWei);
    this.source = new TxInput(source, stakeInSCPTWeiBN, null, senderSequence);

    this.purpose = purpose;

    //Parse out the info from the holder (summary) param
    if (!holderSummary.startsWith("0x")) {
      holderSummary = "0x" + holderSummary;
    }

    //Ensure correct size
    if (holderSummary.length !== 460) {
      //TODO: throw error
    }

    //let guardianKeyBytes = Bytes.fromString(holderSummary);
    let guardianKeyBytes = Bytes.toArray(holderSummary);

    //slice instead of subarray
    let holderAddressBytes = guardianKeyBytes.slice(0, 20);

    this.blsPubkeyBytes = guardianKeyBytes.slice(20, 68);
    this.blsPopBytes = guardianKeyBytes.slice(68, 164);
    this.holderSigBytes = guardianKeyBytes.slice(164);

    let holderAddress = Bytes.fromArray(holderAddressBytes);

    this.holder = new TxOutput(holderAddress, stakeInSCPTWeiBN, null);
  }

  setSignature(signature) {
    let input = this.source;
    input.setSignature(signature);
  }

  signBytes(chainID) {
    // Detach the existing signature from the source if any, so that we don't sign the signature
    let sig = this.source.signature;

    this.source.signature = "";

    let encodedChainID = RLP.encode(Bytes.fromString(chainID));
    let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
    console.log("encodedTxType 3-- ", this.getType(), encodedTxType);
    let encodedTx = RLP.encode(this.rlpInput());
    let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

    // For ethereum tx compatibility, encode the tx as the payload
    let ethTxWrapper = new EthereumTx(payload);
    let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

    // Attach the original signature back to the source
    this.source.signature = sig;

    return signedBytes;
  }

  getType() {
    return TxType.TxTypeDepositStakeV2;
  }

  rlpInput() {
    let rlpInput = [
      this.fee.rlpInput(),
      this.source.rlpInput(),
      this.holder.rlpInput(),

      Bytes.fromNumber(this.purpose),

      Bytes.fromArray(this.blsPubkeyBytes),
      Bytes.fromArray(this.blsPopBytes),
      Bytes.fromArray(this.holderSigBytes),
    ];

    return rlpInput;
  }
}

class WithdrawStakeTx extends StakeTx {
  constructor(source, holder, feeInSPAYWei, purpose, senderSequence) {
    super();

    let feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei)
      ? feeInSPAYWei
      : new BigNumber(feeInSPAYWei);
    this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);

    this.source = new TxInput(source, null, null, senderSequence);

    this.holder = new TxOutput(holder, null, null);

    this.purpose = purpose;
  }

  setSignature(signature) {
    let input = this.source;
    input.setSignature(signature);
  }

  signBytes(chainID) {
    // Detach the existing signature from the source if any, so that we don't sign the signature
    let sig = this.source.signature;
    this.source.signature = "";

    let encodedChainID = RLP.encode(Bytes.fromString(chainID));
    let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
    let encodedTx = RLP.encode(this.rlpInput());
    let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

    // For ethereum tx compatibility, encode the tx as the payload
    let ethTxWrapper = new EthereumTx(payload);
    let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

    // Attach the original signature back to the source
    this.source.signature = sig;

    return signedBytes;
  }

  getType() {
    return TxType.TxTypeWithdrawStake;
  }

  rlpInput() {
    let rlpInput = [
      this.fee.rlpInput(),
      this.source.rlpInput(),
      this.holder.rlpInput(),

      this.purpose === 0
        ? Bytes.fromNat("0x0")
        : Bytes.fromNumber(this.purpose),
    ];

    return rlpInput;
  }
}

const elliptic = require("elliptic");
const secp256k1 = new elliptic.ec("secp256k1"); // eslint-disable-line
const SHA3_NULL_S =
  "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";

const sha3 = (value) => {
  if (isHexStrict(value) && /^0x/i.test(value.toString())) {
    value = hexToBytes(value);
  }

  const returnValue = Hash.keccak256(value); // jshint ignore:line

  if (returnValue === SHA3_NULL_S) {
    return null;
  } else {
    return returnValue;
  }
};

const encodeSignature = ([v, r, s]) => Bytes.flatten([r, s, v]);

const makeSigner = (addToV) => (hash, privateKey) => {
  const ecKey = secp256k1.keyFromPrivate(
    new Buffer(privateKey.slice(2), "hex")
  );
  const signature = ecKey.sign(new Buffer(hash.slice(2), "hex"), {
    canonical: true,
  });
  return encodeSignature([
    bnFromString(Bytes.fromNumber(addToV + signature.recoveryParam)),
    Bytes.pad(32, Bytes.fromNat("0x" + signature.r.toString(16))),
    Bytes.pad(32, Bytes.fromNat("0x" + signature.s.toString(16))),
  ]);
};

const sign = makeSigner(0);

class TxSigner {
  static signAndSerializeTx(chainID, tx, privateKey) {
    let signedTx = this.signTx(chainID, tx, privateKey);
    let signedRawBytes = this.serializeTx(signedTx);

    return signedRawBytes;
  }

  static signTx(chainID, tx, privateKey) {
    let txRawBytes = tx.signBytes(chainID);
    let txHash = sha3(txRawBytes);
    let signature = sign(txHash, privateKey);
    tx.setSignature(signature);

    return tx;
  }

  static serializeTx(tx) {
    let encodedTxType = RLP.encode(Bytes.fromNumber(tx.getType()));
    console.log("encodedTxType 2-- ", tx.getType());
    let encodedTx = RLP.encode(tx.rlpInput()); // this time encode with signature
    let signedRawBytes = encodedTxType + encodedTx.slice(2);

    return signedRawBytes;
  }
}

// var Web3Utils = require('web3-utils');

class SmartContractTx extends Tx {
  constructor(
    fromAddress,
    toAddress,
    gasLimit,
    gasPrice,
    data,
    value,
    senderSequence
  ) {
    super();

    let valueWeiBN = BigNumber.isBigNumber(value)
      ? value
      : new BigNumber(value);

    this.from = new TxInput(fromAddress, null, valueWeiBN, senderSequence);
    this.to = new TxOutput(toAddress, null, null);

    this.gasLimit = gasLimit;
    this.gasPrice = gasPrice;

    if (data.toLowerCase().startsWith("0x") === false) {
      data = "0x" + data;
    }

    this.data = Bytes.toArray(data);
  }

  setSignature(signature) {
    let input = this.from;
    input.setSignature(signature);
  }

  signBytes(chainID) {
    // Detach the existing signature from the source if any, so that we don't sign the signature
    let sig = this.from.signature;

    this.from.signature = "";

    let encodedChainID = RLP.encode(Bytes.fromString(chainID));
    let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
    let encodedTx = RLP.encode(this.rlpInput());
    let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

    // For ethereum tx compatibility, encode the tx as the payload
    let ethTxWrapper = new EthereumTx(payload);
    let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

    // Attach the original signature back to the source
    this.from.signature = sig;

    return signedBytes;
  }

  getType() {
    return TxType.TxTypeSmartContract;
  }

  rlpInput() {
    let rlpInput = [
      this.from.rlpInput(),
      this.to.rlpInput(),

      Bytes.fromNumber(this.gasLimit),
      encodeWei(this.gasPrice),

      Bytes.fromArray(this.data),
    ];

    return rlpInput;
  }
}

// for edgeNode

class EdgeNodeTx extends Tx {
  constructor(senderAddr, outputs, feeInSPAYWei, senderSequence) {
    super();

    let totalSCPTWeiBN = new BigNumber(0);
    let totalSPAYWeiBN = new BigNumber(0);
    let feeInSPAYWeiBN = BigNumber.isBigNumber(feeInSPAYWei)
      ? feeInSPAYWei
      : new BigNumber(feeInSPAYWei);

    for (var i = 0; i < outputs.length; i++) {
      let output = outputs[i];
      let SCPTWei = output.SCPTWei;
      let SPAYWei = output.SPAYWei;

      let SCPTWeiBN = BigNumber.isBigNumber(SCPTWei)
        ? SCPTWei
        : new BigNumber(SCPTWei);
      let SPAYWeiBN = BigNumber.isBigNumber(SPAYWei)
        ? SPAYWei
        : new BigNumber(SPAYWei);

      totalSCPTWeiBN = totalSCPTWeiBN.plus(SCPTWeiBN);
      totalSPAYWeiBN = totalSPAYWeiBN.plus(SPAYWeiBN);
    }

    this.fee = new Coins(new BigNumber(0), feeInSPAYWeiBN);

    let txInput = new TxInput(
      senderAddr,
      totalSCPTWeiBN,
      totalSPAYWeiBN.plus(feeInSPAYWeiBN),
      senderSequence
    );
    this.inputs = [txInput];

    this.outputs = [];
    for (var j = 0; j < outputs.length; j++) {
      let output = outputs[j];
      let address = output.address;
      let SCPTWei = output.SCPTWei;
      let SPAYWei = output.SPAYWei;

      let SCPTWeiBN = BigNumber.isBigNumber(SCPTWei)
        ? SCPTWei
        : new BigNumber(SCPTWei);
      let SPAYWeiBN = BigNumber.isBigNumber(SPAYWei)
        ? SPAYWei
        : new BigNumber(SPAYWei);

      let txOutput = new TxOutput(address, SCPTWeiBN, SPAYWeiBN);

      this.outputs.push(txOutput);
    }
  }

  setSignature(signature) {
    //TODO support multiple inputs
    let input = this.inputs[0];
    input.setSignature(signature);
  }

  signBytes(chainID) {
    let sigz = [];
    //let input = this.inputs[0];

    // Detach the existing signatures from the input if any, so that we don't sign the signature
    //let originalSignature = input.signature;
    //input.signature = "";

    // Detach the existing signatures from the input if any, so that we don't sign the signature
    for (var i = 0; i < this.inputs.length; i++) {
      let input = this.inputs[i];

      sigz[i] = input.signature;
      input.signature = "";
    }

    let encodedChainID = RLP.encode(Bytes.fromString(chainID));
    let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
    console.log("encodedTxType ", encodedTxType, this.getType());
    let encodedTx = RLP.encode(this.rlpInput());
    let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

    // For ethereum tx compatibility, encode the tx as the payload
    let ethTxWrapper = new EthereumTx(payload);
    let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

    // Attach the original signature back to the inputs
    //input.signature = originalSignature;

    // Attach the original signature back to the inputs
    for (var j = 0; j < this.inputs.length; j++) {
      let input = this.inputs[j];

      input.signature = sigz[j];
    }

    return signedBytes;
  }

  getType() {
    return TxType.TxTypeReserveFund;
  }

  rlpInput() {
    let numInputs = this.inputs.length;
    let numOutputs = this.outputs.length;
    let inputBytesArray = [];
    let outputBytesArray = [];

    for (let i = 0; i < numInputs; i++) {
      inputBytesArray[i] = this.inputs[i].rlpInput();
    }

    for (let i = 0; i < numOutputs; i++) {
      outputBytesArray[i] = this.outputs[i].rlpInput();
    }

    let rlpInput = [this.fee.rlpInput(), inputBytesArray, outputBytesArray];

    return rlpInput;
  }
}

var index = {
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

module.exports = index;

// old code

// import isString from 'lodash/isString';
// import isNumber from 'lodash/isNumber';
// import BigNumber from 'bignumber.js';
// import Bytes from 'eth-lib/lib/bytes';
// import RLP from 'eth-lib/lib/rlp';
// import Hash from 'eth-lib/lib/hash';

// class Tx {
//     constructor() {

//     }

//     signBytes(chainID) {

//     }

//     getType() {

//     }

//     rlpInput() {

//     }
// }

// // /**
// //  * Check if string is HEX, requires a 0x in front
// //  *
// //  * @method isHexStrict
// //  *
// //  * @param {String} hex to be checked
// //  *
// //  * @returns {Boolean}
// //  */
// const isHexStrict = (hex) => {
//     return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex);
// };

// /**
//  * Convert a hex string to a byte array
//  *
//  * Note: Implementation from crypto-js
//  *
//  * @method hexToBytes
//  *
//  * @param {String} hex
//  *
//  * @returns {Array} the byte array
//  */
// const hexToBytes = (hex) => {
//     hex = hex.toString(16);

//     if (!isHexStrict(hex)) {
//         throw new Error(`Given value "${hex}" is not a valid hex string.`);
//     }

//     hex = hex.replace(/^0x/i, '');
//     hex = hex.length % 2 ? '0' + hex : hex;

//     let bytes = [];
//     for (let c = 0; c < hex.length; c += 2) {
//         bytes.push(parseInt(hex.substr(c, 2), 16));
//     }

//     return bytes;
// };

// // Convert a byte array to a hex string
// const bytesToHex = function (bytes) {
//     for (var hex = [], i = 0; i < bytes.length; i++) {
//         hex.push((bytes[i] >>> 4).toString(16));
//         hex.push((bytes[i] & 0xF).toString(16));
//     }
//     return hex.join("");
// };

// BigNumber.prototype.pad = function (size) {
//     var s = String(this);
//     while (s.length < (size || 2)) { s = "0" + s; }
//     return s;
// };

// const bnFromString = str => {
//     const base = str.slice(0, 2) === "0x" ? 16 : 10;
//     const bigNum = new BigNumber(str, base);
//     const bigNumWithPad = "0x" + bigNum.pad(2);
//     return bigNumWithPad; // Jieyi: return "0x00" instead of "0x" to be compatible with the Golang/Java signature
// };

// const encodeWei = (wei) => {
//     if (wei === null || wei === undefined) {
//         return Bytes.fromNat("0x0");
//     }
//     else if (wei.isEqualTo(new BigNumber(0))) {
//         return Bytes.fromNat("0x0");
//     }
//     else {
//         return Bytes.fromNumber(wei);
//     }
// };

// class Coins {
//     constructor(Scriptwei, ptowei) {
//         this.Scriptwei = Scriptwei;
//         this.ptowei = ptowei;
//     }

//     // encodeWei(wei){
//     //     if(wei === null || wei === undefined){
//     //         return Bytes.fromNat("0x0");
//     //     }
//     //     else if(wei.isEqualTo(new BigNumber(0))){
//     //         return Bytes.fromNat("0x0");
//     //     }
//     //     else{
//     //         return Bytes.fromNumber(wei);
//     //     }
//     // }

//     rlpInput() {

//         let rlpInput = [
//             encodeWei(this.Scriptwei),
//             encodeWei(this.ptowei),
//             //(this.Scriptwei.isEqualTo(new BigNumber(0))) ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.Scriptwei),
//             //(this.ptowei.isEqualTo(new BigNumber(0))) ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.ptowei)
//         ];

//         return rlpInput;
//     }
// }

// class TxInput {
//     constructor(address, Scriptwei, ptowei, sequence) {
//         this.address = address;
//         this.sequence = sequence;
//         this.signature = "";

//         if (Scriptwei || ptowei) {
//             this.coins = new Coins(Scriptwei, ptowei);
//         }
//         else {
//             //TODO should this be undefined or null?
//             this.coins = new Coins(null, null);
//         }
//     }

//     setSignature(signature) {
//         this.signature = signature;
//     }

//     rlpInput() {
//         let address = null;

//         if (this.address) {
//             address = this.address.toLowerCase();
//         }
//         else {
//             address = Bytes.fromNat("0x0");
//         }

//         let rplInput = [
//             address,
//             this.coins.rlpInput(),
//             Bytes.fromNumber(this.sequence),
//             this.signature
//         ];

//         return rplInput;
//     }
// }

// class TxOutput {
//     constructor(address, Scriptwei, ptowei) {
//         this.address = address;

//         if (Scriptwei || ptowei) {
//             this.coins = new Coins(Scriptwei, ptowei);
//         }
//         else {
//             //TODO should this be undefined or null?
//             this.coins = new Coins(null, null);
//         }
//     }

//     rlpInput() {
//         let address = null;

//         if (this.address) {
//             address = this.address.toLowerCase();
//         }
//         else {
//             //Empty address
//             address = "0x0000000000000000000000000000000000000000";
//         }

//         let rplInput = [
//             address,
//             this.coins.rlpInput()
//         ];

//         return rplInput;
//     }
// }

// const TxType = {
//     TxTypeCoinbase: 0,
//     TxTypeSlash: 1,
//     TxTypeSend: 2,
//     TxTypeReserveFund: 3,
//     TxTypeReleaseFund: 4,
//     TxTypeServicePayment: 5,
//     TxTypeSplitRule: 6,
//     TxTypeSmartContract: 7,
//     TxTypeDepositStake: 8,
//     TxTypeWithdrawStake: 9,
//     TxTypeDepositStakeV2: 10,
// };

// class EthereumTx {
//     constructor(payload) {
//         this.nonce = "0x0";
//         this.gasPrice = "0x0";
//         this.gas = "0x0";
//         this.to = "0x0000000000000000000000000000000000000000";
//         this.value = "0x0";
//         this.input = payload;
//     }

//     rlpInput() {
//         let rplInput = [
//             Bytes.fromNat(this.nonce),
//             Bytes.fromNat(this.gasPrice),
//             Bytes.fromNat(this.gas),
//             this.to.toLowerCase(),
//             Bytes.fromNat(this.value),
//             this.input,
//         ];

//         return rplInput;
//     }
// }

// class SendTx extends Tx {
//     constructor(senderAddr, outputs, feeInptowei, senderSequence) {
//         super();

//         let totalScriptweiBN = new BigNumber(0);
//         let totalptoweiBN = new BigNumber(0);
//         let feeInptoweiBN = BigNumber.isBigNumber(feeInptowei) ? feeInptowei : (new BigNumber(feeInptowei));

//         for (var i = 0; i < outputs.length; i++) {
//             let output = outputs[i];
//             let Scriptwei = output.Scriptwei;
//             let ptowei = output.ptowei;

//             let ScriptweiBN = BigNumber.isBigNumber(Scriptwei) ? Scriptwei : (new BigNumber(Scriptwei));
//             let ptoweiBN = BigNumber.isBigNumber(ptowei) ? ptowei : (new BigNumber(ptowei));

//             totalScriptweiBN = totalScriptweiBN.plus(ScriptweiBN);
//             totalptoweiBN = totalptoweiBN.plus(ptoweiBN);
//         }

//         this.fee = new Coins(new BigNumber(0), feeInptoweiBN);

//         let txInput = new TxInput(senderAddr, totalScriptweiBN, totalptoweiBN.plus(feeInptoweiBN), senderSequence);
//         this.inputs = [txInput];

//         this.outputs = [];
//         for (var j = 0; j < outputs.length; j++) {
//             let output = outputs[j];
//             let address = output.address;
//             let Scriptwei = output.Scriptwei;
//             let ptowei = output.ptowei;

//             let ScriptweiBN = BigNumber.isBigNumber(Scriptwei) ? Scriptwei : (new BigNumber(Scriptwei));
//             let ptoweiBN = BigNumber.isBigNumber(ptowei) ? ptowei : (new BigNumber(ptowei));

//             let txOutput = new TxOutput(address, ScriptweiBN, ptoweiBN);

//             this.outputs.push(txOutput);
//         }
//     }

//     setSignature(signature) {
//         //TODO support multiple inputs
//         let input = this.inputs[0];
//         input.setSignature(signature);
//     }

//     signBytes(chainID) {
//         let sigz = [];
//         //let input = this.inputs[0];

//         // Detach the existing signatures from the input if any, so that we don't sign the signature
//         //let originalSignature = input.signature;
//         //input.signature = "";

//         // Detach the existing signatures from the input if any, so that we don't sign the signature
//         for (var i = 0; i < this.inputs.length; i++) {
//             let input = this.inputs[i];

//             sigz[i] = input.signature;
//             input.signature = "";
//         }

//         let encodedChainID = RLP.encode(Bytes.fromString(chainID));
//         let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
//         let encodedTx = RLP.encode(this.rlpInput());
//         let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

//         // For ethereum tx compatibility, encode the tx as the payload
//         let ethTxWrapper = new EthereumTx(payload);
//         let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

//         console.log("SendTx :: signBytes :: txRawBytes = " + signedBytes);

//         // Attach the original signature back to the inputs
//         //input.signature = originalSignature;

//         // Attach the original signature back to the inputs
//         for (var j = 0; j < this.inputs.length; j++) {
//             let input = this.inputs[j];

//             input.signature = sigz[j];
//         }

//         return signedBytes;
//     }

//     getType() {
//         return TxType.TxTypeSend;
//     }

//     rlpInput() {
//         let numInputs = this.inputs.length;
//         let numOutputs = this.outputs.length;
//         let inputBytesArray = [];
//         let outputBytesArray = [];

//         for (let i = 0; i < numInputs; i++) {
//             inputBytesArray[i] = this.inputs[i].rlpInput();
//         }

//         for (let i = 0; i < numOutputs; i++) {
//             outputBytesArray[i] = this.outputs[i].rlpInput();
//         }

//         let rlpInput = [
//             this.fee.rlpInput(),
//             inputBytesArray,
//             outputBytesArray
//         ];

//         return rlpInput;
//     }
// }

// const StakePurposes = {
//     StakeForValidator: 0,
//     StakeForGuardian: 1,
//     StakeForEdge:2
// };

// class StakeTx extends Tx {

// }

// class DepositStakeTx extends StakeTx {
//     constructor(source, holderAddress, stakeInScriptwei, feeInptowei, purpose, senderSequence) {
//         super();

//         let feeInptoweiBN = BigNumber.isBigNumber(feeInptowei) ? feeInptowei : (new BigNumber(feeInptowei));
//         this.fee = new Coins(new BigNumber(0), feeInptoweiBN);

//         let stakeInScriptweiBN = BigNumber.isBigNumber(stakeInScriptwei) ? stakeInScriptwei : (new BigNumber(stakeInScriptwei));
//         this.source = new TxInput(source, stakeInScriptweiBN, null, senderSequence);

//         this.purpose = purpose;

//         //Parse out the info from the holder (summary) param
//         if (!holderAddress.startsWith('0x')) {
//             holderAddress = "0x" + holderAddress;
//         }

//         //Ensure correct size
//         if (holderAddress.length !== 42) {
//             //TODO: throw error
//             console.log("Holder must be a valid address");
//         }

//         this.holder = new TxOutput(holderAddress, null, null);
//     }

//     setSignature(signature) {
//         let input = this.source;
//         input.setSignature(signature);
//     }

//     signBytes(chainID) {
//         // Detach the existing signature from the source if any, so that we don't sign the signature
//         let sig = this.source.signature;

//         this.source.signature = "";

//         let encodedChainID = RLP.encode(Bytes.fromString(chainID));
//         let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
//         let encodedTx = RLP.encode(this.rlpInput());
//         let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

//         // For ethereum tx compatibility, encode the tx as the payload
//         let ethTxWrapper = new EthereumTx(payload);
//         let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

//         // Attach the original signature back to the source
//         this.source.signature = sig;

//         return signedBytes;
//     }

//     getType() {
//         return TxType.TxTypeDepositStake;
//     }

//     rlpInput() {
//         let rlpInput = [
//             this.fee.rlpInput(),
//             this.source.rlpInput(),
//             this.holder.rlpInput(),

//             (this.purpose === 0 ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.purpose)),
//         ];

//         return rlpInput;
//     }
// }

// class DepositStakeV2Tx extends StakeTx {
//     constructor(source, holderSummary, stakeInScriptwei, feeInptowei, purpose, senderSequence) {
//         super();

//         let feeInptoweiBN = BigNumber.isBigNumber(feeInptowei) ? feeInptowei : (new BigNumber(feeInptowei));
//         this.fee = new Coins(new BigNumber(0), feeInptoweiBN);

//         let stakeInScriptweiBN = BigNumber.isBigNumber(stakeInScriptwei) ? stakeInScriptwei : (new BigNumber(stakeInScriptwei));
//         this.source = new TxInput(source, stakeInScriptweiBN, null, senderSequence);

//         this.purpose = purpose;

//         console.log("BEFORE :: holderSummary == ");
//         console.log(holderSummary);

//         //Parse out the info from the holder (summary) param
//         if (!holderSummary.startsWith('0x')) {
//             holderSummary = "0x" + holderSummary;
//         }

//         console.log("AFTER :: holderSummary == ");
//         console.log(holderSummary);

//         //Ensure correct size
//         if (holderSummary.length !== 460) {
//             //TODO: throw error
//             console.log("Holder must be a valid guardian address");
//         }

//         //let guardianKeyBytes = Bytes.fromString(holderSummary);
//         let guardianKeyBytes = Bytes.toArray(holderSummary);

//         console.log("guardianKeyBytes == ");
//         //console.log(guardianKeyBytes);
//         console.log(typeof guardianKeyBytes);

//         //slice instead of subarray
//         let holderAddressBytes = guardianKeyBytes.slice(0, 20);

//         this.blsPubkeyBytes = guardianKeyBytes.slice(20, 68);
//         this.blsPopBytes = guardianKeyBytes.slice(68, 164);
//         this.holderSigBytes = guardianKeyBytes.slice(164);

//         let holderAddress = Bytes.fromArray(holderAddressBytes);

//         console.log("holderAddress == ");
//         console.log(holderAddress);

//         this.holder = new TxOutput(holderAddress, null, null);
//     }

//     setSignature(signature) {
//         console.log("setSignature :: signature == " + signature);

//         let input = this.source;
//         input.setSignature(signature);
//     }

//     signBytes(chainID) {
//         console.log("DepositStakeTx :: signBytes :: chainId == " + chainID);

//         console.log("DepositStakeTx :: signBytes :: this.source == " + this.source);

//         console.log("DepositStakeTx :: signBytes :: this.source.signature == " + this.source.signature);

//         // Detach the existing signature from the source if any, so that we don't sign the signature
//         let sig = this.source.signature;

//         console.log("DepositStakeTx :: signBytes :: sig == '" + sig + "'");
//         console.log("DepositStakeTx :: signBytes :: sig type == " + typeof sig);

//         this.source.signature = "";

//         let encodedChainID = RLP.encode(Bytes.fromString(chainID));
//         let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
//         let encodedTx = RLP.encode(this.rlpInput());
//         let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

//         // For ethereum tx compatibility, encode the tx as the payload
//         let ethTxWrapper = new EthereumTx(payload);
//         let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

//         console.log("SendTx :: signBytes :: txRawBytes = " + signedBytes);

//         // Attach the original signature back to the source
//         this.source.signature = sig;

//         return signedBytes;
//     }

//     getType() {
//         return TxType.TxTypeDepositStakeV2;
//     }

//     rlpInput() {
//         let rlpInput = [
//             this.fee.rlpInput(),
//             this.source.rlpInput(),
//             this.holder.rlpInput(),

//             Bytes.fromNumber(this.purpose),

//             Bytes.fromArray(this.blsPubkeyBytes),
//             Bytes.fromArray(this.blsPopBytes),
//             Bytes.fromArray(this.holderSigBytes)
//         ];

//         return rlpInput;
//     }
// }

// class WithdrawStakeTx extends StakeTx {
//     constructor(source, holder, feeInptowei, purpose, senderSequence) {
//         super();

//         let feeInptoweiBN = BigNumber.isBigNumber(feeInptowei) ? feeInptowei : (new BigNumber(feeInptowei));
//         this.fee = new Coins(new BigNumber(0), feeInptoweiBN);

//         this.source = new TxInput(source, null, null, senderSequence);

//         this.holder = new TxOutput(holder, null, null);

//         this.purpose = purpose;
//     }

//     setSignature(signature) {
//         let input = this.source;
//         input.setSignature(signature);
//     }

//     signBytes(chainID) {
//         // Detach the existing signature from the source if any, so that we don't sign the signature
//         let sig = this.source.signature;
//         this.source.signature = "";

//         let encodedChainID = RLP.encode(Bytes.fromString(chainID));
//         let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
//         let encodedTx = RLP.encode(this.rlpInput());
//         let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

//         // For ethereum tx compatibility, encode the tx as the payload
//         let ethTxWrapper = new EthereumTx(payload);
//         let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

//         console.log("SendTx :: signBytes :: txRawBytes = " + signedBytes);

//         // Attach the original signature back to the source
//         this.source.signature = sig;

//         return signedBytes;
//     }

//     getType() {
//         return TxType.TxTypeWithdrawStake;
//     }

//     rlpInput() {
//         let rlpInput = [
//             this.fee.rlpInput(),
//             this.source.rlpInput(),
//             this.holder.rlpInput(),

//             (this.purpose === 0 ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.purpose)),
//         ];

//         return rlpInput;
//     }
// }

// const elliptic = (window.elliptic || require("elliptic"));
// const secp256k1 = new elliptic.ec("secp256k1"); // eslint-disable-line
// const SHA3_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

// const sha3 = (value) => {
//     if (isHexStrict(value) && /^0x/i.test(value.toString())) {
//         value = hexToBytes(value);
//     }

//     const returnValue = Hash.keccak256(value); // jshint ignore:line

//     if (returnValue === SHA3_NULL_S) {
//         return null;
//     } else {
//         return returnValue;
//     }
// };

// const encodeSignature = ([v, r, s]) => Bytes.flatten([r, s, v]);

// const makeSigner = addToV => (hash, privateKey) => {
//     const ecKey = secp256k1.keyFromPrivate(new Buffer(privateKey.slice(2), "hex"));
//     const signature = ecKey.sign(new Buffer(hash.slice(2), "hex"), { canonical: true });
//     return encodeSignature([
//         bnFromString(Bytes.fromNumber(addToV + signature.recoveryParam)),
//         Bytes.pad(32, Bytes.fromNat("0x" + signature.r.toString(16))),
//         Bytes.pad(32, Bytes.fromNat("0x" + signature.s.toString(16)))
//     ]);
// };

// const sign = makeSigner(0);

// class TxSigner {

//     static signAndSerializeTx(chainID, tx, privateKey) {
//         let signedTx = this.signTx(chainID, tx, privateKey);
//         let signedRawBytes = this.serializeTx(signedTx);

//         return signedRawBytes;
//     }

//     static signTx(chainID, tx, privateKey) {
//         let txRawBytes = tx.signBytes(chainID);
//         let txHash = sha3(txRawBytes);
//         let signature = sign(txHash, privateKey);
//         tx.setSignature(signature);

//         return tx
//     }

//     static serializeTx(tx) {
//         let encodedTxType = RLP.encode(Bytes.fromNumber(tx.getType()));
//         let encodedTx = RLP.encode(tx.rlpInput());// this time encode with signature
//         let signedRawBytes = encodedTxType + encodedTx.slice(2);

//         return signedRawBytes;
//     }
// }

// var Web3Utils = require('web3-utils');

// class SmartContractTx extends Tx {
//     constructor(fromAddress, toAddress, gasLimit, gasPrice, data, value, senderSequence) {
//         super();

//         let valueWeiBN = BigNumber.isBigNumber(value) ? value : (new BigNumber(value));

//         this.from = new TxInput(fromAddress, null, valueWeiBN, senderSequence);
//         this.to = new TxOutput(toAddress, null, null);

//         this.gasLimit = gasLimit;
//         this.gasPrice = gasPrice;

//         if (data.toLowerCase().startsWith("0x") === false) {
//             data = "0x" + data;
//         }

//         this.data = Bytes.toArray(data);
//     }

//     setSignature(signature) {
//         let input = this.from;
//         input.setSignature(signature);
//     }

//     signBytes(chainID) {
//         // Detach the existing signature from the source if any, so that we don't sign the signature
//         let sig = this.from.signature;

//         this.from.signature = "";

//         let encodedChainID = RLP.encode(Bytes.fromString(chainID));
//         let encodedTxType = RLP.encode(Bytes.fromNumber(this.getType()));
//         let encodedTx = RLP.encode(this.rlpInput());
//         let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);

//         // For ethereum tx compatibility, encode the tx as the payload
//         let ethTxWrapper = new EthereumTx(payload);
//         let signedBytes = RLP.encode(ethTxWrapper.rlpInput()); // the signBytes conforms to the Ethereum raw tx format

//         // Attach the original signature back to the source
//         this.from.signature = sig;

//         return signedBytes;
//     }

//     getType() {
//         return TxType.TxTypeSmartContract;
//     }

//     rlpInput() {
//         let rlpInput = [
//             this.from.rlpInput(),
//             this.to.rlpInput(),

//             Bytes.fromNumber(this.gasLimit),
//             encodeWei(this.gasPrice),

//             Bytes.fromArray(this.data)
//         ];

//         return rlpInput;
//     }
// }

// var index = {
//     SendTx,
//     DepositStakeTx: DepositStakeTx,
//     DepositStakeV2Tx: DepositStakeV2Tx,
//     WithdrawStakeTx,
//     SmartContractTx,
//     TxSigner,
//     StakePurposes,
//     Utils: {
//         hexToBytes,
//         bytesToHex
//     }
// };

// export default index;
