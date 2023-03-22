
import { reactive } from 'vue'
import { Executor } from './executor.js'
import { randomBetween } from './util.js'
import testList from './test-list.json'
const LINE_CHART_X_RANGE = 40
const VISIBLE_BLOCK_COUNT = 6
const PREPARING_TIME = 5300 // start a test, cockpit's prepare animation cost.

class Controller {
  // type = 'simulate' // simulate | real.
  state = 'stopped' // stopped | preparing | running | pausing | completed
  mode = '' // '' | Playback | Executing, '' if stop. 
  playbackSpeed = 1
  tps = 0
  txCount = 0
  chainHeight = 0
  shards = 0
  nodes = 0
  testData = null
  timeSpent = 0
  performanceData = {
    inAll: [],
    outAll: []
  }
  resourceData = {
    cpu: [],
    memory: [],
    bandwidth: []
  }

  visibleShards = []
  visibleLatestShardBlocks = []
  visibleLatestTbBlocks = []

  constructor() {
    this.executor = new Executor()
    this.testList = testList
  }

  get percent() {
    if (!this.testData) return 0
    return this.txCount / this.testData.dataset.txCount
  }

  addTest(test) {
    this.testList.push(test)
  }

  removeTest(testId) {
    const index = this.testList.findIndex(test => test.id === testId)
    if (index !== -1) this.testList.splice(index, 1)
  }

  initEvents() {
    // Binds
    this.updateNetworkInfo = this.updateNetworkInfo.bind(this)
    this.generateTbBlock = this.generateTbBlock.bind(this)
    this.generateBlock = this.generateBlock.bind(this)
    this.updateTbBlockState = this.updateTbBlockState.bind(this)
    this.updateBlockState = this.updateBlockState.bind(this)
    this.handleCompleted = this.handleCompleted.bind(this)

    this.executor.events?.on('updateNetworkInfo', this.updateNetworkInfo)
    this.executor.events?.on('generateTbBlock', this.generateTbBlock)
    this.executor.events?.on('generateBlock', this.generateBlock)
    this.executor.events?.on('updateTbBlockState', this.updateTbBlockState)
    this.executor.events?.on('updateBlockState', this.updateBlockState)
    this.executor.events?.on('complete', this.handleCompleted)
  }

  disposeEvents() {
    this.executor.events?.off('updateNetworkInfo', this.updateNetworkInfo)
    this.executor.events?.off('generateTbBlock', this.generateTbBlock)
    this.executor.events?.off('generateBlock', this.generateBlock)
    this.executor.events?.off('updateTbBlockState', this.updateTbBlockState)
    this.executor.events?.off('updateBlockState', this.updateBlockState)
    this.executor.events?.off('complete', this.handleCompleted)
  }

  dispose() {
    this.disposeEvents()
  }

  resetBasicNetworkInfo() {
    this.tps = 0
    this.txCount = 0
    this.chainHeight = 0
    if (this.visibleShards.length === 0) {
      this.visibleShards = [0, 1, 2, 3, 4]
      this.visibleLatestShardBlocks = [[], [], [], [], []]
    }
    this.visibleLatestShardBlocks.map((shardBlocks) => {
      shardBlocks = []
    })
    this.visibleLatestTbBlocks = []
    this.timeSpent = 0
    this.performanceData.inAll = []
    this.performanceData.outAll = []
    this.resourceData.cpu = []
    this.resourceData.memory = []
    this.resourceData.bandwidth = []
  }

  start(mode, testId) {
    if (mode !== 'Executing' && mode !== 'Playback') throw new Error(`mode error: must be \`Executing\` or \`Playback\`, current: ${mode}!`)
    if (this.state !== 'stopped') throw new Error(`State error: need stopped, current: ${this.state}, cannot start!`)
    const testData = this.testList.find((data) => data.id === testId)
    if (!testData) throw new Error(`Could find test with id ${testId}!`)
    if (mode === 'Playback' && !testData.result) throw new Error(`${testData.name} hasn't yet executed, cannot playback!`)
    this.testData = testData
    this.resetBasicNetworkInfo()
    this.mode = mode
    this.shards = testData.shards
    this.nodes = testData.nodes
    this.state = 'preparing'
    if (this.interval) clearInterval(this.interval)
    setTimeout(() => {
      this.state = 'running'
      if (mode === 'Playback') {
        // TODO run record directly, currrent use the executor to create playback data.
        this.initEvents()
        this.executor.start(this.testData, this.visibleShards)
      } else {
        this.initEvents()
        this.executor.start(this.testData, this.visibleShards)
      }
    }, PREPARING_TIME)
  }

