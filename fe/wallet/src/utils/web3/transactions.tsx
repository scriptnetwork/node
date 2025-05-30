import { TableBody } from 'components/molecules/table/types';
import dotool from 'dotool';

interface Coin {
    scptwei: string;
    spaywei: string;
}

interface Input {
    address: string;
    coins: Coin;
    sequence: string;
    signature: string;
}

interface Output {
    address: string;
    coins: Coin;
}

interface TransactionData {
    fee: Coin;
    inputs: Input[];
    outputs: Output[];
}

interface ApiTransaction {
    _id: string;
    block_height: string;
    data: TransactionData;
    eth_tx_hash: string;
    hash: string;
    number: number;
    receipt: unknown;
    status: string;
    timestamp: string;
    type: number;
}

export const transformApiDataToTable = (apiData: ApiTransaction[]): TableBody => {
    const tableBody: TableBody = {
        txnNo: [],
        date: [],
        txnHash: [],
        type: [],
        block: [],
        amount: [],
        from: [],
        to: [],
    };

    apiData.forEach((txn, index) => {
        const date = new Date(parseInt(txn.timestamp) * 1000).toLocaleDateString();
        const hashElement = (
            <a href={`${dotool.FE_EXPLORER__URL}/txs/${txn.hash}`} target="_blank" rel="noreferrer" key={index + 1} style={{ color: '#FFD400' }}>
                {txn.hash}
            </a>
        );
        const fromElement = (
            <a href={`${dotool.FE_EXPLORER__URL}/account/${txn.data.inputs[0].address}`} target="_blank" rel="noreferrer" key={index + 1} style={{ color: '#FFD400' }}>
                {txn.data.inputs[0].address}
            </a>
        );
        const toElement = (
            <a href={`${dotool.FE_EXPLORER__URL}/account/${txn.data.outputs[0].address}`} target="_blank" rel="noreferrer" key={index + 1} style={{ color: '#FFD400' }}>
                {txn.data.outputs[0].address}
            </a>
        );
        const blockElement = (
            <a href={`${dotool.FE_EXPLORER__URL}/blocks/${txn.block_height}`} target="_blank" rel="noreferrer" key={index + 1} style={{ color: '#FFD400' }}>
                {txn.block_height}
            </a>
        );
        const amountSCPT = (parseInt(txn.data.inputs[0].coins.scptwei) / 1e18).toFixed(2);
        const amountSPAY = (parseInt(txn.data.inputs[0].coins.spaywei) / 1e18).toFixed(2);
       
        tableBody.txnNo.push((index + 1).toString().padStart(2, '0'));
        tableBody.date.push(date);
        tableBody.txnHash.push(hashElement);
        tableBody.type.push(txn.type === 2 ? 'Receive' : 'Send');
        tableBody.block.push(blockElement);
        tableBody.amount.push(`${amountSCPT} SCPT & ${amountSPAY} SPAY`);
        tableBody.from.push(fromElement);
        tableBody.to.push(toElement);
    });

    return tableBody;
};
