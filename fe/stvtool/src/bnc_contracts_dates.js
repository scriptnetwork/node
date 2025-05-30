const Web3 = require('web3').default;
const web3 = new Web3('https://bsc-dataseed.binance.org');

// ABI for stakingEnd for the first contract
const abi1 = [
    {
        "inputs": [],
        "name": "stakingEnd",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// ABI for depositEnd and stakingEnd for the second contract
const abi2 = [
    {
        "inputs": [],
        "name": "depositEnd",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stakingEnd",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Address of the smart contracts
const contractAddress1 = '0x440B574887a674160597b389b2025EA9A4195981';
const contractAddress2 = '0xaC034f02FfA05F7C4491a09E78461c5e64Adf9EE';

// Name mapping for the contracts
const contractNames = {
    [contractAddress1]: 'Stake v2',
    [contractAddress2]: 'Stake v1'
};

// Create contract instances
const contract1 = new web3.eth.Contract(abi1, contractAddress1);
const contract2 = new web3.eth.Contract(abi2, contractAddress2);

// Function to get staking end time for contract 1
async function getStakingEndTime1() {
    try {
        const stakingEnd = await contract1.methods.stakingEnd().call();
        const stakingEndTime = Number(stakingEnd);
        if (isNaN(stakingEndTime)) {
            throw new Error('Invalid staking end time');
        }
        const endDate = new Date(stakingEndTime * 1000);
        console.log(`${contractNames[contractAddress1]} Staking ends at:`, endDate);
    } catch (error) {
        console.error("Error fetching staking end time for Contract 1:", error);
    }
}

// Function to get deposit and staking end times for contract 2
async function getDepositAndStakingEndTime2() {
    try {
        const depositEnd = await contract2.methods.depositEnd().call();
        const stakingEnd = await contract2.methods.stakingEnd().call();

        const depositEndTime = Number(depositEnd);
        const stakingEndTime = Number(stakingEnd);

        if (isNaN(depositEndTime) || isNaN(stakingEndTime)) {
            throw new Error('Invalid deposit or staking end time');
        }

        const depositEndDate = new Date(depositEndTime * 1000);
        const stakingEndDate = new Date(stakingEndTime * 1000);

        console.log(`${contractNames[contractAddress2]} Deposit ends at:`, depositEndDate);
        console.log(`${contractNames[contractAddress2]} Staking ends at:`, stakingEndDate);
    } catch (error) {
        console.error("Error fetching deposit or staking end time for Contract 2:", error);
    }
}

// Run the functions
async function run() {
    await getStakingEndTime1(); // Get staking end for the first contract
    await getDepositAndStakingEndTime2(); // Get deposit and staking ends for the second contract
}

run();

