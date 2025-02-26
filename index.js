const bitcoin = require('bitcoinjs-lib');
const crypto = require('crypto');

// Define the testnet difficulty
const TESTNET_DIFFICULTY = 1; //  actual testnet difficulty is lower

// Function to compute hash of block header
function computeHash({ index, parentHash, timestamp, data, nonce }) {
    const blockString = `${index}${parentHash}${timestamp}${data}${nonce}`;
    return crypto.createHash('sha256').update(blockString).digest('hex');
}

// Function to mine a block (finds a nonce that generates a valid hash)
function mineBlock(block) {
    let minedBlock = { ...block };
    while (true) {
        minedBlock.hash = computeHash(minedBlock);
        if (minedBlock.hash.startsWith('0'.repeat(TESTNET_DIFFICULTY))) {
            console.log(`Block mined: ${minedBlock.hash} with nonce ${minedBlock.nonce}`);
            return minedBlock;
        }
        minedBlock.nonce++;
    }
}

// Function to create a new block for testnet (assuming previous block info is available)
function createBlock(previousBlock, data) {
    const newBlock = {
        index: previousBlock.index + 1,
        timestamp: Date.now(),
        parentHash: previousBlock.hash,
        nonce: 0,
        data: data,
        difficulty: TESTNET_DIFFICULTY  // Adjust difficulty for testnet
    };
    return mineBlock(newBlock); // Mine the block to find a valid hash
}

// Example of block header verification for testnet
function verifyBlock(block, previousBlock) {
    // Verify the hash meets the difficulty requirement (simplified)
    if (!block.hash.startsWith('0'.repeat(TESTNET_DIFFICULTY))) {
        console.log("Invalid block: Hash does not meet difficulty requirement.");
        return false;
    }

    // Check that the block’s hash is correct
    if (computeHash(block) !== block.hash) {
        console.log("Invalid block: Hash does not match computed hash.");
        return false;
    }

    // Verify the parent hash matches the previous block's hash
    if (block.parentHash !== previousBlock.hash) {
        console.log("Invalid block: Parent hash does not match previous block hash.");
        return false;
    }

    // Verify the timestamp is greater than the previous block's timestamp
    if (block.timestamp <= previousBlock.timestamp) {
        console.log("Invalid block: Timestamp is not greater than previous block timestamp.");
        return false;
    }

    console.log("Block is valid.");
    return true;
}

// Blockchain initialization for testnet example
let testnetBlockchain = [{ index: 0, parentHash: '0'.repeat(64), hash: '0'.repeat(64), nonce: 0, data: "Genesis Block", difficulty: TESTNET_DIFFICULTY }];

// Generate a new block in the testnet blockchain
for (let i = 1; i <= 5; i++) {
    const previousBlock = testnetBlockchain[testnetBlockchain.length - 1];
    const newBlock = createBlock(previousBlock, `Block ${i} data`);
    if (verifyBlock(newBlock, previousBlock)) {
        testnetBlockchain.push(newBlock);
    } else {
        console.log(`Block ${i} is invalid and was not added to the blockchain.`);
    }
}

console.log("Testnet Blockchain:", testnetBlockchain);

