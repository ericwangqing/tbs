<template lang="pug">
.config-popup
  .config-popup--header
    span Config（{{ data.length }}）
    AInputSearch
  .config-popup--main
    .config-card(v-for="item in data", :key="item.id")
      .config-card--header
        .config-card--title
        .config-card--delete
      .config-card--main
        AForm
          AFormItem(label="Dataset")
            div {{ item.dataset.name }}
            div {{ formatTimeRange(item.dataset.timeRange) }}
          AFormItem(label="Tx count")
            span(v-if="item.isRunning") {{ item.txn }}
            span(v-if="item.isRunning") /
            span {{ item.dataset.txCount }}
          AFormItem(label="Time used")
            span(v-if="item.isRunning") {{ formatTime(item.timeCost) }}
            span(v-if="item.isRunning") /
  .config-popup--footer
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'ConfigPopup',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup: () => {
    return {
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
