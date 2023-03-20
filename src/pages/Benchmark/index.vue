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
  StarField
  RoadLine
  .footer-shadow
  InstrumentPanel
  RoadMap.road-map-container(@configShow="configVisible = true")
  ConfigPop(v-if="configVisible", @configHide="configVisible = false")
</template>

<script>
import { defineComponent, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import RoadLine from './components/road-line.vue'
import StarField from './components/star-field.vue'
import InstrumentPanel from './components/instrument-panel.vue'
import ConfigPop from './components/config-popup.vue'
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
    ConfigPop,
    ScannedBox
  },
  setup: () => {
    let presetProgress = ''
    let timeout = null
    const configVisible = ref(false)

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
      controller,
      configVisible
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
    top: 22px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    width: min-content;
    background: linear-gradient(180deg,rgba(0,0,0,0.50), rgba(0,0,0,0.20));
    border-radius: 4px;
    &-ceil {
      padding: 16px 66px 13px;
      position: relative;
      &__label {
        color: #fff;
        white-space: nowrap;
        font-size: 20px;
        line-height: 23px;
      }
      &__num {
        color: #FFA900;
        font-size: 34px;
        font-weight: bold;
        line-height: 39px;
      }
      &:not(&:last-child)::after {
        content: '';
        height: 62px;
        width: 1px;
        background: #d0d0d0;
        position: absolute;
        right: 0;
        top: 12px;
      }
      &:first-child {
        padding-left: 50px;
      }
      &:last-child {
        padding-right: 50px;
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
    top: 22px;
    right: 20px;
  }
}
</style>
  
