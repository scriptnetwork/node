import axios from 'axios';
import BigNumber from 'bignumber.js';
import dotool from 'dotool';
import { ENode } from 'utils/types/token';
import { scriptJS } from './scriptjs.esm';
import { toast } from 'react-toastify';
import { SPAY_FEE } from 'utils/constants/fee';

export const stakeTransaction = async (holder: string, nodeType: ENode, wallet: string, amount: number, privateKey: string) => {
    let seqRes = null;
    try {
        seqRes = await axios.get(`${dotool.BE_EXPLORER_URL}/account/update/${wallet}`);
    } catch (error) {
        console.error('Error fetching sequence number:', error);
    }

    const sequence = seqRes ? Number(seqRes.data.body.sequence) + 1 : 2;

    const ten18 = new BigNumber(10).pow(18);
    const body = {
        from: wallet.toLowerCase(),
        holder,
        SCPTWei: new BigNumber(amount).multipliedBy(ten18),
        purpose: +(nodeType === ENode.LIGHTING),
        fee: new BigNumber(SPAY_FEE).multipliedBy(ten18),
        sequence,
    };

    let tx = null;
    if (nodeType === ENode.LIGHTING) {
        tx = new scriptJS.DepositStakeV2Tx(body.from, body.holder, body.SCPTWei, body.fee, body.purpose, body.sequence);
    } else if (nodeType === ENode.VALIDATOR) {
        tx = new scriptJS.DepositStakeTx(body.from, body.holder, body.SCPTWei, body.fee, body.purpose, body.sequence);
    }
    const signedRawTxBytes = scriptJS.TxSigner.signAndSerializeTx('testnet', tx, privateKey);

    const signedTxRaw = signedRawTxBytes.toString('hex');

    const data = {
        jsonrpc: '2.0',
        method: 'script.BroadcastRawTransactionAsync',
        params: [
            {
                tx_bytes: signedTxRaw,
            },
        ],
        id: 1,
    };

    return axios
        .post(dotool.NODE_RPC_URL, data)
        .then((res: { data: unknown }) => {
            console.log('Staking transaction broadcast result:', res.data);
        })
        .catch((error: unknown) => {
            console.error('Error broadcasting staking transaction:', error);
        });
};

export const withdrawStakeTransaction = async (holder: string, nodeType: ENode, wallet: string, privateKey: string) => {
    let seqRes = null;
    try {
        seqRes = await axios.get(`${dotool.BE_EXPLORER_URL}/account/update/${wallet}`);
    } catch (error) {
        console.error('Error fetching sequence number:', error);
    }
    const sequence = seqRes ? Number(seqRes.data.body.sequence) + 1 : 2;

    const ten18 = new BigNumber(10).pow(18);
    const body = {
        from: wallet.toLowerCase(),
        holder,
        purpose: +(nodeType === ENode.LIGHTING),
        fee: new BigNumber(SPAY_FEE).multipliedBy(ten18),
        sequence,
    };

    const tx = new scriptJS.WithdrawStakeTx(body.from, body.holder, body.fee, body.purpose, body.sequence);
    const signedRawTxBytes = scriptJS.TxSigner.signAndSerializeTx(dotool.NETWORK, tx, privateKey);

    const signedTxRaw = signedRawTxBytes.toString('hex');

    const data = {
        jsonrpc: '2.0',
        method: 'script.BroadcastRawTransactionAsync',
        params: [
            {
                tx_bytes: signedTxRaw,
            },
        ],
        id: 1,
    };

    return axios
        .post(dotool.NODE_RPC_URL, data)
        .then((res: { data: unknown }) => {
            console.log('Withdrawing transaction broadcast result:', res.data);
        })
        .catch((error: unknown) => {
            console.error('Error broadcasting withdrawing transaction:', error);
        });
};

export const sendTokensTransaction = async (
    senderAddr: string,
    outputs: {
        address: string;
        scptwei: bigint;
        spaywei: bigint;
    }[],
    privateKey: string,
) => {
    const {
        data: {
            body: { sequence },
        },
    } = await axios.get(`${dotool.BE_EXPLORER_URL}/account/update/${senderAddr}`);

    const sendTx = new scriptJS.SendTx(senderAddr, outputs, new BigNumber('1000000000000'), +sequence + 1);
    const signedRawTxBytes = scriptJS.TxSigner.signAndSerializeTx(dotool.NETWORK, sendTx, privateKey);
    const signedTxRaw = signedRawTxBytes.toString('hex');

    const data = {
        jsonrpc: '2.0',
        method: 'script.BroadcastRawTransactionAsync',
        params: [
            {
                tx_bytes: signedTxRaw,
            },
        ],
        id: 1,
    };

    return axios
        .post(dotool.NODE_RPC_URL, data)
        .then((res: { data: { error: undefined | { message: string }; result: undefined | { hash: string } } }) => {
            if (res.data.error) {
                toast.error(res.data.error.message);
                return false;
            } else {
                toast.success('Transaction sent successfully');
                return true;
            }
        })
        .catch((e: { error: { message: string } }) => {
            toast.error(e.error.message);
            return false;
        });
};
