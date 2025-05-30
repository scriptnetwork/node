# Script Ethereum Adaptor

The Script Ethereum Adaptor is a component or module within the Script Network that facilitates communication and interoperability between the Script blockchain and the Ethereum blockchain. This adaptor acts as a bridge, enabling assets or data to move between the two blockchains.

# json RPC - All methods

```
manic_beret@pulsar:~/dev/sys$ ls be/L1/bridge_eth/rpc/ethrpc/ -1 | grep '^eth_' | sed 's~.go$~~'
eth_accounts
eth_block_number
eth_call
eth_chain_id
eth_estimate_gas
eth_gas_price
eth_get_balance
eth_get_block_by_hash
eth_get_block_by_number
eth_get_block_transaction_count_by_number
eth_get_code
eth_get_logs
eth_get_storage_at
eth_get_transaction_by_block_hash_and_index
eth_get_transaction_by_block_number_and_index
eth_get_transaction_by_hash
eth_get_transaction_count
eth_get_transaction_receipt
eth_get_uncle_by_block_hash_and_index
eth_protocol_version
eth_send_raw_transaction
eth_send_transaction
eth_sign
eth_sign_typed_data
eth_syncing
```


# curl - some RPC local calls 

```
stv@ip-172-31-8-249:~$ curl -X POST --data '{"method":"eth_chainId", "params":[], "id":1}' -H "Content-Type: application/json" http://127.0.0.1:10004/rpc
{"jsonrpc":"2.0","id":1,"result":"0xa766"}
stv@ip-172-31-8-249:~$ echo $((16#a766))
42854
```

# Script4

The Script4 likely refers to the ledger or record of transactions and activities within the Script blockchain. This ledger maintains a secure and immutable record of all transactions and smart contract executions that occur within the Script Network.

# Role and Mechanism

The Script Ethereum Adaptor plays a crucial role in enabling cross-chain functionality within the Script Network. Its primary purpose is to allow tokens or assets to be transferred between the Script blockchain and the Ethereum blockchain. This could include assets such as Script tokens (SCPT) or Script Pay (SPAY). The adaptor consists of below components:

## Smart Contracts

Smart contracts deployed on both the Script and Ethereum blockchains facilitate the transfer of assets between the two chains. These contracts govern the rules and conditions of asset transfers, ensuring trustless and secure transactions.

## Oracle Services

Oracle services may be utilized to provide external data to the smart contracts, ensuring they have access to accurate and up-to-date information needed for cross-chain transactions.

## Adaptor Concept

The adaptor itself contains the logic and algorithms necessary to coordinate the interaction between the Script and Ethereum blockchains. This includes functions for initiating transfers, verifying transactions, and updating the protocol ledgers on both chains.

