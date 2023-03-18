<template lang="pug">
.resource-chart-wrapper
  .resource-chart-container(ref="resourceContainerRef")
  .gauge-charts-group
    .cpu-gauge-container(ref="cpuGaugeRef")
    .memory-gauge-container(ref="memoryGaugeRef")
    .bandwidth-gauge-container(ref="bandwidthGaugeRef")
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import controller from "../composition/controller.js"

export default defineComponent({
  name: 'Resource',
  props: {
    config: {
      type: Object
    }
  },
  setup: () => {
    const resourceContainerRef = ref(null)
    const cpuGaugeRef = ref(null)
    const memoryGaugeRef = ref(null)
    const bandwidthGaugeRef = ref(null)
    
    const generateGaugeOption = ({name, borderColor, axisColor}) => {
      return {
        series: [{
          name,
          type: 'gauge',
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            itemStyle: {
              borderWidth: 2,
              borderColor: borderColor
            },
          },
          detail: {
            fontSize: 24,
              offsetCenter: [0, '-20%'],
              valueAnimation: true,
              formatter: function (value) {
                return Math.round(value) + '%';
              },
              color: '#ffffff'
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              distance: 50
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10
            },
            pointer: {
              show: false
            },
            anchor: {
              show: false
            },
            title: {
              fontSize: 14,
              offsetCenter: [0, '30%'],
              color: '#ffffff'
            },
            data: [{ value: 50, name }],
            axisLine: { lineStyle: { width: 2 ,color: [[1, axisColor]] } },
            radius: "100%"
        }]
      }
    }

    const initResourceCharts = () => {
      const resourceChart = echarts.init(resourceContainerRef.value)
      resourceChart.setOption({
        title: {
          text: 'Node resource consumption (avg.)',
          left: '2.5%',
          top: '4.6%',
          textStyle: {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 20,
            fontFamily: 'Arial, Arial-Regular'
          }
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['CPU', 'Memory', 'Bandwidth'],
          top: '14%',
          left: '2.2%',
          textStyle: {
            color: "#8C8C8C"
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false,
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
          min: 0,
          max: 100,
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: '#92949c'
          },
        },
        grid: {
          left: '10%',
          top: '25%',
          right: '3%'
        },
        color: ['rgb(60,123,253)', 'rgb(145, 204, 117)', 'rgb(250, 200, 88)'],
        series: [
          { name: 'CPU', type: 'line', symbol: 'none', data: [] },
          { name: 'Memory', type: 'line', symbol: 'none', data: [] },
          { name: 'Bandwidth', type: 'line', symbol: 'none', data: [] }
        ],
      })
      
      const cpuGauge = echarts.init(cpuGaugeRef.value);
      cpuGauge.setOption(generateGaugeOption({ name: 'CPU', borderColor: '#FC6E21', axisColor: '#FBE031' }))

      const memoryGauge = echarts.init(memoryGaugeRef.value);
      memoryGauge.setOption(generateGaugeOption({ name: 'Memory', borderColor: '#5AD8A6', axisColor: '#5EF87F' }))

      const bandwidthGauge = echarts.init(bandwidthGaugeRef.value);
      bandwidthGauge.setOption(generateGaugeOption({ name: 'BW', borderColor: '#F6BD16', axisColor: '#F6E516' }))

      return { resourceChart, cpuGauge, memoryGauge, bandwidthGauge }
    }

    onMounted(() => {
      setTimeout(() => {
        const { resourceChart, bandwidthGauge, memoryGauge, cpuGauge } = initResourceCharts()
        controller.initChart({ resourceChart, bandwidthGauge, memoryGauge, cpuGauge })
      }, 300)
    })

    return {
      resourceContainerRef,
      cpuGaugeRef,
      memoryGaugeRef,
      bandwidthGaugeRef
    }
  }
})
</script>

<style scoped lang="scss">
.resource-chart-wrapper {
    position: relative;
    border-radius: 4px;
    .resource-chart-container {
      width: 100%;
      height: 100%;
    }
    .gauge-charts-group {
      position: absolute;
      width: 100%;
      height: 25%;
      top: 25%;
      padding: 0 12.5%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .cpu-gauge-container, .memory-gauge-container, .bandwidth-gauge-container {
      width: 14%;
      height: 100%;
    }
}
</style>