import EventEmitter2 from 'eventemitter2'
import { randomBetween } from './util.js'
import { getAddressKeyString, getPublicKeyString } from './util.js'

const SLOT_TIME = 12
const COLLECT_PERCENT = 5 / 12
const ASSEST_PERCENT = 3 / 12
const FINALIZE_PERCENT = 2 / 12

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

    this.slot = 0
    this.tpsBase = 2000
    this.txCount = 0
    this.chainHeight = 0
    this.timeSpent = 0
    this.running = true
    this.updateNetworkInfoInterval()
  }

  setSpeed(tpsBase) {
    this.tpsBase = tpsBase
  }

  updateNetworkInfoInterval() {
    this.interval = setInterval(() => {
      if (!this.running) return
      const tps = randomBetween(this.tpsBase * 0.95, this.tpsBase * 1.05)
      this.txCount += tps * SLOT_TIME
      if (this.txCount >= this.testData.dataset.txCount) {
        this.txCount = this.testData.dataset.txCount
        setTimeout(() => this.events.emit('complete'), 0)
      }
      this.chainHeight += this.testData.shards
      this.timeSpent += SLOT_TIME
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
        for (let i = 0; i < 10; i++) {
          const base = tps * SLOT_TIME / shards
          const currentBlockTxn = randomBetween(base * 0.95, base * 1.05)
          max = Math.max(max, this.generateBlock(i, currentBlockTxn))
        }
        const txn = randomBetween(100, 200)
        const slot = this.slot
        setTimeout(() => this.events.emit('generateTbBlock', { $beacon: true, number: slot, slot, state: 'collect', timestamp: Date.now() }), 0)
        setTimeout(() => this.events.emit('updateTbBlockState', { $beacon: true, number: slot, slot, txn, tbs: shards, state: 'finalized', timestamp: Date.now() }), max + SLOT_TIME * 40)
      }, 0)
      this.slot++
    }, SLOT_TIME * 1000)
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
    const slot = this.slot
    const collectBase = SLOT_TIME * COLLECT_PERCENT * 1000
    const assestBase = SLOT_TIME * ASSEST_PERCENT * 1000
    const finalizeBase = SLOT_TIME * FINALIZE_PERCENT * 1000
    const collectCost = randomBetween(collectBase * 0.9, collectBase * 1.1)
    const attestCost = randomBetween(assestBase * 0.9, assestBase * 1.1)
    const finalizedCost = randomBetween(finalizeBase * 0.9, finalizeBase * 1.1)
    const miner = getAddressKeyString()
    const hash = getPublicKeyString()
    setTimeout(() => {
      if (this.visibleShards[i] !== undefined) this.events.emit('generateBlock', { number: slot, slot, shard: this.visibleShards[i], state: 'collect', timestamp: Date.now() })
    }, 0)
    setTimeout(() => {
      if (this.visibleShards[i] !== undefined) this.events.emit('updateBlockState', { number: slot, slot, shard: this.visibleShards[i], state: 'attest', timestamp: Date.now() })
    }, collectCost)
    setTimeout(() => {
      if (this.visibleShards[i] !== undefined) this.events.emit('updateBlockState', { number: slot, slot, shard: this.visibleShards[i], state: 'unfinalized', txn, miner, hash, timestamp: Date.now() })
    }, collectCost + attestCost)
    setTimeout(() => {
      if (this.visibleShards[i] !== undefined) this.events.emit('updateBlockState', { number: slot, slot, shard: this.visibleShards[i], state: 'finalized', txn, miner, hash, timestamp: Date.now() })
    }, collectCost + attestCost + finalizedCost)

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

  setVisibleShards(visibleShards) {
    this.visibleShards = visibleShards
  }
}

const executor = new Executor()

export { Executor, executor }
