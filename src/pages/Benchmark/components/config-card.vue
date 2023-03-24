<template lang="pug">
.config-card(:key="data.id" :class="{ running: isRunning, selected: data && data.id === selectedId }" @click="handleClick")
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
          template(v-if="isRunning")
            span {{ formatNumWithUnit(controller.txCount) }}
            span  / 
          span {{ formatNumWithUnit(data.dataset.txCount) }}
        AFormItem(label="Time used")
          span(v-if="isExecuting") {{ formattedTimeCost }}
          div(v-else-if="isPlayback")
            span {{ formattedTimeCost }}
            span  / 
            span {{ formatTime(data.result.timeUsed) }}
          span(v-else-if="data.result") {{ formatDayTimeWithUnit(data.result.timeUsed) }}
          
        AFormItem(label="TPS")
          div(v-if="isRunning") {{ thousands(controller.tps) }}
          div(v-else-if="data.result") {{ thousands(data.dataset.txCount / data.result.timeUsed) }}
      AForm
        AFormItem(label="Shards/Nodes")
          span {{ data.shards }}
          span  / 
          span {{ data.nodes }}
        AFormItem(label="CPU")
          span {{ cpuData }}
        AFormItem(label="Memory")
          span {{ memoryData }}
        AFormItem(label="Bandwidth")
          span {{ bandwidthData }}
    .delete-btn(@click="handleDelete")
      i.iconfont.icon-shanchu
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import { formatDayTimeWithUnit, formatTimeRange, formatTime, formatNumWithUnit, thousands } from '../composition/util'
import { controller } from '../composition/controller.js'

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

    const isRunning = computed(() => {
      if (!controller.testData) return false
      return props.data.id === controller.testData.id
    })

    const isPlayback = computed(() => {
      return isRunning.value && controller.mode === 'Playback'
    })

    const isExecuting = computed(() => {
      return isRunning.value && controller.mode === 'Executing'
    })

    const cpuData = computed(() => {
      if (!isRunning.value) return props.data.result ? props.data.result.cpu + '%' : ''
      const cpu = controller.resourceData.cpu.length ? Math.floor(controller.resourceData.cpu[controller.resourceData.cpu.length - 1].value[1]) : '-'
      return cpu + '%'
    })

    const memoryData = computed(() => {
      if (!isRunning.value) return props.data.result ? formatNumWithUnit(props.data.result.memory) + 'B' : ''
      // TODO in POC cockpit, memory is a percent data. Here is byte. How to transfer?
      const memory = controller.resourceData.memory[controller.resourceData.memory.length - 1]
      return '256MB'
    })

    const bandwidthData = computed(() => {
      if (!isRunning.value) return props.data.result ? formatNumWithUnit(props.data.result.bandwidth) + 'B' : ''
      // TODO in POC cockpit, bandwidth is a percent data. Here is byte. How to transfer?
      const bandwidth = controller.resourceData.bandwidth[controller.resourceData.bandwidth.length - 1]
      return '450KB'
    })

    const now = ref(0)
    let interval = null
    const addTime = () => {
      interval = setInterval(() => {
        now.value += 1
      }, 1000)
    }
    watch(() => controller.state, (val) => {
      if (val === 'running') addTime()
      else clearInterval(interval)
      if (val === 'stopped') now.value = 0
    })

    watch(() => controller.timeSpent, (val) => {
      if (val) {
        now.value = val
        clearInterval(interval)
        addTime()
      }
    })

    const formattedTimeCost = computed(() => {
      return formatTime(now.value)
    })

    return {
      isRunning,
      isPlayback,
      isExecuting,
      cpuData,
      memoryData,
      bandwidthData,
      controller,
      formattedTimeCost,
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
  &--content {
    padding: 36px 26px 23px;
    cursor: pointer;
    box-sizing: border-box;
    outline: transparent 2px solid;
    &-header {
      display: flex;
      align-items: center;
      line-height: 45px;
      margin-bottom: 26px;
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
      font-weight: bold;
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
  &.running {
    &:deep .ant-form-item, .config-card--dataset {
      color: rgba(0, 0, 0, 0.5);
    }
    color: #000;
    &:deep label {
      color: #000;
    }
  }
  &:hover .config-card--mask {
    background: $--config-card-hover-mask;
  }
  &:hover.selected .config-card--mask {
    @include basicCard($--config-card-width, $--config-card-height, 0, $--config-card-border-radius, $--config-card-hover-mask);
  }
  &:not(:nth-last-child(1), :nth-last-child(2):nth-child(2n+1)) {
    margin-bottom: 40px;
  }
}
</style>
