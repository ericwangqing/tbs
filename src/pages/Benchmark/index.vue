<template lang="pug">
.cockpit(@mousedown="isFast = true", @mouseup="isFast = false")
  StarField(:isFast="isFast")
  RoadLine(:isFast="isFast")
  InstrumentPanel(:isFast="isFast")
  RoadMap(:percent="percent")
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import RoadLine from './components/road-line.vue'
import StarField from './components/star-field.vue'
import InstrumentPanel from './components/instrument-panel.vue'
import RoadMap from './components/road-map.vue'

export default defineComponent({
  name: 'Cockpit',
  components: {
    RoadLine,
    StarField,
    InstrumentPanel,
    RoadMap
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
      percent
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
  .footer-shadow {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 90px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.00),  rgba(0, 0, 0, 0.45));
  }
}
</style>
  
