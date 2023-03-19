import { ethers } from 'ethers'
const { providers } = ethers
const ETHERSCAN_APIKEY = import.meta.env.VITE_ETHERSCAN_APIKEY
import { blockList } from './mock.js'
class TBSApi {
  constructor(network = 'homestead') {
    this.provider = new providers.EtherscanProvider(network, ETHERSCAN_APIKEY)
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber()
  }

  async getBlockListWithTransactions(offset = 0, limit = 20) {
    return await this.getBlockList(offset, limit, true)
  }

  async getBlockList(offset = 0, limit = 20, withFirstBlockTransactions) {
    //如果没有传start，默认是获取最新的区块信息
    let start = await this.getBlockNumber()
    return { blocks: blockList, start }
    if (offset) {
      start = start - offset
    }
    let end = start - limit
    const promises = []
    for (let i = start; i > end; i--) {
      promises.push(
        this.getBlockDetail(i, withFirstBlockTransactions ? i === start : false)
      )
    }
    const blocks = await Promise.all(promises)
    return { start, blocks }
  }

  sleep(time = 1000) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(time)
      }, time)
    })
  }

  async getBlockDetail(blockNumber, withTransactions) {
    let retry = 4
    let blocks
    while (!blocks && retry > 0) {
      try {
        retry--
        if (withTransactions) {
          blocks = await this.provider.getBlockWithTransactions(blockNumber)
        } else {
          blocks = await this.provider.getBlock(blockNumber)
        }
      } catch (e) {
        await this.sleep()
      }
    }
    if (blocks) {
      return blocks
    } else {
      debugger
      throw Error('get block error')
    }
  }

  async getTransactionsByBlock(blockNumber) {
    if (!blockNumber) {
      blockNumber = await this.getBlockNumber()
    }
    const blocks = await this.provider.getBlockWithTransactions(blockNumber)
    return blocks.transactions
  }
}

export default TBSApi
