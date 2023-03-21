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
  completed = false
  constructor() {

  }

  get running() {
    return !!this.interval
  }

  initData() {
    this.testData = {
      name: '100K Simulation',
      dataset: 'ETH 2022',
      txn: 2500000,
      estimated: 64800 // seconds
    }
    this.shards = floatRandom(100, 20)
    this.nodes = floatRandom(this.shards * 10, this.shards)
    this.tps = floatRandom(100, 10)
    this.tpsBase = 100
    this.timeCost = 0
    this.isFast = false
    this.completed = false
    this.percent = 0
    this.txCount = 0
    this.testData.estimated = Math.floor(this.testData.txn / this.tpsBase)
  }

  setSpeed(isFast) {
    this.isFast = isFast
    this.tpsBase = this.isFast ? floatRandom(105000, 5000) : floatRandom(100, 10)
    this.setData()
    if (this.testData) {
      this.testData.estimated = Math.floor(this.testData.txn / (this.isFast ? 100000 : 100))
    }
  }

  start() {
    if(!this.testData || this.completed) this.initData()
    this.refreshData()
  }

  setData() {
    this.tps = floatRandom(this.tpsBase, 10)
    this.txCount += this.tps
    if (this.testData) this.percent = this.txCount / this.testData.txn
    this.timeCost++
    if (this.blockCollected === 0) this.nextBlockNeed = floatRandom(100, 10)
    this.blockCollected += this.tps
    if (this.blockCollected >= this.nextBlockNeed) {
      this.blockHeight+= Math.floor(this.blockCollected / this.nextBlockNeed)
      this.blockCollected = this.blockCollected % this.nextBlockNeed
      this.nextBlockNeed = floatRandom(100, 10)
    }
  }

  refreshData() {
    this.interval = setInterval(() => {
      this.setData()
      this.judgeCompleted()
    }, 1000)
  }

  judgeCompleted() {
    if (this.txCount >= this.testData.txn) {
      this.completed = true
      this.percent = 1
      clearInterval(this.interval)
      this.interval = null
    }
  }

  setProgress(progress) {
    if(!this.testData || this.completed) this.initData()
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
