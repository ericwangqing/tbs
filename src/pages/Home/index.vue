<template lang="pug">
.home
  BasicInfoCard(:class="{ left: chartVisible } ", :chainHeight="config.chainHeight", :totalTransactions="config.totalTransactions")
  WorldMap
  Charts

</template>

<script>
import { defineComponent, ref } from 'vue'
import BasicInfoCard from './components/BasicInfoCard.vue'
import WorldMap from './components/WorldMap.vue'
import Charts from './components/Charts.vue'

export default defineComponent({
  name: 'Home',
  components: {
    BasicInfoCard,
    WorldMap,
    Charts
  },
  setup: () => {
    const chartVisible = ref(false)
    const config = ref({
      tps: 15,
      chainHeight: 181311,
      totalTransactions: 103123414,
      playing: true
    })

    setInterval(() => {
      if(config.value.playing) {
        config.value.chainHeight += config.value.tps / (40 + 10 * Math.random())
        config.value.totalTransactions += config.value.tps
      }
    }, 1000)

    return {
      config,
      chartVisible
    }
  },
})
</script>

<style scoped lang="scss">
.home {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px 20px 40px 30px;
}
</style>