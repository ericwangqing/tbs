<template lang="pug">
.config-card(:key="data.id" :class="{ running: data.isRunning, selected: data && data.id === selectedId }" @click="handleClick")
  .config-card--border
  .config-card--bg
  .config-card--mask
  .config-card--content
    .config-card--content-header
      .config-card--title {{ data.name }}
      .config-card--dataset {{ data.dataset.name }}
      .config-card--delete
    .config-card--content-main
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
    .delete-btn(@click="handleDelete")
      i.iconfont.icon-shanchu
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
    const handleDelete = () => {
      emit('delete')
    }
    return {
      formatNumWithUnit,
      thousands,
      formatTime,
      formatTimeRange,
      formatDayTimeWithUnit,
      handleClick,
      handleDelete
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/theme/mixin.scss';

$--config-card-width: 840px;
$--config-card-height: 290px;
$--config-card-border-width: 2;
$--config-card-border-radius: 8;
$--config-card-bg: rgb(97, 99, 110);
$--config-card-selected-border-color: linear-gradient(90deg, #FFCB00, #F08B00);
$--config-card-executing-bg: linear-gradient(90deg, #FFCB00, #F08B00);
$--config-card-hover-mask: rgba(#fff, 0.1);

.config-card {
  @include linearGradientRadiusBorder($--config-card-width, $--config-card-height, $--config-card-border-width, $--config-card-border-radius, $--config-card-bg, $--config-card-bg);
  margin-bottom: 33px;
  &--content {
    padding: 36px 26px 23px;
    cursor: pointer;
    box-sizing: border-box;
    outline: transparent 2px solid;
    &-header {
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
    &-main {
      display: flex;
      align-items: flex-start;
      font-size: 24px;
      justify-content: space-between;
    }
    .delete-btn {
      position: absolute;
      top: 20px;
      right: 25px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      i {
        font-size: 24px;
        line-height: 24px;
        color: rgba(#fff, 0.3);
      }
    }
  }
  &.running:not(.selected) {
    .config-card--border {
      background: $--config-card-executing-bg;
    }
    .config-card--bg {
      background: transparent;
    }
  }
  &.selected {
    .config-card--border {
      background: $--config-card-selected-border-color;
    }
  }
  &.running.selected {
    .config-card--bg {
      background: $--config-card-executing-bg;
      border: none;
    }
  }
  &:hover .config-card--mask {
    background: $--config-card-hover-mask;
  }
  &:hover.selected .config-card--mask {
    @include basicCard($--config-card-width, $--config-card-height, 0, $--config-card-border-radius, $--config-card-hover-mask);
  }
}
</style>
