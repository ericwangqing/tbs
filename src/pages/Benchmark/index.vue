<template lang="pug">
.cockpit(:class="{ burning: controller.tps >= 100000 }")
  StarField
  RoadLine
  .footer-shadow
  .fireworks-container(ref="fireworksContainer")
  InstrumentPanel
  RoadMap.road-map-container(@configShow="configVisible = true")
  ConfigPop(v-if="configVisible", @configHide="configVisible = false")
  .finish-modal(v-if="controller.completed") {{controller.testData.name}} finished!
  BenchmarkHeader.benchmark-header(category="cockpit", @change-category="gotoChain")
</template>

<script>
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import RoadLine from './components/road-line.vue'
import StarField from './components/star-field.vue'
import InstrumentPanel from './components/instrument-panel.vue'
import ConfigPop from './components/config-popup.vue'
import RoadMap from './components/road-map.vue'
import BenchmarkHeader from '@/components/BenchmarkHeader.vue'
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
    BenchmarkHeader
  },
  setup: () => {
    let presetProgress = ''
    let timeout = null
    const configVisible = ref(false)
    const fireworksContainer = ref(null)
    let fireworks
    const router = useRouter()

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

    return {
      controller,
      configVisible,
      fireworksContainer,
      gotoChain
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
    top: 35px;
    right: 35px;
  }
  .fireworks-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .finish-modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: min-content;
    height: min-content;
    padding: 24px 80px;
    font-size: 40px;
    white-space: nowrap;
    background: linear-gradient(180deg,rgba(0,0,0,0.50), rgba(0,0,0,0.20));
    border-radius: 12px;
    border: #000;
    color: #fff;
    transform: translateY(-140px);
  }
}
</style>
