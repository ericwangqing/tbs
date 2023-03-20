<template lang="pug">
.config-popup
  .config-popup--mask
  .config-popup--wrapper
    .config-popup--wrapper-header
      span.title
        i Config
        span （
        i {{ configList.length }}
        span ）
      AInputSearch
    .config-popup--wrapper-main(ref="cardList", :class="{ needScroll: needScroll }")
      .config-card(v-for="item in configList", :key="item.id", :class="{ running: item.isRunning }")
        .config-card--header
          .config-card--title {{ item.name }}
          .config-card--dataset {{ item.dataset.name }}
          .config-card--delete
        .config-card--main
          AForm
            AFormItem(label="Dataset range")
              div {{ formatTimeRange(item.dataset.timeRange) }}
            AFormItem(label="Tx count")
              span(v-if="item.isRunning") {{ formatNumWithUnit(item.txn) }}
              span(v-if="item.isRunning")  / 
              span {{ formatNumWithUnit(item.dataset.txCount) }}
            AFormItem(label="Time used")
              div(v-if="item.isRunning")
                span {{ formatTime(item.timeCost) }}
                span   / 
                span {{ formatTime(item.dataset.estimated) }}
              span(v-else) {{ formatDayTimeWithUnit(item.timeCost) }}
            AFormItem(label="TPS")
              div {{ thousands(item.tps) }}
          AForm
            AFormItem(label="Shards/Nodes")
              span {{ item.shardCount }}
              span  / 
              span {{ item.nodeCount }}
            AFormItem(label="CPU")
              span {{ Math.floor(item.cpuUsed * 100) }}%
            AFormItem(label="Memory")
              span {{ item.memoryUsed }}MB
            AFormItem(label="Bandwidth")
              span {{ item.bandwidthUsed }}KB
  .config-popup--footer
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { formatDayTimeWithUnit, formatTimeRange, formatTime, formatNumWithUnit, thousands } from '../composition/util'

export default defineComponent({
  name: 'ConfigPopup',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup: () => {
    const cardList = ref(null)
    const configList = ref([
      {
        name: '持续展示',
        id: '1',
        isRunning: true,
        txn: 1000000,
        tps: 100000,
        dataset: {
          name: 'ETH',
          timeRange: [1640966400, 1672502399],
          txCount: 1000000000000,
          estimated: 64800 // seconds
        },
        timeCost: 1000,
        shardCount: 3,
        nodeCount: 30,
        cpuUsed: 0.05,
        memoryUsed: 286, // MB
        bandwidthUsed: 500 // KB, maybe TODO calc unit.
      },
      {
        name: '100K测试',
        id: '2',
        isRunning: false,
        txn: 1000000000000,
        tps: 100000,
        dataset: {
          name: 'ETH',
          timeRange: [1648742400, 1664553599],
          txCount: 1000000000000,
          estimated: 64800 // seconds
        },
        timeCost: 1000,
        shardCount: 100,
        nodeCount: 1000,
        cpuUsed: 0.1,
        memoryUsed: 332, // MB
        bandwidthUsed: 450 // KB, maybe TODO calc unit.
      }
    ])
    for (let i = 3; i < 20; i++) {
      configList.value.push(Object.assign({}, JSON.parse(JSON.stringify(configList.value[1])), {id: `${i}`}))
    }

    const needScroll = computed(() => {
      if (!cardList.value) return false;
      return cardList.value.scrollHeight > cardList.value.clientHeight
    })

    return {
      cardList,
      configList,
      needScroll,
      formatNumWithUnit,
      thousands,
      formatTime,
      formatTimeRange,
      formatDayTimeWithUnit
    }
  },
})
</script>

<style lang="scss" scoped>
@keyframes floatOut {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.config-popup {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  color: #fff;
  &--mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(22, 24, 30, 0.80) 0%,  rgba(0, 0, 0, 0.95));
  }
  &--wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 1800px;
    height: calc(100vh - 130px);
    margin: 0 auto;
    background: #3a3d4c;
    border-radius: 8px;
    animation: floatOut 0.2s 1;
    transform-origin: right center;
    padding-bottom: 135px;
    display: flex;
    flex-direction: column;
    &-header {
      display: flex;
      justify-content: space-between;
      padding: 26px 40px;
      .title {
        font-size: 34px;
        line-height: 41px;
        font-weight: bold;
      }
      .ant-input-search {
        width: 340px;
      }
    }
    &-main {
      max-height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 40px;
      overflow-y: auto;
      &.needScroll {
        padding-right: 20px;
        margin-right: 8px;
      }
      &::-webkit-scrollbar {
        width: 12px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #4e505d;
      }
    }
    .config-card {
      position: relative;
      width: 840px;
      height: 290px;
      padding: 36px 42px 23px 30px;
      background: rgb(97, 99, 110);
      border: 2px solid transparent;
      border-radius: 8px;
      box-sizing: border-box;
      margin-bottom: 33px;
      cursor: pointer;
      &--header {
        display: flex;
        align-items: center;
        .config-card--title {
          font-size: 32px;
          font-weight: bold;
        }
        .config-card--dataset {
          font-size: 24px;
          margin-left: 20px;
          color: rgba(255, 255, 255, 0.5);
        }
      }
      &:deep label {
        color: #fff;
        font-size: 24px;
        width: 158px;
        margin-right: 12px;
        cursor: pointer;
      }
      &:deep .ant-form-item {
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: 0;
        font-size: 24px;
        line-height: 40px;
      }
      &--main {
        display: flex;
        align-items: flex-start;
        font-size: 24px;
        justify-content: space-between;
      }
      &.running {
        box-shadow: 0px 0px 16px 0px rgba(139, 247, 255, 0.50); 
        &::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          bottom: -2px;
          right: -2px;
          background: linear-gradient(180deg, #55f2fb, #0a95a2);
          border-radius: 8px;
        }
      }
    }
  }
  &--footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 135px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.00),  rgba(0, 0, 0, 0.80) 22%,  #000000 66%);
  }
}
</style>