  stop() {
    this.state = 'stopped'
    if (this.mode === 'execute') this.executor.stop()
    this.mode = ''
    this.disposeEvents()
  }

  pause() {
    this.state = 'pausing'
    if (this.mode === 'execute') this.executor.pause()
  }

  resume() {
    if (this.state !== 'pausing') throw new Error(`State error: need pausing, current: ${this.state}, cannot resume!`)
    this.state = 'running'
    if (this.mode === 'execute') this.executor.resume()
  }

  updateNetworkInfo({ tps, txCount, chainHeight, shards, nodes, timeSpent, performance, resource }) {
    this.tps = tps
    this.txCount = txCount
    this.chainHeight = chainHeight
    this.shards = shards
    this.nodes = nodes
    this.timeSpent = timeSpent
    const now = Date.now()
    this.performanceData.outAll.push({ name: now.toString(), value: [new Date(now), performance.out] })
    this.performanceData.inAll.push({ name: now.toString(), value: [new Date(now), performance.in] })

    this.resourceData.cpu.push({ name: now.toString(), value: [new Date(now), resource.cpu] })
    this.resourceData.memory.push({ name: now.toString(), value: [new Date(now), resource.memory] })
    this.resourceData.bandwidth.push({ name: now.toString(), value: [new Date(now), resource.bandwidth] })
  }

  generateTbBlock(block) {
    this.visibleLatestTbBlocks.push(block)
    if (this.visibleLatestTbBlocks.length > VISIBLE_BLOCK_COUNT) this.visibleLatestTbBlocks.shift()
  }

  generateBlock(block) {
    const belongTo = block.shard
    const index = this.visibleShards.findIndex(shard => shard === belongTo)
    if (index === -1) return
    this.visibleLatestShardBlocks[index].push(block)
    if (this.visibleLatestShardBlocks[index].length > VISIBLE_BLOCK_COUNT) this.visibleLatestShardBlocks[index].shift()
  }

  updateTbBlockState(block) {
    const target = this.visibleLatestTbBlocks.find(b => b.number === block.number)
    if (!target) return
    Object.assign(target, block)
  }

  updateBlockState(block) {
    const index = this.visibleShards.findIndex(s => s === block.shard)
    if (index === -1) return
    const target = this.visibleLatestShardBlocks[index].find(b => b.number === block.number)
    if (!target) return
    Object.assign(target, block)
  }

  clearDataOutOfRange(data) {
    if (data && data.length > LINE_CHART_X_RANGE) data.shift()
  }

  setPerformanceAndResourceData(timestamp) {
    const now = timestamp || Date.now()
    const departureMessagesLastSec = this.tps
    const arrivalMessagesLastSec = Math.round(departureMessagesLastSec * (0.9 + Math.random() * 0.2))

    const cpu = 10 * Math.random();
    const memory = 10 + 10 * Math.random();
    const bandwidth = 20 + 10 * Math.random();

    this.performanceData.outAll.push({ name: now.toString(), value: [new Date(now), departureMessagesLastSec] })
    this.performanceData.inAll.push({ name: now.toString(), value: [new Date(now), arrivalMessagesLastSec] })

    this.resourceData.cpu.push({ name: now.toString(), value: [new Date(now), cpu] })
    this.resourceData.memory.push({ name: now.toString(), value: [new Date(now), memory] })
    this.resourceData.bandwidth.push({ name: now.toString(), value: [new Date(now), bandwidth] })

    this.clearDataOutOfRange(this.performanceData.inAll)
    this.clearDataOutOfRange(this.performanceData.outAll)
    this.clearDataOutOfRange(this.resourceData.cpu)
    this.clearDataOutOfRange(this.resourceData.memory)
    this.clearDataOutOfRange(this.resourceData.bandwidth)
  }

  setVisibleShards({ page, count, key }) {
    if (key) this.visibleShards = [key]
    else {
      this.visibleShards = []
      for (let i = (page - 1) * count; i < page * count; i++) {
        this.visibleShards.push(i)
      }
    }
    this.visibleLatestShardBlocks = []
    this.visibleShards.map(s => this.visibleLatestShardBlocks.push([]))
  }

  handleCompleted() {
    this.state = 'completed'
    this.executor.stop()
  }

  setSpeed(isFast) {
    const tpsBase = isFast ? randomBetween(106000, 116000) : randomBetween(90, 110)
    this.executor.setSpeed(tpsBase)
  }

  setProgress(progress) {
    
  }
}

const controller = reactive(new Controller())
export {
  controller
}
