import { reactive } from 'vue';

const floatRandom = (base, num) => {
  return Math.floor((Math.random() - 0.5) * num) + base
}

class Controller {
  tps = 0
  txCount = 0
  blockHeight = 0
  shards = 0
  nodes = 0
  interval = null
  percent = 0
  timeCost = 0
  isFast = false
  tpsBase = 0
  blockCollected = 0
  nextBlockNeed = 0
  constructor() {

  }

  get running() {
    return !!this.interval
  }

  initData() {
    this.testData = {
      name: '100K Simulation',
      dataset: 'ETH 2022',
      txn: 1000000000000,
      estimated: 64800 // seconds
    }
    this.shards = floatRandom(100, 20)
    this.nodes = floatRandom(this.shards * 10, this.shards)
    this.tps = floatRandom(100, 10)
    this.tpsBase = 100
    this.timeCost = 0
    this.isFast = false
    this.testData.estimated = Math.floor(this.testData.txn / this.tpsBase / this.nodes)
  }

  setSpeed(isFast) {
    this.isFast = isFast
    this.tpsBase = this.isFast ? floatRandom(105000, 5000) : floatRandom(100, 10)
    this.setData()
    if (this.testData) {
      this.testData.estimated = Math.floor(this.testData.txn / (this.isFast ? 100000 : 100) / this.nodes)
    }
  }

  start() {
    if(!this.testData) this.initData()
    this.refreshData()
  }

  setData() {
    this.tps = floatRandom(this.tpsBase, 10)
    this.txCount += this.tps * this.nodes
    this.percent = this.txCount / this.testData.txn
    this.timeCost++
    if (this.blockCollected === 0) this.nextBlockNeed = floatRandom(100, 10)
    this.blockCollected += this.tps * this.nodes
    if (this.blockCollected >= this.nextBlockNeed) {
      this.blockHeight+= Math.floor(this.blockCollected / this.nextBlockNeed)
      this.blockCollected = this.blockCollected % this.nextBlockNeed
      this.nextBlockNeed = floatRandom(100, 10)
    }
  }

  refreshData() {
    this.interval = setInterval(() => {
      this.setData()
    }, 1000)
  }

  setProgress(progress) {
    if(!this.testData) this.initData()
    setTimeout(() => {
      this.txCount = this.testData.txn * progress / 100
      const standardBlock = this.txCount / 100
      this.blockHeight = floatRandom(standardBlock, standardBlock / 10)
      this.timeCost = Math.floor(this.testData.estimated * progress / 100)
      this.percent = progress / 100
    }, 0)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  startOrStop() {
    if (this.interval) this.stop()
    else this.start()
  }

}
const controller = reactive(new Controller())
export {
  controller
}
