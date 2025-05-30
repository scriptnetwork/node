package common

import (
	"github.com/spf13/viper"
)

const (
	// CfgConfigPath defines custom config path
	CfgConfigPath = "config.path"

	// CfgNodeSkipInitialzeTestWallets defines custom config path
	CfgNodeSkipInitialzeTestWallets = "node.skipInitializeTestWallets"

	// CfgScriptRPCEndpoint configures the Script RPC endpoint
	CfgScriptRPCEndpoint   = "script.rpcEndpoint"
	CfgScriptBlockGasLimit = "script.blockGasLimit"
        CfgScriptChainID = "script.chainID"
        CfgScriptEthChainID = "script.ethChainID"

	// CfgRPCEnabled sets whether to run RPC service.
	CfgRPCEnabled = "rpc.enabled"
	// CfgRPCHttpAddress sets the binding address of RPC http service.
	CfgRPCHttpAddress = "rpc.httpAddress"
	// CfgRPCHttpPort sets the port of RPC http service.
	CfgRPCHttpPort = "rpc.httpPort"
	// CfgRPCWSAddress sets the binding address of RPC websocket service.
	CfgRPCWSAddress = "rpc.wsAddress"
	// CfgRPCWSPort sets the port of RPC websocket service.
	CfgRPCWSPort = "rpc.wsPort"
	// CfgRPCMaxConnections limits concurrent connections accepted by RPC server.
	CfgRPCMaxConnections = "rpc.maxConnections"
	// CfgRPCTimeoutSecs set a timeout for RPC.
	CfgRPCTimeoutSecs = "rpc.timeoutSecs"

	// CfgQueryGetLogsBlockRange sets the max block range for the eth_getLogs call
	CfgQueryGetLogsBlockRange = "query.getLogsBlockRange"

	// CfgLogLevels sets the log level.
	CfgLogLevels = "log.levels"
	// CfgLogPrintSelfID determines whether to print node's ID in log (Useful in simulation when
	// there are more than one node running).
	CfgLogPrintSelfID = "log.printSelfID"
)

func init() {
	viper.SetDefault(CfgNodeSkipInitialzeTestWallets, false)

	viper.SetDefault(CfgScriptRPCEndpoint, "http://127.0.0.1:16888/rpc")
	viper.SetDefault(CfgScriptBlockGasLimit, 20000000)
	viper.SetDefault(CfgScriptEthChainID, 0);
	viper.SetDefault(CfgScriptChainID, "");


	viper.SetDefault(CfgRPCEnabled, true)
	viper.SetDefault(CfgRPCHttpAddress, "127.0.0.1")
	viper.SetDefault(CfgRPCHttpPort, "18888")
	viper.SetDefault(CfgRPCWSAddress, "127.0.0.1")
	viper.SetDefault(CfgRPCWSPort, "18889")
	viper.SetDefault(CfgRPCMaxConnections, 2048)
	viper.SetDefault(CfgRPCTimeoutSecs, 600)

	viper.SetDefault(CfgQueryGetLogsBlockRange, 5000)

	viper.SetDefault(CfgLogLevels, "*:debug")
	viper.SetDefault(CfgLogPrintSelfID, false)
}
