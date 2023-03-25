<template lang="pug">
.config-form
  AForm(layout="vertical")
    AFormItem(label="Name")
      AInput.w-760px(size="large" v-model:value="data.name" @dblclick="addDblEvent" placeholder="name of the testcase")
  AForm(layout="vertical")
    AFormItem.w-350px(label="Time beacon chain")
      ASelect(size="large" :options="beaconChainOptions" v-model:value="data.timeBeaconChain" dropdownClassName="ant-select-dropdown-lg" placeholder="beacon chain to run testcase")
    AFormItem.w-350px(label="Data source")
      ASelect(size="large" :options="dataSourceOptions" v-model:value="data.dataset.name" dropdownClassName="ant-select-dropdown-lg" disabled)
    AFormItem(label="Data range")
      ARangePicker.w-344px(size="large" dropdownClassName="ant-picker-dropdown-large" v-model:value="dateRange")
  .tx-count(v-if="(txnLoading || data.dataset?.txCount)")
    span Transaction volume:
    span(v-if="data.dataset.txCount || data.dataset.txCount === 0") {{ formatNumWithUnit(data.dataset.txCount) }}
    ASpin(v-else)
  .divide-line
  AForm(layout="vertical")
    AFormItem(label="Shards")
      AInputNumber.w-350px(size="large" v-model:value="data.shards" @blur="calcNodes" placeholder="num of shards, e.g. 250")
    AFormItem(label="Node Scale")
      AInputNumber.w-350px(size="large" :formatter="thousands" v-model:value="data.nodeScale" @blur="calcNodes" placeholder="node scale in each shard, e.g. 200")
  AForm(layout="vertical")
    AFormItem(label="Expect Throughput")
      AInputNumber.w-350px(size="large" addon-after="TPS" :formatter="thousands" v-model:value="tps")
    AFormItem(label="Expect Latency In Shard(ms)")
      AInputNumber.w-350px(size="large" addon-after="ms" :formatter="thousands" v-model:value="latencyIn")
    AFormItem(label="Expect Latency Between Shard")
      AInputNumber.w-350px(size="large" addon-after="ms" :formatter="thousands" v-model:value="latencyBetween")
  .estimated-time(v-if="estimatedTime")
    span Estimated time:
    span {{estimatedTime}}
</template>

<script>
import { computed, defineComponent, ref, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import { thousands, formatTime, formatNumWithUnit } from '../composition/util.js'

const dataSourceOptions = [{ key: 'ETH', value: 'ETH' }]
const beaconChainOptions = [{ key: 'Polygon', value: 'Polygon' }, { key: 'Gnosis', value: 'Gnosis' }, { key: 'Polybase', value: 'Polybase' }]

export default defineComponent({
  name: 'ConfigForm',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup: (props, { emit }) => {
    const txnLoading = ref(false)
    const dateRange = ref(props.data?.dataset?.timeRange ? [dayjs(props.data.dataset.timeRange[0]), dayjs(props.data.dataset.timeRange[1])] : null)
    const quickFillForm = ref(false)
    const tps = ref(null)
    const latencyIn = ref(null)
    const latencyBetween = ref(null)

    watch(() => props.data, () => {
      if (!props.data.dataset) {
        props.data.dataset = {}
      }
      if (!props.data.dataset.name) props.data.dataset.name = 'ETH'
    }, { immediate: true, deep: true })

    watch(() => dateRange.value, () => {
      if (!props.data.dataset) {
        props.data.dataset = {}
      }
      props.data.dataset.timeRange = [
        dateRange.value[0].set('hour', 0).set('minute', 0).set('second', 0).valueOf(),
        dateRange.value[1].set('hour', 23).set('minute', 59).set('second', 59).valueOf()
      ]
      txnLoading.value = true
      // TODO get request, how many txn in range.
      setTimeout(() => {
        txnLoading.value = false
        // props.data.dataset.txCount = 100000000000
      }, 1000)
    }, { deep: true })

    const estimatedTime = computed(() => {
      if (!props.data.dataset || !props.data.dataset.txCount) return ''
      if (!props.data.shards) return ''
      return formatTime(Math.floor(props.data.dataset.txCount / props.data.shards / 30))
    })

    const addDblEvent = () => {
      if (!quickFillForm.value) return
      // create, give a default data to save presentation time
      props.data.name = 'Showcase in Scalling23'
      props.data.timeBeaconChain = 'Polygon'
      dateRange.value = [dayjs(1640966400932), dayjs(1641484800000)] // 1.1~1.7 2022

      txnLoading.value = true
      setTimeout(() => {
        txnLoading.value = false
        props.data.shards = 256
        props.data.nodeScale = 200
        props.data.dataset.txCount = 10000000
        calcNodes()
      }, 1000)
    }

    onMounted(() => {
      if (!props.data.name) quickFillForm.value = true
    })

    const calcNodes = () => {
      if (props.data.shards && props.data.nodeScale) {
        props.data.nodes = props.data.shards * props.data.nodeScale
        latencyBetween.value = 100
        latencyIn.value = 20
        tps.value = 100000
      }
    }

    return {
      dataSourceOptions,
      beaconChainOptions,
      dateRange,
      estimatedTime,
      txnLoading,
      tps,
      latencyIn,
      latencyBetween,
      calcNodes,
      addDblEvent,
      thousands,
      formatNumWithUnit
    }
  },
})
</script>

<style lang="scss" scoped>
.config-form {
  position: relative;
  border-top: 1px solid #5e606c;
  padding-top: 16px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 16px;
    background: linear-gradient(180deg, #3a3d4c 17%, rgba(58, 61, 76, 0.00));
  }
  .ant-form {
    display: flex;
    gap: 60px;
    margin: 0 40px;
    padding: 14px 30px;
    :deep label {
      font-size: 20px;
      color: #fff;
    }
  }
  .tx-count, .estimated-time {
    color: #FFAE00;
    margin: 0 70px 30px;
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .divide-line {
    width: 1720px;
    height: 1px;
    background: #5e606c;
    margin: 0 40px;
  }
}
</style>
