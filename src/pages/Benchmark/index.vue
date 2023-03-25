<template lang="pug">
.cockpit(:class="{ burning: controller.tps >= controller.fastThreshold }")
  StarField
  RoadLine
  .footer-shadow
  .fireworks-container(ref="fireworksContainer")
  RoadMap.road-map-container
  BenchmarkHeader.benchmark-header(category="cockpit", @change-category="gotoChain")
  Countdown(v-if="controller.state === 'preparing'")
  InstrumentPanel
  .cockpit-play-controller(v-if="controller.state === 'pausing' || controller.state === 'running'" @click="pauseOrRun")
    i.iconfont.icon-play(v-if="controller.state === 'pausing'")
    i.iconfont.icon-stop(v-if="controller.state === 'running'")
  FinishModal(@playback="handlePlayback")
  ConfigPop(@playback="handlePlayback", @execute="handleExecute")

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
import { Fireworks } from './composition/firework'
import { controller } from './composition/controller.js'

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
    const currentTestId = ref('')

    const bindKeyEvent = ({key}) => {
      if (key === 'ArrowUp') controller?.setSpeed(true)
      if (key === 'ArrowDown') controller?.setSpeed(false)
      if (/^\d$/.test(key)) {
        if (presetProgress) {
          controller?.setProgress(Number(presetProgress + key))
          if(timeout) clearTimeout(timeout)
          presetProgress = ''
          timeout = null
        } else {
          timeout = setTimeout(() => {
            controller?.setProgress(Number(key))
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
      if (controller.state === 'completed') fireworks.start()
    })

    watch(() => controller.state, (val) => {
      if (val === 'completed') fireworks.start()
      else fireworks?.stop()
    })

    const gotoChain = () => {
      router.push({ name: 'blockchain' })
    }

    const handlePlayback = (id) => {
      controller.stop()
      if (id) currentTestId.value = id
      else controller.start('Playback', currentTestId.value)
    }

    const handleExecute = (id) => {
      if (id) currentTestId.value = id
    }

    const pauseOrRun = () => {
      if (controller.state === 'pausing') controller.resume()
      else controller.pause()
    }

    return {
      controller,
      fireworksContainer,
      gotoChain,
      handlePlayback,
      handleExecute,
      pauseOrRun
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

  .cockpit-play-controller {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 167px;
    height: 103px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &::after {
      content: '';
      position: fixed;
      bottom: 0;
      right: -20px;
      width: 175px;
      height: 110px;
      background: linear-gradient(90deg,rgba(0, 0, 0, 0.80) 45%, rgba(0, 0, 0, 0.00));
      transform: perspective(1rem) rotateX(2deg);
      border-radius: 8px 0px 0px 0px;
      z-index: -1;
      transition: box-shadow 0.3s ease-in-out;
    }
    i {
      color: #fff;
      font-size: 50px;
      transition: font-size 0.3s ease-in-out;
    }
    &:hover::after, &:active::after {
      box-shadow: 0px 0px 20px 0px rgba(179, 195, 255, 0.50);
    }
    &:hover {
      i {
        font-size: 56px;
      }
    }
    &:active {
      i {
        font-size: 36px;
      }
    }
  }
}
</style>
