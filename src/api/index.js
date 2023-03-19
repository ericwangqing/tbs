import { ethers } from 'ethers'
const { providers } = ethers
const ETHERSCAN_APIKEY = import.meta.env.VITE_ETHERSCAN_APIKEY
import { blockList } from './mock.js'
class TBSApi {
  constructor(network = 'homestead') {
    this.provider = new providers.EtherscanProvider(network, ETHERSCAN_APIKEY)
  }

  // 获取最新区块
  async getBlockNumber() {
    return await this.provider.getBlockNumber()
  }

  // 获取区块列表，同时第一个区块返回交易详情列表
  async getBlockListWithTransactions(offset = 0, limit = 20) {
    return await this.getBlockList(offset, limit, true)
  }

  // 获取区块列表
  async getBlockList(offset = 0, limit = 20, withFirstBlockTransactions) {
    //如果没有传start，默认是获取最新的区块信息
    let firstBlockNumber = await this.getBlockNumber()
    let start = firstBlockNumber
    // return { blocks: blockList, start }
    if (offset) {
      start = start - offset
    }
    let end = start - limit - 1
    const promises = []
    for (let i = start; i > end; i--) {
      promises.push(
        this.getBlockDetail(i, withFirstBlockTransactions ? i === start : false)
      )
    }
    const blocks = await Promise.all(promises)
    const nextBlock = blocks.pop()
    console.log(blocks, nextBlock)
    return { start: firstBlockNumber, blocks, nextBlock }
  }

  sleep(time = 1000) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(time)
      }, time)
    })
  }

  // 获取区块详情
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
      throw Error('get block error')
    }
  }

  // 根据区块获取该区块的交易列表详情
  async getTransactionsByBlock(blockNumber) {
    if (!blockNumber) {
      blockNumber = await this.getBlockNumber()
    }
    const blocks = await this.provider.getBlockWithTransactions(blockNumber)
    console.log(blocks.transactions)
    return blocks.transactions
  }

  // 根据hash获取某个交易详情
  async getTransaction(hash) {
    return await this.provider.getTransaction(hash)
  }

  async getTransactionReceipt(hash) {
    return await this.provider.getTransactionReceipt(hash)
  }
}

export default TBSApi
