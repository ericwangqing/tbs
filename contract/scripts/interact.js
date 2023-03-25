require("dotenv").config();
const contractABI = require("../artifacts/contracts/Tab.sol/TAB.json");
const { PRIVATE_KEY, CHIADO_RPC_URL, GNOSIS_RPC_URL, POLYGON_ZKEVM_RPC_URL, GOERLI_CONTRACT_ADDRESS, POLYGON_MUBAI_CONTRACT_ADDRESS, CHIADO_CONTRACT_ADDRESS,POLYGON_ZKEVM_CONTRACT_ADDRESS } = process.env;
const { ethers } = require("ethers");

const contracts = [GOERLI_CONTRACT_ADDRESS, POLYGON_MUBAI_CONTRACT_ADDRESS, CHIADO_CONTRACT_ADDRESS, "", "",POLYGON_ZKEVM_CONTRACT_ADDRESS];
const index = 5;
const rpc = [
  "https://eth-goerli.g.alchemy.com/v2/w7uVk4a8jPEe9TyfNC58qpZQ895vYOOs",
  "https://rpc-mumbai.maticvigil.com",
  CHIADO_RPC_URL,
  "https://polygon-mainnet.g.alchemy.com/v2/3s0BzWbUwF7U7p84DPNFltfhk-W0UEEy",
  GNOSIS_RPC_URL,
  POLYGON_ZKEVM_RPC_URL
];
async function main() {
  if (!contracts[index]) {
    throw new Error("The contract has not yet been deployed to the corresponding chain");
  }
  const provider = new ethers.providers.JsonRpcProvider(rpc[index]);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const contract = new ethers.Contract(contracts[index], contractABI.abi, wallet);

  console.log("Set Time Beacon");
  const hash = ethers.utils.randomBytes(32);
  const tx = await contract.setTab(100, wallet.address, hash);
  await tx.wait();
  console.log("write block success");
  let hb = await contract.hasBlock(100, wallet.address, hash);
  console.log("if find the beacon", hb);
  hb = await contract.hasBlock(100, wallet.address, ethers.utils.randomBytes(32));
  console.log("try to find an inexistent beacon, not found", hb);
}

main();
