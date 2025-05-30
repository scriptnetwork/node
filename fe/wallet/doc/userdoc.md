# 🪙 Script Wallet

# Creating a Wallet

You will download an encrypted keystore file and create a wallet password. This encrypted keystore file on your computer will be used to unlock your wallet any time you want to access it. You will then need to copy down the mnemonic/seed phrase (and private key, if you choose to) and store them in a safe place. 

Your mnemonic/seed phrase and private key are the only way to restore your Script wallet if you lose your keystore file and/or wallet password! Make sure you save them correctly and store them offline in a safe place (never online or in the cloud!).

Once your wallet has been created, you can re-connect your device and unlock your new Script Wallet.

If you are unlocking an existing wallet, we recommend you take your device offline while uploading your keystore or enter your mnemonic phrase or private key. Once the wallet has been unlocked, you’ll see a screen that says “you’re offline!” and will have the opportunity to connect to the internet before you continue to the wallet.

Once you’re in your Script wallet, you can check the balance of your Script Tokens.

# Account/Wallet Management

The Script command line tool can be used as a wallet, which can manage multiple accounts with the keys encrypted. Below are the relevant commands:

1. Scriptcli key new Create a new account with a password. The newly created key is encrypted and stored under ~/.scriptcli/keys/encrypted/ by default

2. scriptcli key list List all the accounts managed by the wallet.

3. Scriptcli key password

Reset the password for the account. You will need the current password for the reset.

1. Scriptcli key delete

Delete the account. You will need the password for the account for the deletion.

# Staking through Web Wallet

Access the Script Web Wallet from your desktop/laptop. Under the “Script Wallet” logo, unlock your Script wallet using your typical access method (keystore, seed phrase, private key, etc.).

Once your wallet is unlocked, click the `“On-Chain Stake”` tab of the menu and click `“Deposit Stake”`.

In the `Lightning Node Holder (Summary)` field, enter the text string from your Lightning Cli Service. Enter the Amount of SCRIPT you want to stake to this node and click `“Deposit Stake"`. Note that you need to stake `at least 5,000 SCPT`.

After reviewing your stake deposit info on the next screen, enter your wallet password, then click "Confirm & Deposit Stake". After the stake deposit transaction is confirmed, you can switch back to the Lightning node to verify that it is working as expected.

# Testnet, Explorer + Creating a Wallet

```
How to Create a wallet, access the faucet, and interact with Script Testnet. 
```

Full details on how to create a wallet, is here: https://medium.com/@scriptnetwork/script-network-launches-v1-testnet-for-its-layer-1-protocol-script-blockchain-2d4ef214b3d