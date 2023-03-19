<template lang="pug">
.instrument-panel-container
  PerformanceChart.performance-chart(:isFast="isFast")
  .tps-gauge-wrapper
    .tps-gauge-content(xmlns="http://www.w3.org/1999/xhtml")
      .count {{formattedTps}}
      .tps TPS
      img.logo(:src="logo")
    GradientGauge.tps-gauge(:percent="percent")
  ResourceCharts.resource-charts-container
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import GradientGauge from './gradient-gauge.vue'
import PerformanceChart from './performance-chart.vue'
import ResourceCharts from './resource-charts.vue'
import logo from '@/assets/logo.svg'
import { thousands } from '../composition/util.js'

export default defineComponent({
  name: 'InstrumentPanel',
  props: {
    isFast: {
      type: Boolean,
      default: false
    }
  },
  components: {
    GradientGauge,
    PerformanceChart,
    ResourceCharts
  },
  setup: (props) => {
    const percent = ref(10)
    const tps = ref(100)
    let interval = ref(0)

    let stage = 0
    watch(() => props.isFast, (val) => {
      if (interval.value) clearInterval(interval.value)
      interval.value = setInterval(() => {
        if ((percent.value > 90 && val) || (percent.value < 10 && !val)) {
          stage++
          if (stage % 50 !== 0) return
          const add = (Math.random() > 0.5 ? 1 : -1)
          percent.value += add * Math.floor(Math.random() * 3)
          if (val) {
            tps.value += Math.floor(Math.random() * 5000) * add
            tps.value = Math.max(Math.min(110000 + Math.floor(Math.random() * 3000), tps.value), 98000)
            percent.value = Math.max(Math.min(100, percent.value), 90)
          }
          else {
            tps.value += Math.floor(Math.random() * 5) * add
            tps.value = Math.max(Math.min(150, tps.value), 50)
            percent.value = Math.max(Math.min(15, percent.value), 5)
          }
        } else if (val) {
          percent.value += 4
          tps.value += Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1) + 5000
        } else {
          percent.value -= 6
          tps.value -= Math.floor(Math.random() * 2000) * (Math.random() > 0.5 ? 1 : -1) + 10000
          tps.value = Math.max(tps.value, Math.floor(Math.random() * 50) * (Math.random() > 0.5 ? 1 : -1) + 100)
        }
      }, 16);
    })

    const formattedTps = computed(() => thousands(tps.value))

    return {
      percent,
      logo,
      formattedTps
    }
  },
})
</script>

<style lang="scss" scoped>
.instrument-panel-container {
  position: absolute;
  bottom: 0;
  margin: auto;
  left: 0;
  right: 0;
  width: 1658px;
  height: 434px;
  background-image: url('@/assets/panel-bg.svg');
  // background-color: #fff;
  display: flex;
  justify-content: center;
  .tps-gauge-wrapper {
    margin-top: 23px;
    width: 356px;
    height: 356px;
    position: relative;
    .tps-gauge {
      position: absolute;
      top: 0;
      filter: drop-shadow(0px 0px 25px rgba(186, 219, 255, 0.5));
    }
    .tps-gauge-content {
      position: absolute;
      top: 34px;
      left: 34px;
      width: calc(100% - 68px);
      height: calc(100% - 68px);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 50%;
      display: flex;
      align-items: center;
      flex-direction: column;
      color: #fff;
      background: linear-gradient(180deg,#000000 24%, #313131);
      user-select: none;
      .count {
        margin-top: 79px;
        font-size: 60px;
        font-family: Helvetica, Helvetica-Regular;
        font-weight: 900;
        font-style: italic;
        line-height: 72px;
        text-shadow: 0px 6px 4px #0d2964;
      }
      .tps {
        font-size: 24px;
        font-family: PingFangSC, PingFangSC-Regular;
      }
      .logo {
        width: 80px;
        height: 55px;
        position: absolute;
        bottom: 24px;        
      }

    }
  }
  .performance-chart, .resource-charts-container {
    margin-top: 110px;
    width: 633px;
  }
}
</style>
