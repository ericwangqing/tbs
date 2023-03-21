import { reactive } from 'vue';
const LINE_CHART_X_RANGE = 40

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
  started = false
  runningByStart = false
  performanceData = {
    inAll: [],
    outAll: []
  }
  resourceData = {
    cpu: [],
    memory: [],
    bandwidth: []
  }
  mode = ''
  playbackSpeed = 1
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
    this.performanceData = {
      inAll: [],
      outAll: []
    }
    this.resourceData = {
      cpu: [],
      memory: [],
      bandwidth: []
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
    this.started = true
    this.runningByStart = true
    this.testData.estimated = Math.floor(this.testData.txn / this.tpsBase)
    this.mode = 'Playback'
    this.playbackSpeed = 1.5
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

  clearDataOutOfDate(data) {
    if (data && data.length >= LINE_CHART_X_RANGE) data.shift()
  }

  setPerformanceAndResourceData(timestamp) {
    const now = timestamp || Date.now()
    const departureMessagesLastSec = this.tps
    const arrivalMessagesLastSec = Math.round(departureMessagesLastSec * (0.9 + Math.random() * 0.2))

    const cpu = 10 * Math.random();
    const memory = 10 + 10 * Math.random();
    const bandwidth = 20 + 10 * Math.random();

    this.clearDataOutOfDate(this.performanceData.inAll)
    this.clearDataOutOfDate(this.performanceData.outAll)
    this.clearDataOutOfDate(this.resourceData.cpu)
    this.clearDataOutOfDate(this.resourceData.memory)
    this.clearDataOutOfDate(this.resourceData.bandwidth)

    this.performanceData.outAll.push({ name: now.toString(), value: [new Date(now), departureMessagesLastSec] })
    this.performanceData.inAll.push({ name: now.toString(), value: [new Date(now), arrivalMessagesLastSec] })

    this.resourceData.cpu.push({ name: now.toString(), value: [new Date(now), cpu] })
    this.resourceData.memory.push({ name: now.toString(), value: [new Date(now), memory] })
    this.resourceData.bandwidth.push({ name: now.toString(), value: [new Date(now), bandwidth] })
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
    this.setPerformanceAndResourceData()
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
      this.started = false
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
      // set progress, no need to mock performance and resource data.
      // const performanceAndResourceDataLength = Math.min(LINE_CHART_X_RANGE, this.timeCost)
      // for (let i = 0; i < performanceAndResourceDataLength; i++) {
      //   this.setPerformanceAndResourceData(Date.now() - i * 1000)
      // }
    }, 0)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
      this.runningByStart = false
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
