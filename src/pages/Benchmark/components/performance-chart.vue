<template lang="pug">
.performance-chart(ref="performanceChart")
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { controller } from '../composition/controller.js'

export default defineComponent({
  name: 'PerformanceChart',
  setup: (props) => {
    const performanceChart = ref(null)
    let chart = null
    const performanceChartOutboundData = ref([])
    const performanceChartInboundData = ref([])

    const initChart = () => {
      chart = echarts.init(performanceChart.value)
      const series = [
        { name: 'In_all', type: 'line', symbol: 'none', data: [{ name: 'init1', value: [new Date().toString(), 0] }] },
        { name: 'Out_all', type: 'line', symbol: 'none', data: [{ name: 'init2', value: [new Date().toString(), 0] }] }
      ]
      const legend = ['In_all', 'Out_all']
      const option = {
        title: {
          text: 'Network Performance',
          right: '2.5%',
          top: '0',
          textStyle: {
            color: '#fff',
            fontWeight: 'bolder',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legend,
          top: '10%',
          right: '2.5%',
          selectedMode: false,
          icon: 'path://M 0 0 L 8 0 L 8 2 L 0 2 z',
          itemWidth: 8,
          itemGap: 12,
          textStyle: {
            color: '#8c8c8c'
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.45)'
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '60%'],
          splitLine: {
            show: false
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.45)'
          }
        },
        grid: {
          left: '12%',
          top: '20%',
          right: '3%',
          bottom: '10%'
        },
        color: ['#3c7bfd', '#5ad8a6', 'rgb(232,104,74)', 'rgb(246,189,22)'],
        series
      }
      chart.setOption(option)
    }

    const redraw = () => {
      if(!controller.running) return
      if (!chart) return
      const now = Date.now()
      const LINE_CHART_X_RANGE = 40 // datas in ${x}s per page

      const departureMessagesLastSec = controller.tps * controller.nodes
      const arrivalMessagesLastSec = Math.round(departureMessagesLastSec * (0.9 + Math.random() * 0.2))

      if (performanceChartOutboundData.value.length > LINE_CHART_X_RANGE)
        performanceChartOutboundData.value.shift()
      if (performanceChartInboundData.value.length > LINE_CHART_X_RANGE)
        performanceChartInboundData.value.shift()

      performanceChartOutboundData.value.push({ name: now.toString(), value: [new Date(), departureMessagesLastSec] })
      performanceChartInboundData.value.push({ name: now.toString(), value: [new Date(), arrivalMessagesLastSec] })

      const series = [
        { type: 'line', data: performanceChartInboundData.value },
        { type: 'line', data: performanceChartOutboundData.value },
      ];

      chart && chart.setOption({ series })
    }

    setInterval(() => {
      setTimeout(() => {
        redraw()
      }, 0)
    }, 1000)

    onMounted(() => {
      initChart()
    })
    return {
      performanceChart,
    }
  },
})
</script>

<style lang="scss" scoped>
.performance-chart {
  display: block;
  width: 633px;
  height: 305px;
}
</style>
