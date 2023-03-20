<template lang="pug">
.config-card-wrapper(:key="data.id")
  .config-card-border(:class="{ running: data.isRunning }")
  .config-card
    .config-card--header
      .config-card--title {{ data.name }}
      .config-card--dataset {{ data.dataset.name }}
      .config-card--delete
    .config-card--main
      AForm
        AFormItem(label="Dataset range")
          div {{ formatTimeRange(data.dataset.timeRange) }}
        AFormItem(label="Tx count")
          span(v-if="data.isRunning") {{ formatNumWithUnit(data.txn) }}
          span(v-if="data.isRunning")  / 
          span {{ formatNumWithUnit(data.dataset.txCount) }}
        AFormItem(label="Time used")
          div(v-if="data.isRunning")
            span {{ formatTime(data.timeCost) }}
            span   / 
            span {{ formatTime(data.dataset.estimated) }}
          span(v-else) {{ formatDayTimeWithUnit(data.timeCost) }}
        AFormItem(label="TPS")
          div {{ thousands(data.tps) }}
      AForm
        AFormItem(label="Shards/Nodes")
          span {{ data.shardCount }}
          span  / 
          span {{ data.nodeCount }}
        AFormItem(label="CPU")
          span {{ Math.floor(data.cpuUsed * 100) }}%
        AFormItem(label="Memory")
          span {{ data.memoryUsed }}MB
        AFormItem(label="Bandwidth")
          span {{ data.bandwidthUsed }}KB
</template>

<script>
import { defineComponent } from 'vue'
import { formatDayTimeWithUnit, formatTimeRange, formatTime, formatNumWithUnit, thousands } from '../composition/util'

export default defineComponent({
  name: 'ConfigCard',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup: () => {
    return {
      formatNumWithUnit,
      thousands,
      formatTime,
      formatTimeRange,
      formatDayTimeWithUnit
    }
  }
})
</script>

<style lang="scss" scoped>
.config-card-wrapper {
  position: relative;
  width: 840px;
  height: 290px;
  margin-bottom: 33px;
  // box-sizing: border-box;
  // overflow: auto;
  .config-card-border {
    width: 840px;
    height: 290px;
    background: rgb(97, 99, 110);
    border-radius: 8px;
    &.running {
      box-shadow: 0px 0px 16px 0px rgba(240, 139, 155, 0.50); 
      background: linear-gradient(180deg, #FFCB00, #F08B00);
    }
  }
}
.config-card {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 836px;
  height: 286px;
  padding: 36px 42px 23px 30px;
  background: rgb(97, 99, 110);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  box-sizing: border-box;
  outline: transparent 2px solid;
  z-index: 1;
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
}
</style>
