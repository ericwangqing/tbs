<template lang="pug">
.blockchain-page-container
  BenchmarkHeader.benchmark-header(category="chain" @change-category="gotoCockpit")
  ConfigPop(@configHide="configVisible = false" v-if="configVisible")
  .blockchain-page-content
    .blockchain-overview-container
      .blockchain-overview-header
        .blockchain-title Time Beacon Chain
        a-progress(v-if="!loading" type="circle" :percent="percent" :width="20" :strokeWidth="10" :format="() => ''" strokeColor="#ffffff" trailColor="#373948")
      .blockchain-overview-content
        .blockchain-item
          .blockchain-info
            span(v-if="!loading") ETH
          .blockchain-detail
            .blockchain-linkline
            BlockchainSkeleton(v-if="loading")
            Blockchain.chain(v-else :blocks="timeBeaconChain")
            .left-fade-mask
            .right-fade-mask
          .blockchain-more
            .blocklist-btn(@click="gotoBlockList('beacon')")
              EllipsisOutlined
    .blockchain-overview-container
      .blockchain-overview-header
        .blockchain-title
          span Sharding Chain&nbsp
          span(v-if="!loading") ({{filterShardChainNum}})
        .blockchain-interface(v-if="!loading")
          RangeSelector(:min="0" :max="shardChainNum - 1" @confirm="filterBlockchain" style="margin-right: 30px")
          a-progress(type="circle" :percent="percent" :width="20" :strokeWidth="10" :format="() => ''" strokeColor="#ffffff" trailColor="#373948")
      .blockchain-overview-content
        .blockchain-item(v-for="i in [0, 1, 2, 3, 4]" :key="i" v-if="loading")
          .blockchain-info
          .blockchain-detail
            .blockchain-linkline
            BlockchainSkeleton
            .left-fade-mask
            .right-fade-mask
          .blockchain-more
            .blocklist-btn
              EllipsisOutlined
        .blockchain-item(v-for="(blockchain) in shardChains" :key="blockchain[0].shard" v-else)
          .blockchain-info S-{{`${blockchain[0].shard}`.padStart(3, '0')}}
          .blockchain-detail
            .blockchain-linkline
            Blockchain.chain(:blocks="blockchain")
            .left-fade-mask
            .right-fade-mask
          .blockchain-more
            .blocklist-btn(@click="gotoBlockList('shard',blockchain[0].shard)")
              EllipsisOutlined
      .blockchain-overview-footer
        a-pagination(
          size="small"
          v-model:current="currentPage"
          show-size-changer
          show-quick-jumper
          :total="filterShardChainNum"
          v-model:pageSize="pageSize"
          :pageSizeOptions="['5', '10']"
        )
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  inject,
  watchEffect,
} from 'vue'
import { useRouter } from 'vue-router'
import Blockchain from './components/blockchain.vue'
import RangeSelector from './components/range-selector.vue'
import BlockchainSkeleton from './components/blockchain-skeleton.vue'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import ConfigPop from '@/pages/Benchmark/components/config-popup.vue'
import { random, range } from 'lodash'

