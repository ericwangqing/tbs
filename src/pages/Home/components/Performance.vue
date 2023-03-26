<template lang="pug">
.performance-chart-wrapper
  .performance-chart-container(ref="performanceContainerRef")
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import controller from "../composition/controller.js"

export default defineComponent({
name: 'Performance',
  props: {
    config: {
      type: Object
    }
  },
setup: (props) => {
  const performanceContainerRef = ref(null)
  let performanceChart

  const generateOption = (startAttackSimulate) => {
    const series = [
      { name: 'In_all', type: 'line', symbol: 'none', data: [{ name: 'init1', value: [new Date().toString(), 0] }] },
      { name: 'Out_all', type: 'line', symbol: 'none', data: [{ name: 'init2', value: [new Date().toString(), 0] }] }
    ];
    const legend = ['In_all', 'Out_all']

    if (startAttackSimulate) {
      legend.push('In_forge', 'Out_forge')
      series.push({ name: 'In_forge', type: 'line', symbol: 'none', data: [] });
      series.push({ name: 'Out_forge', type: 'line', symbol: 'none', data: [] });
    }
    return {
      title: {
        text: 'Network performance',
        // subtext: subTitleText.value.join('\n'),
        left: '2.5%',
        top: '4.6%',
        textStyle: {
          color: '#ffffff',
          fontSize: 30,
          fontFamily: 'PangMenZhengDaoBiao, Arial, Arial-Regular'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: legend,
        top: '14%',
        left: '2.2%',
        textStyle: {
          color: '#8C8C8C'
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#92949c'
        },
        axisLine: {
          lineStyle: {
            color: '#92949c'
          }
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '60%'],
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#92949c'
        },
      },
      grid: {
        left: '12%',
        top: '25%',
        right: '3%'
      },
      color: ['rgb(60,123,253)', 'rgb(90, 216, 166)', 'rgb(232,104,74)', 'rgb(246,189,22)'],
      series
    }
  }
  const initPerformance = () => {
    const performanceChart = echarts.init(performanceContainerRef.value)
    performanceChart.setOption(generateOption(true))
    return performanceChart
  }

  watch(() => props.config.startAttackSimulate, () => {
    controller.withAttacker = props.config.startAttackSimulate
    controller.performanceWithAttackerChartInboundData = []
    controller.performanceWithAttackerChartOutboundData = []
    performanceChart.clear()
    performanceChart.setOption(generateOption(props.config.startAttackSimulate))
  })

  onMounted(async () => {
    setTimeout(() => {
      performanceChart = initPerformance()
      controller.initChart({ performanceChart, withAttacker: props.config.startAttackSimulate })
    }, 300)
  })

  return {
    performanceContainerRef,
    initPerformance
  }
}
})
</script>

<style lang="scss">
.performance-chart-wrapper {
  position: relative;
  border-radius: 4px;
  .performance-chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
