import { init, pickChainUrl } from 'etherscan-api'
import axios from 'axios'
import { BigNumber } from 'ethers'
import { blockList } from './mock'
const ETHERSCAN_APIKEY = import.meta.env.VITE_ETHERSCAN_APIKEY
class TBSApi {
  constructor(network = 'homestead') {
    // const chain = pickChainUrl(network)
    // console.log(chain)
    // const client = axios.create({
    //   baseURL: chain,
    //   timeout: 10000,
    // })
    this.api = init(ETHERSCAN_APIKEY, network, 30000)
  }

  // 获取最新区块
  async getBlockNumber() {
    const result = await this.api.proxy.eth_blockNumber()
    return BigNumber.from(result.result).toNumber()
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
          blocks = await this.api.proxy.eth_getBlockByNumber(
            BigNumber.from(blockNumber).toHexString().replace(/^0x0+/, '0x')
          )
        } else {
          blocks = await this.api.proxy.eth_getBlockByNumber(
            BigNumber.from(blockNumber).toHexString().replace(/^0x0+/, '0x')
          )
        }
      } catch (e) {
        await this.sleep()
      }
    }
    if (blocks) {
      blocks.result.transactions.map((tx) => {
        return this.hex2Number(tx, ['blockNumber', 'timestamp'])
      })
      return this.hex2Number(
        blocks.result,
        ['number', 'timestamp'],
        ['totalDifficulty', 'size']
      )
    } else {
      throw Error('get block error')
    }
  }

  // 获取区块奖励
  async getBlockRward(blockNumber) {
    const { result } = await this.api.block.getblockreward(null, blockNumber)
    return result
  }

  // 根据区块获取该区块的交易列表详情
  async getTransactionsByBlock(blockNumber) {
    if (!blockNumber) {
      blockNumber = await this.getBlockNumber()
    }
    const blocks = await this.getBlockDetail(blockNumber)
    console.log(blocks.transactions)
    return blocks.transactions
  }

  // 根据hash获取某个交易详情
  async getTransaction(hash) {
    const result = await this.api.proxy.eth_getTransactionByHash(hash)
    return this.hex2Number(result.result, [
      'timestamp',
      'blockNumber',
      'type',
      'nonce',
      'transactionIndex',
    ])
  }

  // 获取交易收据
  async getTransactionReceipt(hash) {
    const result = await this.api.proxy.eth_getTransactionReceipt(hash)
    return this.hex2Number(result.result, [
      'timestamp',
      'blockNumber',
      'status',
    ])
  }

  // 获取账户余额
  async getAccountBalance(address) {
    const { result } = await this.api.account.balance(address)
    return result
  }

  // 获取某个账户的交易列表
  async getTransactionsByAddress(
    { address, startblock, endblock, page, offset, sort } = {
      endblock: 'latest',
      startblock: 1,
      page: 1,
      offset: 10,
      sort: 'asc',
    }
  ) {
    const { result } = await this.api.account.txlist(
      address,
      startblock,
      endblock,
      page,
      offset,
      sort
    )
    return result
  }

  hex2Number(data, properties, propertiesOfNumberString = []) {
    properties.map((p) => {
      data[p] && (data[p] = BigNumber.from(data[p]).toNumber())
    })
    propertiesOfNumberString.map((p) => {
      data[p] && (data[p] = BigNumber.from(data[p]).toString())
    })
    return data
  }
}

export default TBSApi