export default defineComponent({
  name: 'ShardOverview',
  components: {
    Blockchain,
    EllipsisOutlined,
    RangeSelector,
    BlockchainSkeleton,
    ConfigPop,
  },
  setup: () => {
    const w3Api = inject('w3Api')
    const timeBeaconChain = reactive([]) // 信标链
    const shardChains = reactive([]) // n个分片链
    const percent = ref(0) // slot 进度条
    const pageSize = ref(5) // 每页显示的分片链数量
    const currentPage = ref(1) // 当前页码
    const currentPageShards = reactive([0, 1, 2, 3, 4]) // 当前页面显示的分片链序号
    const shardChainNum = ref(229) // 分片链总数量
    const filterShardChainNum = ref(shardChainNum.value) // 分页显示的分片链数量
    const allPageShards = reactive(range(shardChainNum.value)) // 全部分片链序号
    const loading = ref(true)
    const router = useRouter()
    const configVisible = ref(false)

    const syncLatestBeaconBlocks = async () => {
      // 获取最新几个信标链区块
      return new Promise((resolve) => {
        setTimeout(() => {
          const num = 6
          const now = Date.now() - 2000
          timeBeaconChain.splice(
            0,
            timeBeaconChain.length,
            ...range(num).map((slot) => {
              const timestamp = now - (4 - slot) * 12000
              return {
                number: slot,
                slot,
                state: 'finalized',
                timestamp,
                $key: random(1000),
                $beacon: true,
              }
            })
          )
          resolve()
        }, 2000)
      })
    }

    const syncLatestShardBlocks = async (shardIndexArray) => {
      // 获取最新几个分片链区块
      return new Promise((resolve) => {
        setTimeout(() => {
          const num = 6
          const now = Date.now() - 2000
          shardChains.splice(0, shardChains.length)
          shardIndexArray.forEach((index) => {
            shardChains.push(
              range(num).map((slot) => {
                const timestamp = now - (4 - slot) * 12000
                return {
                  number: slot,
                  slot,
                  shard: index,
                  txn: random(500),
                  state: 'finalized',
                  timestamp,
                  $key: random(1000),
                }
              })
            )
          })
          resolve()
        }, 2000)
      })
    }
    // 事件信标区块经历 收集、敲定 两个阶段
    // event: { number, slot, state, timestamp }
    // block: { number, slot, state, timestamp, $key, $hide }
    const handleBeaconBlockCollectEvent = (event) => {
      const block = timeBeaconChain.find((b) => b.slot === event.slot)
      if (block) {
        block.state = event.state
      } else {
        // 新增加一个收集中的块
        const block = {
          number: event.number,
          slot: event.slot,
          state: event.state,
          timestamp: Date.now(),
          $key: random(1000),
          $beacon: true,
        }
        timeBeaconChain.push(block)
        if (timeBeaconChain.length > 5) {
          setTimeout(() => {
            timeBeaconChain.shift()
          }, 50)
        }
      }
    }
    // event: { number, slot, txn, tbs, state, timestamp }
    // block: { number, slot, txn, tbs, state, timestamp, $key, $hide }
    const handleBeaconBlockFinalizedEvent = (event) => {
      const block = timeBeaconChain.find((b) => b.slot === event.slot)
      if (block) {
        block.txn = event.txn
        block.tbs = event.tbs
        block.state = event.state
        block.timestamp = event.timestamp
      }
    }
    // 分片区块经历 收集、见证、出块、敲定 四个阶段
    // event: { number, slot, shard, state, timestamp }
    // block: { number, slot, shard, state, timestamp, $key, $hide }
    const handleShardBlockCollectEvent = (event) => {
      // 处理区块收集事件
      // 不处理当前页面不显示的分片区块通知
      if (!currentPageShards.includes(event.shard)) return
      const blocks = shardChains.find((chain) => chain[0].shard === event.shard)
      const block = blocks.find((b) => b.slot === event.slot)
      if (block) {
        block.state = event.state
      } else {
        // 新增加一个收集中的块
        const block = {
          number: event.number,
          slot: event.slot,
          shard: event.shard,
          state: event.state,
          timestamp: event.timestamp,
          $key: random(1000),
        }
        blocks.push(block)
        if (blocks.length > 5) {
          setTimeout(() => {
            blocks.shift()
          }, 50)
        }
      }
    }
    const handleShardBlockAttestEvent = (event) => {
      // 处理区块见证事件
      if (!currentPageShards.includes(event.shard)) return
      const blocks = shardChains.find((chain) => chain[0].shard === event.shard)
      const block = blocks.find((b) => b.slot === event.slot)
      if (block) {
        block.state = event.state
        block.timestamp = event.timestamp
      }
    }
    const handleShardBlockUnfinalizedEvent = (event) => {
      // 处理区块出块事件
      if (!currentPageShards.includes(event.shard)) return
      const blocks = shardChains.find((chain) => chain[0].shard === event.shard)
      const block = blocks.find((b) => b.slot === event.slot)
      if (block) {
        block.state = event.state
        block.txn = event.txn
        block.miner = event.miner
        block.hash = event.hash
        block.timestamp = event.timestamp
      }
    }
    // event: { id, slot, state, timestamp, txn, miner, hash }
    // block: { id, slot, state, timestamp, $key, $hide }
    const handleShardBlockFinalizedEvent = (event) => {
      // 处理区块敲定事件
      if (!currentPageShards.includes(event.shard)) return
      const blocks = shardChains.find((chain) => chain[0].shard === event.shard)
      const block = blocks.find((b) => b.slot === event.slot)
      if (block) {
        block.state = event.state
        block.txn = event.txn
        block.miner = event.miner
        block.hash = event.hash
        block.timestamp = event.timestamp
        // TODO: 敲定事件会有区块的完整信息
      }
    }

    const filterBlockchain = ({ start, end }) => {
      allPageShards.splice(0, allPageShards.length, ...range(start, end + 1))
      currentPage.value = 1
      filterShardChainNum.value = allPageShards.length
    }

    const mockSlot = () => {
      // mock 12s 区块一轮生命周期循环
      // shard blockchain
      const slot = timeBeaconChain[timeBeaconChain.length - 1].slot + 1
      currentPageShards.forEach((shard) => {
        setTimeout(
          () =>
            handleShardBlockCollectEvent({
              number: slot,
              slot,
              shard,
              state: 'collect',
              timestamp: Date.now(),
            }),
          0
        )
        setTimeout(
          () =>
            handleShardBlockAttestEvent({
              number: slot,
              slot,
              shard,
              state: 'attest',
              timestamp: Date.now(),
            }),
          5000
        )
        const txn = random(1000)
        const miner = '0x000000000000000000000000000000'
        const hash = '0x0000000000000000000000000'
        setTimeout(
          () =>
            handleShardBlockUnfinalizedEvent({
              number: slot,
              slot,
              shard,
              state: 'unfinalized',
              txn,
              miner,
              hash,
              timestamp: Date.now(),
            }),
          8000
        )
        setTimeout(
          () =>
            handleShardBlockFinalizedEvent({
              number: slot,
              slot,
              shard,
              state: 'finalized',
              txn,
              miner,
              hash,
              timestamp: Date.now(),
            }),
          10000
        )
      })
      // time beacon blockchain
      setTimeout(
        () =>
          handleBeaconBlockCollectEvent({
            number: slot,
            slot,
            state: 'collect',
            timestamp: Date.now(),
          }),
        0
      )
      setTimeout(
        () =>
          handleBeaconBlockFinalizedEvent({
            number: slot,
            slot,
            txn: random(500),
            tbs: 229,
            state: 'finalized',
            timestamp: Date.now(),
          }),
        10500
      )
    }

    const gotoCockpit = () => {
      router.push({ name: 'benchmark' })
    }

    onMounted(async () => {
      watch(pageSize, () => {
        currentPage.value = 1
      })
      // 同步最新那几块block数据
      watchEffect(async (onInvalidate) => {
        loading.value = true
        currentPageShards.splice(
          0,
          currentPageShards.length,
          ...allPageShards.slice(
            (currentPage.value - 1) * pageSize.value,
            currentPage.value * pageSize.value
          )
        )
        await Promise.all([
          syncLatestShardBlocks(currentPageShards),
          syncLatestBeaconBlocks(),
        ])
        loading.value = false
        // processing slot
        mockSlot()
        const timer1 = setInterval(() => {
          mockSlot()
        }, 12000)
        const time = Date.now()
        const timer2 = setInterval(() => {
          const t = (Date.now() - time) % 12000
          percent.value = 0.00833333333333333 * t
        }, 50)
        onInvalidate(() => {
          clearInterval(timer1)
          clearInterval(timer2)
        })
      })
    })

    function gotoBlockList(type, index) {
      router.push({
        name: 'explorer-block-list',
        query: {
          type,
          index,
        },
      })
    }

    return {
      currentPage,
      pageSize,
      timeBeaconChain,
      shardChains,
      percent,
      shardChainNum,
      filterShardChainNum,
      filterBlockchain,
      loading,
      gotoCockpit,
      configVisible,
      gotoBlockList,
    }
  },
})
</script>

