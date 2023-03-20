<template lang="pug">
.instrument-panel-container
  InstrumentPanelBg.instrument-panel-bg(:isBurning="tps >= 100000")
  PerformanceChart.performance-chart
  .tps-gauge-wrapper
    TpsGauge.tps-gauge(id="tpsGauge", :percent="percent", :percentChangeAnimate="false" :burning="tps >= 100000")
    .tps-gauge-content(xmlns="http://www.w3.org/1999/xhtml")
      .count {{formattedTps}}
      .tps TPS
      img.logo(:src="logo")
  ResourceCharts.resource-charts-container
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import TpsGauge from './tps-gauge.vue'
import PerformanceChart from './performance-chart.vue'
import ResourceCharts from './resource-charts.vue'
import InstrumentPanelBg from './instrument-panel-bg.vue'
import { thousands } from '../composition/util.js'
import { controller } from '../composition/controller'
import logo from '@/assets/logo.svg'
import panelImg from '@/assets/panel-bg.png'

export default defineComponent({
  name: 'InstrumentPanel',
  components: {
    TpsGauge,
    InstrumentPanelBg,
    PerformanceChart,
    ResourceCharts,
  },
  setup: () => {
    let interval = null
    const tps = ref(controller.tps)
    watch(
      () => controller.tps,
      () => {
        if (interval) {
          clearInterval(interval)
          interval = null
        } else {
          const diff = controller.tps - tps.value
          const diffEveryTime = Math.abs(diff) > 1000 ? Math.floor(diff / (diff > 0 ? 8 : 12)) : diff
          interval = setInterval(() => {
            if (diff > 0) {
              tps.value += diffEveryTime
              if (tps.value > controller.tps) tps.value = controller.tps
            } else if (diff < 0) {
              tps.value += diffEveryTime
              if (tps.value < controller.tps) tps.value = controller.tps
            }
            if (tps.value === controller.tps) {
              clearInterval(interval)
              interval = null
              return
            }
          }, 16) // set to 16, may cause render conflict, then change the value after 1 period. e.g., 10w -> 100, expect 1s, actually 10w -> 7w -> 100, 2s.
        }
      }
    )

    const formattedTps = computed(() => thousands(tps.value))
    const percent = computed(() => {
      if (tps.value < 100) return (tps.value / 100) * 10
      else if (tps.value < 1000) return ((tps.value - 100) / 1000) * 5 + 10
      else if (tps.value < 10000) return ((tps.value - 1000) / 10000) * 5 + 15
      else if (tps.value < 100000)
        return ((tps.value - 10000) / 100000) * 63 + 20
      else return Math.min(100, ((tps.value - 100000) / 30000) * 17 + 83)
    })

    return {
      percent,
      logo,
      formattedTps,
      tps,
      panelImg
    }
  },
})
</script>

<style lang="scss" scoped>
.instrument-panel-container {
  position: absolute;
  bottom: 12px;
  margin: auto;
  left: 0;
  right: 0;
  width: 1661px;
  height: 390px;
  z-index: 5;
  display: flex;
  justify-content: center;
  .instrument-panel-bg {
    position: absolute;
    top: 0;
    left: 0;
  }
  .tps-gauge-wrapper {
    margin-top: 30px;
    width: 356px;
    height: 356px;
    position: relative;
    .tps-gauge {
      position: absolute;
      top: 0;
    }
    .tps-gauge-content {
      position: absolute;
      top: 34px;
      left: 34px;
      width: calc(100% - 68px);
      height: calc(100% - 68px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      flex-direction: column;
      color: #fff;
      background: linear-gradient(180deg, #000000 24%, #313131);
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
    margin-top: 90px;
    width: 625px;
    z-index: 1;
  }
}
</style>
