<template lang="pug">
.cockpit(@mousedown="isFast = true", @mouseup="isFast = false")
  ScannedBox.count-board
    .count-board-ceil
      .count-board-ceil__label TPS
      .count-board-ceil__num 100,008
    .count-board-ceil
      .count-board-ceil__label Total transactions
      .count-board-ceil__num 134,435,499
    .count-board-ceil
      .count-board-ceil__label W3 chain height
      .count-board-ceil__num 145,678
    .count-board-ceil
      .count-board-ceil__label Shards
      .count-board-ceil__num 229
    .count-board-ceil
      .count-board-ceil__label Nodes
      .count-board-ceil__num 109,293
  StarField(:isFast="isFast")
  RoadLine(:isFast="isFast")
  .footer-shadow
  InstrumentPanel(:isFast="isFast")
  RoadMap.road-map-container(:percent="percent")
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import RoadLine from './components/road-line.vue'
import StarField from './components/star-field.vue'
import InstrumentPanel from './components/instrument-panel.vue'
import RoadMap from './components/road-map.vue'
import ScannedBox from '@/components/ScannedBox.vue'
import { thousands } from './composition/util.js'

export default defineComponent({
  name: 'Cockpit',
  components: {
    RoadLine,
    StarField,
    InstrumentPanel,
    RoadMap,
    ScannedBox
  },
  setup: () => {
    const isFast = ref(false)
    const percent = ref(0)
    let trigger = 0
    onMounted(() => {
      setInterval(() => {
        let judge = isFast.value ? 1 : 25
        if (trigger % judge === 0) percent.value += 0.5
        if (percent.value >= 100) percent.value = 0
        trigger++
      }, 16)
    })
    return {
      isFast,
      percent,
      thousands
    }
  }
})
</script>

<style lang="scss" scoped>
.cockpit {
  width: 100%;
  height: 100%;
  position: relative;
  background: #212435;
  .count-board {
    position: absolute;
    top: 45px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    width: min-content;
    background: linear-gradient(180deg,rgba(0,0,0,0.50), rgba(0,0,0,0.20));
    border-radius: 4px;
    &-ceil {
      padding: 16px 66px;
      position: relative;
      &__label {
        color: #fff;
        white-space: nowrap;
        font-size: 20px;
      }
      &__num {
        color: #FFA900;
        font-size: 34px;
        font-weight: bold;
        margin-top: -10px;
      }
      &:not(&:last-child)::after {
        content: '';
        height: 62px;
        width: 1px;
        background: #d0d0d0;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      &:first-child, &:last-child {
        padding: 16px 50px;
      }
    }
  }
  .footer-shadow {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 90px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.00),  rgba(0, 0, 0, 0.45));
  }
  .road-map-container {
    position: absolute;
    top: 45px;
    right: 45px;
  }
}
</style>
  
