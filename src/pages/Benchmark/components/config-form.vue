<template lang="pug">
.config-form
  AForm(layout="vertical")
    AFormItem(label="Name")
      AInput.name-input(size="large")
  AForm(layout="vertical")
    AFormItem(label="Data source")
      ASelect()
    AFormItem(label="Data range")
      ARangePicker
  .tx-count
  .divide-line
  AForm(layout="vertical")
    AFormItem(label="Shards")
      AInputNumber()
    AFormItem(label="Node Scale")
      AInputNumber()
    AFormItem(label="Latency In Shard(ms)")
      AInputNumber()
    AFormItem(label="Latency Between Shard")
      AInputNumber()
    AFormItem(label="Throughput")
      AInputNumber()
  .estimated-time
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export default defineComponent({
  name: 'ConfigForm',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup: (props, { emit }) => {
    return {
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
    // :deep input, :deep .ant-select-selector {
    //   font-size: 18px;
    //   height: 50px;
    //   border-radius: 8px;
    //   width: 260px;
    //   background: transparent;
    //   border-color: rgba(255,255,255,0.45);
    //   border-radius: 8px;
    // }
    .name-input {
      width: 760px;
    }
  }
  .divide-line {
    width: 1720px;
    height: 1px;
    background: #5e606c;
    margin: 0 40px;
  }
}
</style>
