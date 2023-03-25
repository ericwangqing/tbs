require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
const { PRIVATE_KEY, MINING_INTERVAL, CHIADO_RPC_URL, GNOSIS_RPC_URL,POLYGON_ZKEVM_RPC_URL } = process.env;
const accounts = [PRIVATE_KEY];
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      mining: {
        auto: MINING_INTERVAL ? false : true,
        interval: MINING_INTERVAL ? JSON.parse(MINING_INTERVAL) : undefined,
      },
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/w7uVk4a8jPEe9TyfNC58qpZQ895vYOOs",
      accounts,
    },
    // ploygon test env
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts,
    },
    polygon_mainnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts,
    },
    // ploygon zkEVM
    polygon_zkEVM: {
      url: POLYGON_ZKEVM_RPC_URL,
      accounts,
    },
    // gnosischain testnet
    chiado: {
      url: CHIADO_RPC_URL,
      gasPrice: 1000000000,
      accounts,
    },
    // gnosischain main
    gnosis: {
      url: GNOSIS_RPC_URL,
      accounts,
    },
  },
  etherscan: {
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          //Blockscout
          apiURL: "https://blockscout.com/gnosis/chiado/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          // 3) Select to what explorer verify the contracts
          // Gnosisscan
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
    ],
    apiKey: {
      //4) Insert your Gnosisscan API key
      //blockscout explorer verification does not require keys
      chiado: "your key",
      gnosis: "your key",
    },
  },
  gasReporter: {
    enabled: false,
  },
};
