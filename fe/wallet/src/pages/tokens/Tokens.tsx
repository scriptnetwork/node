import React, { useEffect, useState } from 'react';
import { Table } from 'components/molecules/table/Table';
import { TABLE_HEADER } from 'utils/mocks/table/Table';
import { Token } from 'components/molecules/token/Token';
import { Token as TokenSVG } from 'assets/svg';
import { useAppSelector } from 'store';
import { IToken } from 'utils/types/token';
import { WalletBalanceType } from 'store/wallet/walletTypes';
import { TableBody } from 'components/molecules/table/types';
import { transformApiDataToTable } from 'utils/web3/transactions';
import { TOKEN_MOCK } from 'utils/mocks/token/Token';
import axiosApi from 'config/axiosApi';
import { WALLET_API } from 'store/endpoints';
import { useActions } from 'hooks/useActions';
import styles from './tokens.module.scss';

const Tokens: React.FC = () => {
    const [tableData, setTableData] = useState<TableBody>({
        txnNo: [],
        date: [],
        txnHash: [],
        type: [],
        block: [],
        amount: [],
        from: [],
        to: [],
    });

    const { balance, wallet } = useAppSelector((state) => state.wallet);
    const { getWalletBalance } = useActions();

    const tokenData: IToken[] = Object.keys(balance).map((key) => ({
        token: (props) => <TokenSVG {...props} />,
        name: key,
        price: balance[key as keyof WalletBalanceType],
    }));

    const getTransactionHistory = async () => {
        try {
            const { data } = await axiosApi.get(WALLET_API.GET_HISTORY + wallet.address);
            const formattedData = transformApiDataToTable(data.data);
            setTableData(formattedData);
        } catch (e) {
            console.log(e, 'error in getTransactionHistory');
        }
    };

    const fetchData = () => {
        getWalletBalance({ wallet: wallet.address });
        getTransactionHistory();
    };

    useEffect(() => {
        if (wallet.address) {
            fetchData();
        }
    }, [wallet]);

    return (
        <div className={styles.tokens}>
            <div className={styles.tokens_head}>
                {(tokenData && tokenData.length > 0 ? tokenData : TOKEN_MOCK).map((item, index) => (
                    <Token key={index} token={item} fetchData={fetchData} />
                ))}
            </div>
            <div className={styles.tokens_contianer}>
                <h2>Transaction History</h2>
                <Table header={TABLE_HEADER} body={tableData} linesCount={5} />
            </div>
        </div>
    );
};

export default Tokens;
