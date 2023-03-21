<template lang="pug">
.config-card-wrapper(:key="data.id" :class="{ running: data.isRunning, selected: data && data.id === selectedId }" @click="handleClick")
  .config-card-border
  .config-card-bg
  .config-card-hover-mask
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
    },
    selectedId: {
      type: String,
      default: ''
    }
  },
  setup: (props, { emit }) => {
    const handleClick = () => {
      emit('select')
    }
    return {
      formatNumWithUnit,
      thousands,
      formatTime,
      formatTimeRange,
      formatDayTimeWithUnit,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
@mixin cardSize($borderWidth) {
  position: absolute;
  top: #{$borderWidth}px;
  left: #{$borderWidth}px;
  width: calc(840px - #{$borderWidth}px - #{$borderWidth}px);
  height: calc(290px - #{$borderWidth}px - #{$borderWidth}px);
  border: solid transparent #{$borderWidth}px;
}

.config-card-wrapper {
  position: relative;
  width: 840px;
  height: 290px;
  margin-bottom: 33px;
  .config-card-border {
    @include cardSize(0);
    background: rgb(97, 99, 110);
    border-radius: 8px;
  }
  .config-card-bg {
    @include cardSize(2);
    background: rgb(97, 99, 110);
    border-radius: 8px;
  }
  .config-card-hover-mask {
    @include cardSize(0);
    border-radius: 8px;
  }
  .config-card {
    @include cardSize(0);
    padding: 36px 26px 23px;
    background: transparent;
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
      font-weight: bold;
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
  &.running {
    color: #000;
    .config-card--dataset, &:deep .ant-form-item {
      color: rgba(0, 0, 0, 0.5);
    }
    :deep label {
      color: #000;
    }
  }
  &.running:not(.selected) {
    .config-card-border {
      background: linear-gradient(90deg, #FFCB00, #F08B00);
    }
    .config-card-bg {
      background: transparent;
    }
  }
  &.selected {
    .config-card-border {
      background: linear-gradient(90deg, #FFCB00, #F08B00);
    }
  }
  &.running.selected {
    .config-card-bg {
      background: linear-gradient(90deg, #FFCB00, #F08B00);
      border: none;
    }
  }
  &:hover .config-card-hover-mask {
    background: rgba(#fff, 0.1);
  }
  &:hover.selected .config-card-hover-mask {
    @include cardSize(2);
  }
}
</style>
