<template lang="pug">
.cockpit
  ScannedBox.count-board
    .count-board-ceil
      .count-board-ceil__label TPS
      .count-board-ceil__num {{ thousands(controller.tps) }}
    .count-board-ceil
      .count-board-ceil__label Total transactions
      .count-board-ceil__num {{ thousands(controller.txCount) }}
    .count-board-ceil
      .count-board-ceil__label W3 chain height
      .count-board-ceil__num {{ thousands(controller.blockHeight) }}
    .count-board-ceil
      .count-board-ceil__label Shards
      .count-board-ceil__num {{ thousands(controller.shards) }}
    .count-board-ceil
      .count-board-ceil__label Nodes
      .count-board-ceil__num {{ thousands(controller.nodes) }}
  StarField()
  RoadLine()
  .footer-shadow
  InstrumentPanel()
  RoadMap.road-map-container()
</template>

<script>
import { defineComponent, onBeforeMount, onBeforeUnmount } from 'vue'
import RoadLine from './components/road-line.vue'
import StarField from './components/star-field.vue'
import InstrumentPanel from './components/instrument-panel.vue'
import RoadMap from './components/road-map.vue'
import ScannedBox from '@/components/ScannedBox.vue'
import { thousands } from './composition/util.js'
import { controller } from './composition/controller.js'

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
    let presetProgress = ''
    let timeout = null
    
    const bindKeyEvent = ({key}) => {
      if (key === 'ArrowUp') controller.setSpeed(true)
      if (key === 'ArrowDown') controller.setSpeed(false)
      if (key === ' ') controller.startOrStop()
      if (/^\d$/.test(key)) {
        if (presetProgress) {
          controller.setProgress(Number(presetProgress + key))
          if(timeout) clearTimeout(timeout)
          presetProgress = ''
          timeout = null
        } else {
          timeout = setTimeout(() => {
            controller.setProgress(Number(key))
            presetProgress = ''
            timeout = null
          }, 500)
          presetProgress = key
        }
      }
    }

    onBeforeMount(() => {
      document.addEventListener('keydown', bindKeyEvent)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', bindKeyEvent)
    })

    return {
      thousands,
      controller
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
    right: 25px;
  }
}
</style>
  
