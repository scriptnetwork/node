package ethrpc

import (
	"context"
	"encoding/json"
	"fmt"
	"math/big"

	"github.com/scripttoken/script-eth-rpc-adaptor/common"
	rpcc "github.com/ybbus/jsonrpc"

	tcommon "github.com/scripttoken/script/common"
	"github.com/scripttoken/script/ledger/types"

	// "github.com/scripttoken/script/ledger/types"
	trpc "github.com/scripttoken/script/rpc"
)

type TxTmp struct {
	Tx   json.RawMessage `json:"raw"`
	Type byte            `json:"type"`
	Hash tcommon.Hash    `json:"hash"`
}

// ------------------------------- eth_gasPrice -----------------------------------

func (e *EthRPCService) GasPrice(ctx context.Context) (result string, err error) {
	logger.Infof("eth_gasPrice called")

	currentHeight, err := common.GetCurrentHeight()

	if err != nil {
		return "", err
	}

	// fmt.Printf("currentHeight: %v\n", currentHeight)
	client := rpcc.NewRPCClient(common.GetScriptRPCEndpoint())
	rpcRes, rpcErr := client.Call("script.GetBlockByHeight", trpc.GetBlockByHeightArgs{Height: currentHeight})

	parse := func(jsonBytes []byte) (interface{}, error) {
		trpcResult := common.ScriptGetBlockResult{}
		json.Unmarshal(jsonBytes, &trpcResult)
		var objmap map[string]json.RawMessage
		json.Unmarshal(jsonBytes, &objmap)
		if objmap["transactions"] != nil {
			//TODO: handle other types
			txs := []trpc.Tx{}
			tmpTxs := []TxTmp{}
			json.Unmarshal(objmap["transactions"], &tmpTxs)
			for _, tx := range tmpTxs {
				newTx := trpc.Tx{}
				newTx.Type = tx.Type
				newTx.Hash = tx.Hash
				if types.TxType(tx.Type) == types.TxSmartContract {
					transaction := types.SmartContractTx{}
					json.Unmarshal(tx.Tx, &transaction)
					// fmt.Printf("transaction: %+v\n", transaction)
					newTx.Tx = &transaction
				}
				txs = append(txs, newTx)
			}
			trpcResult.Txs = txs
		}
		return trpcResult, nil
	}

	resultIntf, err := common.HandleScriptRPCResponse(rpcRes, rpcErr, parse)
	if err != nil {
		return "", err
	}
	scriptGetBlockResult, ok := resultIntf.(common.ScriptGetBlockResult)
	if !ok {
		return "", fmt.Errorf("failed to convert GetBlockResult")
	}
	totalGasPrice := big.NewInt(0)
	count := 0
	for _, tx := range scriptGetBlockResult.Txs {
		if types.TxType(tx.Type) != types.TxSmartContract {
			continue
		}
		if tx.Tx != nil {
			transaction := tx.Tx.(*types.SmartContractTx)
			count++
			totalGasPrice = new(big.Int).Add(transaction.GasPrice, totalGasPrice)
		}
	}

	gasPrice := getDefaultGasPrice(client)
	if count != 0 {
		gasPrice = new(big.Int).Div(totalGasPrice, big.NewInt(int64(count))) // use the average
	}
	fmt.Printf("gasPrice: %v\n", gasPrice)
	result = "0x" + gasPrice.Text(16)
	return result, nil
}

func getDefaultGasPrice(client *rpcc.RPCClient) *big.Int {
	gasPrice := big.NewInt(4000000000000) // Default for the Main Chain
	//ethChainID, err := getEthChainID(client)
	//if err == nil {
	//	if ethChainID > 1000 { // must be a Subchain
	//		gasPrice = big.NewInt(1e8) // Default for the Subchains
	//	}
	//}
	return gasPrice
}

/*
func getEthChainID(client *rpcc.RPCClient) (uint64, error) {
	rpcRes, rpcErr := client.Call("script.GetStatus", trpc.GetStatusArgs{})
	//var blockHeight uint64
	parse := func(jsonBytes []byte) (interface{}, error) {
		trpcResult := trpc.GetStatusResult{}
		json.Unmarshal(jsonBytes, &trpcResult)
		re := chainIDResultWrapper{
// (ack search)			chainID: trpcResult.ChainID,
		}
		//blockHeight = uint64(trpcResult.LatestFinalizedBlockHeight)
		return re, nil
	}

	resultIntf, err := common.HandleScriptRPCResponse(rpcRes, rpcErr, parse)
	if err != nil {
		return 0, err
	}
	scriptChainIDResult, ok := resultIntf.(chainIDResultWrapper)
	if !ok {
		return 0, fmt.Errorf("failed to convert chainIDResultWrapper")
	}

	//scriptChainID := scriptChainIDResult.chainID
	ethChainID := scriptChainIDResult.EthChainID
    //ethChainID := types.MapChainID(scriptChainID, blockHeight).Uint64()

	return ethChainID, nil
}
*/

