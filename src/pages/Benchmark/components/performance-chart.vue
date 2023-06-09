<template lang="pug">
.performance-chart(ref="performanceChart")
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
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
          right: '2.75%',
          top: '1.9%',
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
          top: '11.5%',
          right: '3.1%',
          selectedMode: false,
          icon: 'path://M 0 0 L 8 0 L 8 2 L 0 2 z',
          itemWidth: 8,
          itemGap: 18,
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
          top: '31%',
          right: '3.9%',
          bottom: '17%'
        },
        color: ['#3c7bfd', '#5ad8a6', 'rgb(232,104,74)', 'rgb(246,189,22)'],
        series
      }
      chart.setOption(option)
    }

    const setPerformanceData = () => {
      if (controller.performanceData.inAll) {
        chart && chart.setOption({
          series: [
            { type: 'line', data: controller.performanceData.inAll },
            { type: 'line', data: controller.performanceData.outAll },
          ],
        })
      }
    }

    watch(() => controller.performanceData, setPerformanceData, { deep: true })

    onMounted(() => {
      initChart()
      setPerformanceData()
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