<style scoped lang="scss">
.blockchain-page-container {
  position: relative;
  overflow: auto;
  height: 100%;
}

.blockchain-page-content {
  position: relative;
  top: 156px;
  padding-bottom: 77px;
}

.blockchain-overview-container {
  width: 1320px;
  height: fit-content;
  background: #3a3d4c;
  border-radius: 8px;
  margin: 0 auto;
  padding: 10px 0 14px 0;
  &:first-child {
    margin-bottom: 40px;
  }
  .blockchain-overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 100px 12px 110px;
    .blockchain-title {
      height: 28px;
      font-size: 20px;
      font-weight: 600;
      text-align: left;
      color: #ffffff;
      line-height: 28px;
    }
    .blockchain-interface {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .blockchain-filter {
      height: 22px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      line-height: 22px;
      display: flex;
      width: 64px;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
  }
  .blockchain-overview-content {
    padding-right: 90px;
    .blockchain-item {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .blockchain-info {
        width: 76px;
        height: 22px;
        font-size: 16px;
        text-align: right;
        color: #ffffff;
        line-height: 22px;
      }
      .blockchain-detail {
        position: relative;
        width: 1100px;
        height: 144px;
        overflow: hidden;
        .left-fade-mask {
          position: absolute;
          width: 60px;
          top: 0;
          bottom: 0;
          left: -9px;
          background: linear-gradient(
            90deg,
            #3a3d4c 40%,
            rgba(58, 61, 76, 0) 94%
          );
        }
        .right-fade-mask {
          position: absolute;
          width: 20px;
          top: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(
            -90deg,
            #3a3d4c 40%,
            rgba(58, 61, 76, 0) 94%
          );
        }
        .chain {
          transform: translate(-220px, 10px);
        }
        .blockchain-linkline {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          height: 4px;
          opacity: 0.1;
          background: #ffffff;
        }
      }
      .blockchain-more {
        .blocklist-btn {
          width: 40px;
          height: 124px;
          background: #4e505e;
          border-radius: 0px 4px 4px 0px;
          color: white;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &:hover {
            background: #616470;
          }
          &:active {
            background: #757781;
          }
        }
      }
    }
  }
  .blockchain-overview-footer {
    display: flex;
    justify-content: flex-end;
    padding-right: 82px;
    padding-top: 20px;
    margin-bottom: 46px;
  }
}
</style>
