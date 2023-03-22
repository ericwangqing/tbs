import EventEmitter2 from 'eventemitter2'
import { randomBetween } from './util.js'
import { getAddressKeyString, getPublicKeyString } from './util.js'

class Executor {
  tpsBase = 0 // tps waved based on tpsBase, doesn't need in real situation.
  testData = null
  visibleShards = null

  interval = null
  running = false
  txCount = 0
  chainHeight = 0
  timeSpent = 0
  slot = 0
  running = false
  constructor() {
    this.events = new EventEmitter2({ wildcard: true })
  }

  start(testData, visibleShards) {
    this.testData = testData
    this.visibleShards = visibleShards
    this.running = true

    this.tpsBase = 500
    this.txCount = 0
    this.chainHeight = 0
    this.timeSpent = 0
    this.running = true
    this.updateNetworkInfoInterval()
    // this.generateBlockInterval()
  }

  setSpeed(tpsBase) {
    this.tpsBase = tpsBase
  }

  updateNetworkInfoInterval() {
    this.interval = setInterval(() => {
      if (!this.running) return
      const tps = randomBetween(this.tpsBase * 0.95, this.tpsBase * 1.05)
      this.txCount += tps * 12
      if (this.txCount >= this.testData.dataset.txCount) {
        this.txCount = this.testData.dataset.txCount
        setTimeout(() => this.events.emit('complete'), 0)
      }
      this.chainHeight += this.testData.shards
      this.timeSpent += 12
      const shards = this.testData.shards
      const performance = this.getPerformance(tps)
      const resource = this.getResource()
      this.events.emit('updateNetworkInfo', {
        tps,
        txCount: this.txCount,
        chainHeight: this.chainHeight,
        shards: shards,
        nodes: randomBetween(this.testData.nodes * 0.95, this.testData.nodes * 1.05),
        timeSpent: this.timeSpent,
        performance,
        resource
      })
      setTimeout(() => {
        let max = 0
        for (let i = 0; i < this.visibleShards.length; i++) {
          const base = tps * 12 / shards
          const currentBlockTxn = randomBetween(base * 0.95, base * 1.05)
          max = Math.max(max, this.generateBlock(i, currentBlockTxn))
        }
        const txn = randomBetween(100, 200)
        const slot = this.slot
        setTimeout(() => this.events.emit('generateTbBlock', { number: slot, slot, state: 'collect', timestamp: Date.now() }), 0)
        setTimeout(() => this.events.emit('updateTbBlockState', { number: slot, slot, txn, tbs: shards, state: 'finalized', timestamp: Date.now() }), max + 500)
      }, 0)
      this.slot++
    }, 12000)
  }

  getPerformance(tps) {
    return {
      in: Math.round(tps * (0.9 + Math.random() * 0.2)),
      out: tps
    }
  }

  getResource() {
    return {
      cpu: 10 * Math.random(),
      memory: 10 + 10 * Math.random(),
      bandwidth: 20 + 10 * Math.random()
    }
  }

  generateBlock(i, txn) {
    const shard = this.visibleShards[i]
    const slot = this.slot
    const collectCost = randomBetween(4500, 5400)
    const attestCost = randomBetween(2500, 3400)
    const finalizedCost = randomBetween(1500, 2400)
    const miner = getAddressKeyString()
    const hash = getPublicKeyString()
    setTimeout(() => this.events.emit('generateBlock', { number: slot, slot, shard, state: 'collect', timestamp: Date.now() }), 0)
    setTimeout(() => this.events.emit('updateBlockState', { number: slot, slot, shard, state: 'attest', timestamp: Date.now() }), collectCost)
    setTimeout(() => this.events.emit('updateBlockState', { number: slot, slot, shard, state: 'unfinalized', txn, miner, hash, timestamp: Date.now() }), collectCost + attestCost)
    setTimeout(() => this.events.emit('updateBlockState', { number: slot, slot, shard, state: 'finalized', txn, miner, hash, timestamp: Date.now() }), collectCost + attestCost + finalizedCost)

    return collectCost + attestCost + finalizedCost
  }

  pause() {
    this.running = false
  }

  resume() {
    this.running = true
  }

  stop() {
    if (this.interval) clearInterval(this.interval)
    this.interval = null
  }
}

const executor = new Executor()

export { Executor, executor }
