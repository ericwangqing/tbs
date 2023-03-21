<template lang="pug">
.cockpit(:class="{ burning: controller.tps >= 100000 }")
  StarField
  RoadLine
  .footer-shadow
  .fireworks-container(ref="fireworksContainer")
  InstrumentPanel
  RoadMap.road-map-container
  ConfigPop(@playback="handlePlayback", @execute="handleExecute")
  FinishModal(@playback="handlePlayback")
  BenchmarkHeader.benchmark-header(category="cockpit", @change-category="gotoChain")
  Countdown(v-if="toStart")
</template>

<script>
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import RoadLine from './components/road-line.vue'
import StarField from './components/star-field.vue'
import InstrumentPanel from './components/instrument-panel.vue'
import ConfigPop from './components/config-popup.vue'
import RoadMap from './components/road-map.vue'
import Countdown from './components/count-down.vue'
import FinishModal from './components/finish-modal.vue'
import { controller } from './composition/controller.js'
import { Fireworks } from './composition/firework'

export default defineComponent({
  name: 'Cockpit',
  components: {
    RoadLine,
    StarField,
    InstrumentPanel,
    RoadMap,
    ConfigPop,
    Countdown,
    FinishModal
  },
  setup: () => {
    let presetProgress = ''
    let timeout = null
    const fireworksContainer = ref(null)
    let fireworks
    const router = useRouter()
    const toStart = ref(false)

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
      if (fireworks) fireworks.dispose()
    })

    onMounted(() => {
      fireworks = new Fireworks(fireworksContainer.value)
      if (controller.completed) fireworks.start()
    })

    watch(() => controller.completed, (val) => {
      if (val) fireworks.start()
      else fireworks?.stop()
    })

    const gotoChain = () => {
      router.push({ name: 'blockchain' })
    }

    const handlePlayback = (id) => {
      // TODO not execute, playback the results, and speedup playback.
      handleExecute()
    }

    const handleExecute = (id) => {
      toStart.value = true
      setTimeout(() => {
        toStart.value = false
        controller.startOrStop()
      }, 5200);
    }

    return {
      controller,
      fireworksContainer,
      toStart,
      gotoChain,
      handlePlayback,
      handleExecute
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/theme/mixin.scss';
.cockpit {
  width: 100%;
  height: 100%;
  position: relative;
  background: #212435;
  overflow: hidden;
  &.burning {
    background: radial-gradient(#212435, #212435, #3e2929);
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
    right: 35px;
  }
  .fireworks-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
