// Simulate multi-shard chains to test 100kTPS, i.e. 100,000 transactions per second, if we have 10 shard chains, then the transactions on each chain should reach 10,000/s
const { GOERLI_CONTRACT_ADDRESS: CONTRACT_ADDRESS, SIGNER_LENGTH = 20, W3_INTERVAL = 1000 } = process.env;
const { ethers } = require("hardhat");
const TAB = require("../index.js");
async function main() {
  const signers = await ethers.getSigners();

  let slot;
  ethers.provider.on("block", async (blockNumber) => {
    console.log("Block generation, sequence number:" + blockNumber);
    if (!slot) {
      console.log("Start simulating submitting information to the beacon chain.", signers.length);
      slot = blockNumber;
      // Suppose our shard chain mint block every 4s 
      setInterval(() => {
        // In one slot, we simulate 20 subchains submitting information to the beacon chain
        slot++;
        for (let i = 0; i < SIGNER_LENGTH; i++) {
          const blockHash = ethers.utils.randomBytes(32);
          const tabContract = new TAB(CONTRACT_ADDRESS, signers[i % 20]);
          let currentSlot = slot;
          tabContract.setTab(currentSlot, signers[i % 20].address, blockHash).then((tx) => {
            console.log(`address${i + 1} in slot ${currentSlot} submit success，transaction hash：${tx.hash}`);
            ethers.provider.waitForTransaction(tx.hash).then((receipt) => {
              console.log(`address${i + 1} in slot${currentSlot}.The submitted information is confirmed in block ${receipt.blockNumber}.,transactionhash:${tx.hash}`);
            });
          });
        }
      }, W3_INTERVAL);
    }
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    // process.exit(1);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
