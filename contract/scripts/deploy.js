// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const TAB = await hre.ethers.getContractFactory("Tab");
  const tab = await TAB.deploy();

  await tab.deployed();

  console.log(`deployed to ${tab.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// goerli:  0x51B2C28f6428a0ab53933E2dc27a2550Ad8108F4
// poloygon_mubai: 0xa712Fa283553DA74A734fa2a8F8CF30Cba969c43
// polygon_mainnet: 
// polygon_zkevm: 0x9785E3A9c5C4544496CD2e72B95bd7de837Bec51  // 注意feature 需要用bridge 的方式
// chidao:  0xa712Fa283553DA74A734fa2a8F8CF30Cba969c43
// gnosis:  
