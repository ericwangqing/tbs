<template lang="pug">
.resource-charts-container
  .resource-chart(ref="resourceChart")

</template>

<script>
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'ResourceCharts',
  props: {
    isFast: {
      default: false,
      type: Boolean
    },
  },
  setup: (props) => {
    const resourceChart = ref(null)
    const chart = ref(null)
    const cpuData = ref([])
    const memoryData = ref([])
    const bandwidthData = ref([])

    const initChart = () => {
      chart.value = echarts.init(resourceChart.value)
      const option = {
        title: {
          text: 'Node Resource Consumption (avg.)',
          left: '2.5%',
          top: '0',
          textStyle: {
            color: '#fff',
            fontWeight: 'bolder',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['CPU', 'Memory', 'Bandwidth'],
          top: '17.5%',
          left: '2.2%',
          textStyle: {
            color: '#8c8c8c'
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.45)'
          },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.45)'
          },
        },
        grid: {
          left: '10%',
          top: '34%',
          right: '3%',
          bottom: '10%'
        },
        color: ['#3C7BFD', '#5AD8A6', '#F6BD16'],
        series: [
          { name: 'CPU', type: 'line', symbol: 'none', data: [] },
          { name: 'Memory', type: 'line', symbol: 'none', data: [] },
          { name: 'Bandwidth', type: 'line', symbol: 'none', data: [] }
        ],
      }
      chart.value.setOption(option)
    }

    const redraw = () => {
      const now = Date.now()
      const LINE_CHART_X_RANGE = 40 // datas in ${x}s per page
      // TODO data from network!!!
      const cpuUsage = 10 * Math.random();
      const memoryUsage = 10 + 10 * Math.random();
      const bandwidthUsage = 20 + 10 * Math.random();

      if (cpuData.value.length > LINE_CHART_X_RANGE) cpuData.value.shift()
      if (memoryData.value.length > LINE_CHART_X_RANGE) memoryData.value.shift()
      if (bandwidthData.value.length > LINE_CHART_X_RANGE) bandwidthData.value.shift()

      cpuData.value.push({ name: now.toString(), value: [new Date(), cpuUsage] })
      memoryData.value.push({
        name: now.toString(),
        value: [new Date(), memoryUsage],
      })
      bandwidthData.value.push({
        name: now.toString(),
        value: [new Date(), bandwidthUsage],
      })
      chart.value && chart.value.setOption({
        series: [
          { data: cpuData.value },
          { data: memoryData.value },
          { data: bandwidthData.value },
        ],
      })
      // this.cpuGauge && this.cpuGauge.setOption({ series: [{ data: [{ value: cpuUsage, name: 'CPU' }] }] })
      // this.memoryGauge && this.memoryGauge.setOption({ series: [{ data: [{ value: memoryUsage, name: 'Memory' }] }] })
      // this.bandwidthGauge && this.bandwidthGauge.setOption({ series: [{ data:[{ value: bandwidthUsage, name: 'BW' }] }] })
    }

    setInterval(() => {
      redraw()
    }, 1000)

    onMounted(() => {
      initChart()
    })
    return {
      resourceChart,
    }
  },
})
</script>

<style lang="scss" scoped>
.resource-charts-container {
  .resource-chart {
    display: block;
    height: 179px;
    width: 549px;
  }
}
</style>
