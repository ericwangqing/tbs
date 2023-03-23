<template lang="pug">
.blockchain-page-container
  BenchmarkHeader.benchmark-header(category="chain" @change-category="gotoCockpit")
  ConfigPop(@playback="gotoCockpit", @execute="gotoCockpit")
  .blockchain-page-content
    .blockchain-overview-container
      .blockchain-overview-header
        .blockchain-title Time Beacon Chain
        a-progress(v-if="!tbLoading" type="circle" :percent="percent" :width="20" :strokeWidth="10" :format="() => ''" strokeColor="#ffffff" trailColor="#373948")
      .blockchain-overview-content
        .blockchain-item
          .blockchain-info
            span(v-if="!tbLoading") ETH
          .blockchain-detail
            BlockchainSkeleton(v-if="tbLoading")
            Blockchain(v-else :blocks="controller.visibleLatestTbBlocks")
            .left-fade-mask
            .right-fade-mask
          .blockchain-more
            .blocklist-btn(@click="gotoBlockList('beacon')")
              EllipsisOutlined
    .blockchain-overview-container
      .blockchain-overview-header
        .blockchain-title
          span Sharding Chain&nbsp
          span(v-if="!shardLoading") ({{filterShardChainNum}})
        .blockchain-interface(v-if="!shardLoading")
          RangeSelector(:min="0" :max="controller.shards - 1" @confirm="filterBlockchain" style="margin-right: 30px")
          a-progress(type="circle" :percent="percent" :width="20" :strokeWidth="10" :format="() => ''" strokeColor="#ffffff" trailColor="#373948")
      .blockchain-overview-content
        .blockchain-item(v-for="i in [0, 1, 2, 3, 4]" :key="i" v-if="shardLoading")
          .blockchain-info
          .blockchain-detail
            BlockchainSkeleton
            .left-fade-mask
            .right-fade-mask
          .blockchain-more
            .blocklist-btn
              EllipsisOutlined
        .blockchain-item(v-for="(blockchain) in controller.visibleLatestShardBlocks" :key="blockchain[0].shard" v-else)
          .blockchain-info S-{{`${blockchain[0].shard}`.padStart(3, '0')}}
          .blockchain-detail
            Blockchain(:blocks="blockchain")
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
  watchEffect, computed,
} from 'vue'
import { useRouter } from 'vue-router'
import Blockchain from './components/blockchain.vue'
import RangeSelector from './components/range-selector.vue'
import BlockchainSkeleton from './components/blockchain-skeleton.vue'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import ConfigPop from '@/pages/Benchmark/components/config-popup.vue'
import { controller } from '@/pages/Benchmark/composition/controller.js'
import { range } from 'lodash'
import {useSlotProcess} from "./composition/util.js";

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
    const percent = useSlotProcess(controller) // slot 进度条
    const pageSize = ref(5) // 每页显示的分片链数量
    const currentPage = ref(1) // 当前页码
    const filterShardChainNum = ref(controller.shards) // 分页显示的分片链数量
    const filterShards = reactive(range(controller.shards)) // 过滤后的分片链序号
    const tbLoading = computed(() => !controller.visibleLatestTbBlocks.length)
    const shardLoading = computed(() => !controller.visibleLatestShardBlocks.length || !controller.visibleLatestShardBlocks.every(b => b?.[0]))
    const router = useRouter()
    const configVisible = ref(true)

    const filterBlockchain = ({ start, end }) => {
      filterShards.splice(0, filterShards.length, ...range(start, end + 1))
      currentPage.value = 1
      filterShardChainNum.value = filterShards.length
    }
    const gotoCockpit = () => {
      router.push({ name: 'benchmark' })
    }

    onMounted(async () => {
      watch(pageSize, () => {
        currentPage.value = 1
      })

      watchEffect(() => {
        // 计算出当前页面的分片链序号
        const currentPageShards = filterShards.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
        controller.setVisibleShards({key: currentPageShards})
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
      percent,
      filterShardChainNum,
      filterBlockchain,
      tbLoading,
      shardLoading,
      gotoCockpit,
      configVisible,
      gotoBlockList,
      controller
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
