import { ethers } from 'ethers'
const { providers } = ethers
const ETHERSCAN_APIKEY = import.meta.env.VITE_ETHERSCAN_APIKEY
class TBSApi {
  constructor(network = 'homestead') {
    this.provider = new providers.EtherscanProvider(network, ETHERSCAN_APIKEY)
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber()
  }

  async getLatestBlocks() {}
}

export default TBSApi
