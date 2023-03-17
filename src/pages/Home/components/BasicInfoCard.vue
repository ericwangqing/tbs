<template lang="pug">
ScannedBox.basic-info
  .basic-info-label.mx-50px Chain height
  .basic-info-value.ml-20px {{ Math.round(chainHeight).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
  ADivider.basic-info-divider.mx-50px(type="vertical")
  .basic-info-label.mr-30px Total transactions
  .basic-info-value.ml-20px.mr-50px {{ Math.round(totalTransactions).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
</template>

<script>
import { defineComponent } from 'vue'
import ScannedBox from '@/components/ScannedBox.vue'

export default defineComponent({
  name: 'BasicInfoCard',
  components: {
    ScannedBox
  },
  props: {
    chainHeight: Number,
    totalTransactions: Number
  }
})
</script>

<style scoped lang="scss">
.basic-info {
  position: relative;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  &-label {
    font-size: 20px;
    color: #ffffff;
    font-weight: bold;
  }
  &-value {
    font-weight: bold;
    font-size: 34px;
    color: #ffa900;
  }
  &-divider {
    height: 75%;
    width: 1px;
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>