<template lang="pug">
.resource-charts-container
  .resource-chart(ref="resourceChart")
  .resource-gauges
    GradientGauge.cpu-gauge(id="cpuGauge", :radius="48", :strokeWidth="10", leftColor="#FC6E21", rightColor="#B85718", :needBackRing="false", :percent="currentCpu", :needShadow="false", :backRingAround="true")
      .gauge-count {{Math.floor(currentCpu)}}%
      .gauge-label CPU
    GradientGauge.memory-gauge(id="memoryGauge", :radius="48", :strokeWidth="10", leftColor="#49DAB0", rightColor="#46B8C0", :needBackRing="false", :percent="currentMemory", :needShadow="false", :backRingAround="true")
      .gauge-count {{Math.floor(currentMemory)}}%
      .gauge-label Memory
    GradientGauge.bandwidth-gauge(id="bandwidthGauge", :radius="48", :strokeWidth="10", leftColor="#F6BD16", rightColor="#EF8C30", :needBackRing="false", :percent="currentBandwidth", :needShadow="false", :backRingAround="true")
      .gauge-count {{Math.floor(currentBandwidth)}}%
      .gauge-label Bandwidth

</template>

<script>
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import GradientGauge from './gradient-gauge.vue'
import { controller } from '../composition/controller.js'

export default defineComponent({
  name: 'ResourceCharts',
  components: {
    GradientGauge
  },
  setup: (props) => {
    const resourceChart = ref(null)
    let chart = null
    const cpuData = ref([])
    const memoryData = ref([])
    const bandwidthData = ref([])
    const currentCpu = ref(0)
    const currentMemory = ref(0)
    const currentBandwidth = ref(0)

    const initChart = () => {
      chart = echarts.init(resourceChart.value)
      const option = {
        title: {
          text: 'Node Resource Consumption（avg.）',
          left: '3%',
          top: '1.5%',
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
          top: '12%',
          left: '3.8%',
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
          left: '9%',
          top: '35%',
          right: '6.7%',
          bottom: '7.5%'
        },
        color: ['#3C7BFD', '#5AD8A6', '#F6BD16'],
        series: [
          { name: 'CPU', type: 'line', symbol: 'none', data: [] },
          { name: 'Memory', type: 'line', symbol: 'none', data: [] },
          { name: 'Bandwidth', type: 'line', symbol: 'none', data: [] }
        ],
      }
      chart.setOption(option)
    }

    const setResourceData = () => {
      if (controller.resourceData.cpu) {
        chart && chart.setOption({
          series: [
            { data: controller.resourceData.cpu },
            { data: controller.resourceData.memory },
            { data: controller.resourceData.bandwidth },
          ],
        })
        if (!controller.resourceData.cpu.length) {
          currentCpu.value = currentMemory.value = currentBandwidth.value = 0
        } else {
          currentCpu.value = controller.resourceData.cpu[controller.resourceData.cpu.length - 1].value[1]
          currentMemory.value = controller.resourceData.memory[controller.resourceData.memory.length - 1].value[1]
          currentBandwidth.value = controller.resourceData.bandwidth[controller.resourceData.bandwidth.length - 1].value[1]
        }
      }
    }

    watch(() => controller.resourceData, setResourceData, { deep: true })

    onMounted(() => {
      initChart()
      setResourceData()
    })


    return {
      resourceChart,
      currentCpu,
      currentMemory,
      currentBandwidth
    }
  },
})
</script>

<style lang="scss" scoped>
.resource-charts-container {
  position: relative;
  .resource-chart {
    display: block;
    height: 270px;
    width: 578px;
  }
  .resource-gauges {
    position: absolute;
    top: 48px;
    left: 73px;
    height: 106px;
    display: flex;
    margin: 8px 36px;
    svg:not(:last-child) {
      margin-right: 66px;
    }
    .gauge-count {
      font-size: 36px;
      font-style: italic;
      font-weight: bold;
    }
    .gauge-label {
      margin-top: -10px;
      font-size: 14px;
      font-style: italic;
    }
  }
}
</style>
