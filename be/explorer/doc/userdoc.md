# 🌐 Script Network Explorer

<div style="text-align: justify;">

The [Script Explorer](https://explorer.script.tv/) is a blockchain explorer which allows users to look up, confirm, and validate transactions on the Script blockchain. By entering an address into the search box, you can view the balance, value, and all the transactions made through that address.

The Script Explorer APIs are provided by the Script Explorer Microservice Node. It is the REST interface via which a user can interact with the Script Explorer Microservice Node directly.

The explorer also allows a user to check the details of a transaction with the transaction hash. Once you’ve pasted the hash into the search bar, a series of transaction details will appear. These include the type of the transaction, the height of the block that includes the transaction, and the timestamp when the transaction was finalized on-chain.

With smart contract support enabled on the Script blockchain, the Script Explorer was redesigned to more easily inspect and monitor smart contracts. The Script Explorer allows developers to upload and verify the source code of their smart contracts, query the read-only interface of the smart contracts, and record the Script VM returns and emitted events for ease of debugging.

</div>

## Block APIs

### GetBlock

This API returns the details of the block being queried with height.

**REST Uri:** `/block/{height}`


Replace `{height}` with the actual height of the block you want to query.


#### Returns

- `epoch`: epoch of the block
- `height`: height of the block
- `parent`: hash of the parent block
- `transactions_hash`: root hash of the transaction Merkle-Patricia trie
- `state_hash`: root hash of the state Merkle-Patricia trie
- `timestamp`: timestamp when the block was proposed
- `proposer`: address of the proposer validator
- `hash`: the block hash
- `transactions`: json representation of the transactions contained in the block
- `raw`: transaction details
  - `type`: type of the transaction
  - `hash`: hash of the transaction
  - `status`: status of the block

#### Request

```sh
// curl 
https://explorer.script.tv
/api/block/1
// Result
{
 "type":"block",
 "body":{
 "epoch":"1",
 "status":5,
 "height":1,
 "timestamp":"1550089775",
 "hash":"0x705b74cde1ad4afefb8cae883327b216dd11c3a4b592b4487a40337e5e27a7bd",
 "parent_hash":"0x8ce72f57b6ef53c7d5d144a40d6faacc444e9cd60d79043ea5ab978f44c120c6",
 "proposer":"0x9f1233798e905e173560071255140b4a8abd3ec6",
 "state_hash":"0xcb9b1641ecb9f1fb372a9ac9184c811c07bda3d061ce63b2c2e2f1fafc42c789",
 "transactions_hash":"0x36449d6d0523379a6799843cea98c0a4d708a7c314d0536496a78dee57fcb672",
 "num_txs":1,
 "txs":[
 {
 "raw":{
 "proposer":{
 "address":"0x9f1233798e905e173560071255140b4a8abd3ec6",
 "coins":{
 "SCPTWei":"0",
 "SPAYWei":"0"
 },
 "sequence":"0",
 "signature":"0xe54784005c1c321092d24ba50a32228b7b7b6d4e5ad41aa968e96123f1996f623aa609ab7414995aaa25eb8897ca2bb3809695e31829d5de2ee94eead3907eda00"
 },
 "outputs":[
 {
 "address":"0x2e833968e5bb786ae419c4d13189fb081cc43bab",
 "coins":{
 " SCPTWei ":"0",
 " SPAYWei ":"0"
 }
 },
 {
 "address":"0x350ddef232565b32e66a9fb69780e85b686a9e1d",
 "coins":{
 " SCPTWei ":"0",
 " SPAYWei ":"0"
 }
 },
 {
 "address":"0x5f74e3d5cc77b66f0030c5501cfbd39dcb8ff5b6",
 "coins":{
 " SCPTWei ":"0",
 " SPAYWei ":"0"
 }
 },
 {
 "address":"0x7631958d57cf6a5605635a5f06aa2ae2e000820e",
 "coins":{
 " SCPTWei ":"0",
 " SPAYWei ":"0"
 }
 },
 {
 "address":"0x9f1233798e905e173560071255140b4a8abd3ec6",
 "coins":{
 " SCPTWei ":"0",
 " SPAYWei ":"0"
 }
 },
 {
 "address":"0xc15e24083152dd76ae6fc2aeb5269ff23d70330b",
 "coins":{
 " SCPTWei ":"0",
 " SPAYWei ":"0"
 }
 },
 {
 "address":"0xdfb095b990c98a96dd434fe45cd040ec2167c228",
 "coins":{
 " SCPTWei ":"0",
 " SPAYWei ":"0"
 }
 }
 ],
 "block_height":"0"
 },
 "type":0,
 "hash":"0x72738626b99c6942daea0a04eaaca4d83d1d72e1620a0c55d35a886dcb0f56b1"
 }
 ]
 },
 "totalBlocksNumber":17164
}
```

## GetBlocksByRange

This API returns a list of blocks given the page number and limit number.

**REST Uri:** `/blocks/top_blocks`

### Query Parameters

- `pageNumber`: the page number, where 1 stands for the latest blocks.
- `limit`: the number of blocks to return per page.

### Returns

- `currentPageNumber`: the number of the current page.

For each block, the response is similar to the returns of the GetBlock API.
```sh
// Request
curl 
https://explorer.script.tv
/api/blocks/top_blocks?pageNumber=1&limit=10
// Result
{
 "type":"block_list",
 "body":[
 {
 "epoch":"17475",
 "status":4,
 "height":17449,
 "timestamp":"1550199501",
 "hash":"0x4756f30fa538769e4dcaae9fcbd19f6612b05abc843aa9c07a28983121fb3b1d",
 "parent_hash":"0xdd3fde69f68d8b9522adab25f04459f84072a160c2ab3ceeb086777550378e7f",
 "proposer":"0xc15e24083152dd76ae6fc2aeb5269ff23d70330b",
 "state_hash":"0x9711aadb58db9b33ac2f8e29584d772184b01b8406bc2c7cda52a024eeabba8a",
 "transactions_hash":"0xa90c99ab4a3861cfd2a71280a2f74f4aadda5727b72f046687681adfe31c3b5e",
 "num_txs":7,
 "txs":[...]
 },
 {
 "epoch":"17476",
 "status":4,
 "height":17450,
 "timestamp":"1550199507",
 "hash":"0xb5997adcd3daf6c249b2e4ae79945d36fc1aa262fc344a5c665193460c4c2fec",
 "parent_hash":"0x4756f30fa538769e4dcaae9fcbd19f6612b05abc843aa9c07a28983121fb3b1d",
 "proposer":"0x9f1233798e905e173560071255140b4a8abd3ec6",
 "state_hash":"0x69407583b370cbc8c27c63f975e0a3145f05068f8a488d7411ed634f1544fefc",
 "transactions_hash":"0x1ff24e55b5c2e1a9e01ced5d7f92fe2dde90511e7b5cb28e93ed8751df721bda",
 "num_txs":5,
 "txs":[...]
 },
 {
 "epoch":"17477",
 "status":4,
 "height":17451,
 "timestamp":"1550199513",
 "hash":"0x082b3653ccc74b26612da4a7666b2c3e9c2ce2222dd90c6083884892a0e3f1c6",
 "parent_hash":"0xb5997adcd3daf6c249b2e4ae79945d36fc1aa262fc344a5c665193460c4c2fec",
 "proposer":"0x7631958d57cf6a5605635a5f06aa2ae2e000820e",
 "state_hash":"0x10931619d1986b4b62f816c11643dbe66aeccbb48e2995b81fbf0786ceb312d1",
 "transactions_hash":"0x0cabb62272efeac14a06eb323c5b7e8b87271a948a619e5ead4a4fd284c094cf",
 "num_txs":7,
 "txs":[...]
 },
 {
 "epoch":"17478",
 "status":4,
 "height":17452,
 "timestamp":"1550199520",
 "hash":"0x2ff868bf9c8aab3c2482a91b090530f430c8afb94fd66c60b9c8fd845899a00a",
 "parent_hash":"0x082b3653ccc74b26612da4a7666b2c3e9c2ce2222dd90c6083884892a0e3f1c6",
 "proposer":"0x9f1233798e905e173560071255140b4a8abd3ec6",
 "state_hash":"0x4d78020673af830a92ff5fc78a9d1859ecee3b07bf7cbda8d3ae74d61e0fee50",
 "transactions_hash":"0x1d77c10d77a8380f07ade4474816332d347f8739913aee03ae81f1f02391d3ae",
 "num_txs":3,
 "txs":[...]
 },
 {
 "epoch":"17479",
 "status":4,
 "height":17453,
 "timestamp":"1550199526",
 "hash":"0x7953f10d559405dad20db498947148a73781546209485a803e414574e3439255",
 "parent_hash":"0x2ff868bf9c8aab3c2482a91b090530f430c8afb94fd66c60b9c8fd845899a00a",
 "proposer":"0x2e833968e5bb786ae419c4d13189fb081cc43bab",
 "state_hash":"0x62e34301225525c3dd44ee951e45a97a1590303aa9ba3586cf0c1791b1f8ebc4",
 "transactions_hash":"0x404e4a202f4e621ccf0abe824c318edf012b5a52b5c52d3509e050b996185f53",
 "num_txs":6,
 "txs":[...]
 },
 {
 "epoch":"17480",
 "status":4,
 "height":17454,
 "timestamp":"1550199532",
 "hash":"0xe752c9e9dd0b5bca6aefe31c5d84845ba7e3d469eb56f1a91300b316ffc5ce4c",
 "parent_hash":"0x7953f10d559405dad20db498947148a73781546209485a803e414574e3439255",
 "proposer":"0xdfb095b990c98a96dd434fe45cd040ec2167c228",
 "state_hash":"0x2a2b68e13f0bb27b3adbef5ab54d1a8ef07a6e16afa8172684c5f5e8771f43ba",
 "transactions_hash":"0x679095a23b223847c197005d0b6e1995012bb381f49fc3c36bda40af6143149d",
 "num_txs":5,
 "txs":[...]
 },
 {
 "epoch":"17481",
 "status":4,
 "height":17455,
 "timestamp":"1550199539",
 "hash":"0x05b6b8bd715f600242208710081395a050e37d6af0fa9789f74b50d37c696ca6",
 "parent_hash":"0xe752c9e9dd0b5bca6aefe31c5d84845ba7e3d469eb56f1a91300b316ffc5ce4c",
 "proposer":"0x2e833968e5bb786ae419c4d13189fb081cc43bab",
 "state_hash":"0xa6ad424d8d3d02c52f8f4aefa8c7d92a746e9b1368bb723e56805827d4b757f4",
 "transactions_hash":"0x016e5c9a7e43cb5d869d3a65a03da6e87e91fe5da3bb2bc9319b262532cfab42",
 "num_txs":5,
 "txs":[...]
 },
 {
 "epoch":"17482",
 "status":4,
 "height":17456,
 "timestamp":"1550199545",
 "hash":"0x16b6d178380af8fb580f6d055919744f8dbee0c850d685f7f9dc34507db8f716",
 "parent_hash":"0x05b6b8bd715f600242208710081395a050e37d6af0fa9789f74b50d37c696ca6",
 "proposer":"0xc15e24083152dd76ae6fc2aeb5269ff23d70330b",
 "state_hash":"0xd97a3238cd3f97c2e3db9f4c825a6bb59ba2bb02112029c83f53b9495ef282ac",
 "transactions_hash":"0xbbd09b8bd634d59b44f810a72c2adb836eef3c4f83ef01033281c556bbe35342",
 "num_txs":3,
 "txs":[...]
 },
 {
 "epoch":"17483",
 "status":4,
 "height":17457,
 "timestamp":"1550199551",
 "hash":"0x9b9cd1306346a692258f9b2c1ee2a0cdb66956efbf41e9c43658cf078fc2c229",
 "parent_hash":"0x16b6d178380af8fb580f6d055919744f8dbee0c850d685f7f9dc34507db8f716",
 "proposer":"0x9f1233798e905e173560071255140b4a8abd3ec6",
 "state_hash":"0xbb018c8e3b6c7d94bc8d1e547fe748296df5ef8f5734a9abfd5faaa54d11c858",
 "transactions_hash":"0x06d08fc4e13b021868f1394af440d53f4eca60e55015eb3dea7e8fcdf5d595ea",
 "num_txs":4,
 "txs":[...]
 },
 {
 "epoch":"17484",
 "status":4,
 "height":17458,
 "timestamp":"1550199557",
 "hash":"0x70e1102013273079484dff737c36850765eb9794e2fde402fa3c4c2ddb45fc7b",
 "parent_hash":"0x9b9cd1306346a692258f9b2c1ee2a0cdb66956efbf41e9c43658cf078fc2c229",
 "proposer":"0x7631958d57cf6a5605635a5f06aa2ae2e000820e",
 "state_hash":"0xd3915c55728a568c6272de77dbea60aa20a1c1fb6c096a7fd4eecdb0bdde005d",
 "transactions_hash":"0xe51b8bea2fa6e9ff2c28bf488913c66d081647dbcf0c85311099b84fcc3769be",
 "num_txs":4,
 "txs":[...]
 }
 ],
 "totalPageNumber":1746,
 "currentPageNumber":"1"
}
```


## Transaction APIs

### GetTransaction

This API returns the details of the transaction being queried with a specific hash.

**REST Uri:** `/transaction/{hash}`

#### Query Parameters

- `hash`: the hash of the transaction

#### Returns

- `block_height`: height of the block that contains the transaction
- `hash`: the hash of the transaction itself
- `data`: the details of the transaction
- `type`: transaction type
- `totalTxsNumber`: total number of transactions in the database
- `timestamp`: the timestamp of the block that contains this transaction
- `number`: the sequence number of the transaction in the database
```sh
// {
 "type":"transaction",
 "body":{
 "hash":"0XF16402022FFFADA96C4BA9A78F79730903F8D99EF44D221FC5869EC4191260EC",
 "type":5,
 "data":{
 "fee":{
 "SCPTWei":"0",
 "SPAYWei":"1000000000000"
 },
 "source":{
 "address":"0x02990c3f7f75865bcd2fb28450f01065754f9372",
 "coins":{
 " SCPTWei ":"0",
 " SPAYWei ":"1150000000000000"
 },
 "sequence":"0",
 "signature":"0x66cb200ad7def6a0b4e9d377fd6a54cf19f952d089772b2dda8bd0f0927434825acec09e5c2c7aaaf9c4d18a2730786ee619a593fd49395913785aa4255e164001"
 },
 "target":{
 "address":"0x49e2268b8962a7b5680512173f2b320418003082",
 "coins":{
 " SCPTWei ":"0",
 " SPAYWei ":"0"
 },
 "sequence":"126",
 "signature":"0xdd6aecdf642a001b9ae299cf44aa5c142dac45dd58666d326870dc53670dc204548951880ebce343afb27c968bb99488c23bc9af43a60c4de6299c6242cf07ac00"
 },
 "payment_sequence":"1550282279177",
 "reserve_sequence":"178",
 "resource_id":"vidivz187ttu9eck65d"
 },
 "number":196771,
 "block_height":"30615",
 "timestamp":"1550282330"
 },
 "totalTxsNumber":196771
 ```


 ## GetTransactionsByRange

This API returns a list of transactions given the page number and limit number.

**REST Uri:** `/transactions/range`

### Query Parameters

- `pageNumber`: the page number, where 0 stands for the latest transactions.
- `limit`: the number of transactions to return per page.

### Returns

- `currentPageNumber`: the number of the current page.
- `totalPageNumber`: the total number of pages.

For each transaction, the response is similar to the returns of the GetTransaction API.

```sh
// Request
curl 
https://explorer.script.tv
/api/transactions/range?pageNumber=1&limit=10
// Result
{
 "type":"transaction_list",
 "body":[
 {...},
 {...},
 {...},
 {...},
 {...},
 {...},
 {...},
 {...},
 {...},
 {...}
 ],
 "totalPageNumber":20354,
 "currentPageNumber":"1"
}
```

## Account APIs

### GetAccount

This API returns the details of the account being queried with a specific address.

**REST Uri:** `/account/{address}`

#### Query Parameters

- `address`: the address of the account

#### Returns

- `address`: the account address
- `balance`: the native token balance
- `reserved_funds`: funds reserved for micropayment through the off-chain resource-oriented payment pool
- `sequence`: the current sequence number of the account
- `txs_counter`: a counter map containing how many transactions of each transaction type include this account

```sh
// Request
curl https://explorer.script.tv/api/account/0x3c6D5ED0353c22c31c5F91688A9D10E7Af2DF636
// Result
{
 "type": "account",
 "body": {
 "address": "0x3c6d5ed0353c22c31c5f91688a9d10e7af2df636",
 "balance": {
 "SCPTWei": "0",
 "SPAYWei": "1540957523000000000000"
 },
 "sequence": "0",
 "reserved_funds": [],
 "txs_counter": {
 "2": 2,
 "5": 973
 }
 }
}
```

## Account APIs

### GetAccountTxHistory

This API returns the transaction history of the account being queried with a specific address.

**REST Uri:** `/accountTx/{address}`

#### Query Parameters

- `address`: the address of the account
- `type` (optional): type of the transaction (if provided, filters transactions by type)
- `isEqualType` (optional): `true` returns transactions only of the specified type, `false` returns transactions excluding the specified type.
- `pageNumber`: the page number of the result set (starting from 0)
- `limitNumber`: the number of transactions per page

#### Returns

- `currentPageNumber`: the number of the current page
- `totalPageNumber`: the total number of pages

For each transaction, the response structure is similar to the returns of the GetTransaction API.

```sh
// Request
curl " https://explorer.script.tv//api/accounttx/0x3c6D5ED0353c22c31c5F91688A9D10E7Af2DF636?type=2&pageNumber=1&limitNumber=50&isEqualType=true"
// Result
{
 "type": "account_tx_list",
 "body": [
 {...},
 {...}
 ],
 "totalPageNumber": 1,
 "currentPageNumber": 1
}
```

## Account APIs

### GetTopTokenHolders

This API returns the list of top token holders for a specific token type.

**REST Uri:** `/account/top/{tokenType}/{limit}`

#### Query Parameters

- `tokenType`: type of the token (e.g., SPAY)
- `limit`: the number of top token holders to return

#### Returns

For each account, the response structure is similar to the returns of the GetAccount API.

```sh
// // Request
curl " https://explorer.script.tv//api/account/top/SPAY/5"
// Result
{
"type": "account_list",
"body": [
 {...},
 {...},
 {...},
 {...},
 {...}
 ]
}
```

## Stake APIs

### GetAllStakes

This API returns all stake records.

**REST Uri:** `/stake/all`

#### Returns

- `stakes`: JSON representation of the stake records
  - `_id`: the ID for the stake record
  - `type`: indicates whether the stake is in the Validator candidate pool or the Lightning candidate pool
  - `holder`: the account's address of the stake holder
  - `source`: the account's address from which the stake originated
  - `amount`: the staked SPAYWei amount
  - `withdrawn`: `true` if the stake has been withdrawn, `false` if not
  - `return_height`: the expected height at which the tokens will return to the staking wallet if a node withdraws its stake
```sh
// Request
curl https://explorer.script.tv/api/stake/all
// Result
{
 "type": "stake",
 "body": [{
 "_id": "5eb9f45d38696f556cc3334d",
 "type": "vcp",
 "holder": "0x80eab22e27d4b94511f5906484369b868d6552d2",
 "source": "0x4aefa39caeadd662ae31ab0ce7c8c2c9c0a013e8",
 "amount": "20000000000000000000000000",
 "withdrawn": false,
 "return_height": "18446744073709551615"
 },{
 "_id": "5eb9f45d38696f556cc3334e",
 "type": "vcp",
 "holder": "0x80eab22e27d4b94511f5906484369b868d6552d2",
 "source": "0x747f15cac97b973290e106ef32d1b6fe65fef5a1",
 "amount": "40000000000000000000000000",
 "withdrawn": false,
 "return_height": "18446744073709551615"
 },{
 "_id": "5eb9f45d38696f556cc33351",
 "type": "vcp",
 "holder": "0xa61abd72cdc50d17a3cbdceb57d3d5e4d8839bce",
 "source": "0x0c9a45926a44a6fc9c8b6f9cb45c20483038698c",
 "amount": "32000000000000000000000000",
 "withdrawn": false,
 "return_height": "18446744073709551615"
 }
 ...
 ]
}
```

## Stake APIs

### GetTotalStakedAmount

This API returns the total amount of stakes.

**REST Uri:** `/stake/totalAmount`

#### Returns

- `totalAmount`: the total amount of staked SPAYWei
- `totalNodes`: the total number of stake nodes

```sh
// Request
curl https://explorer.script.tv/api/stake/totalAmount
// Result
{
 "totalAmount": "317702156000000000000000000",
 "totalNodes": 12
}
```

## Stake APIs

### GetStakeByAddress

This API returns the stakes associated with a specific address.

**REST Uri:** `/stake/{address}`

#### Query Parameters

- `address`: the address of the account for which stakes are being queried

#### Returns

For each stake, the response structure is similar to the returns of the GetAllStakes API.

```sh
// Request
curl https://explorer.script.tv/api/stake/totalAmount
// Result
{
 "type": "stake",
 "body": {
 "holderRecords": [],
 "sourceRecords": [
 {
 "_id": "5eb9f60638696f556cc33aa3",
 "type": "vcp",
 "holder": "0xe2408dff7a1f9bc247c803e43efa2f0a37b10ba6",
 "source": "0xc15149236229bd13f0aec783a9cc8e8059fb28da",
 "amount": "30000000000000000000000000",
 "withdrawn": false,
 "return_height": "18446744073709551615"
 },
 {
 "_id": "5eb9f60638696f556cc33aa5",
 "type": "vcp",
 "holder": "0x15cc4c3f21417c392119054c8fe5895146e1a493",
 "source": "0xc15149236229bd13f0aec783a9cc8e8059fb28da",
 "amount": "30000000000000000000000000",
 "withdrawn": false,
 "return_height": "18446744073709551615"
 },
 {
 "_id": "5eb9f60638696f556cc33aa4",
 "type": "vcp",
 "holder": "0xa144e6a98b967e585b214bfa7f6692af81987e5b",
 "source": "0xc15149236229bd13f0aec783a9cc8e8059fb28da",
 "amount": "30000000000000000000000000",
 "withdrawn": false,
 "return_height": "18446744073709551615"
 }
 ]
 }
}
```


