<template lang="pug">
.world-map-container
  img.bg(:src="mapBg")
  .map-cvs(ref="worldMapContainer")
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import axios from 'axios'
import mapBg from '@/assets/map.png'

export default defineComponent({
  name: 'WorldMap',
  setup: (props) => {
    const worldMapContainer = ref(null)

    async function registerMap() {
      const {data: worldGeoJson} = await Promise.race([
        new Promise(resolve => axios.get('https://ghproxy.com/https://raw.githubusercontent.com/apache/echarts/29a4fe91f7cf59ea347e066bb241346f0b1bde75/test/data/map/json/world.json').then(resolve).catch(/*do nothing*/)),
        new Promise(resolve => axios.get('https://raw.githubusercontent.com/apache/echarts/29a4fe91f7cf59ea347e066bb241346f0b1bde75/test/data/map/json/world.json').then(resolve).catch(/*do nothing*/))
      ])
      echarts.registerMap('worldCustom', worldGeoJson)
      return true
    }

    async function initWorldMap() {
      const map = echarts.init(worldMapContainer.value)
      map.setOption({
        geo3D: {
          map: 'worldCustom',
          shading: 'color',
          silent: true,
          realisticMaterial: {
            roughness: 0.8,
            metalness: 0,
          },
          postEffect: {
            enable: false,
          },
          groundPlane: {
            show: false,
          },
          light: {
            main: {
              intensity: 1,
              alpha: 30,
            },
            ambient: {
              intensity: 0,
            },
          },
          viewControl: {
            distance: 70,
            alpha: 89,
            panMouseButton: 'left',
            rotateMouseButton: 'right',
            zoomSensitivity: 0,
            panSensitivity: 0,
          },
          itemStyle: {
            color: 'rgb(73, 75, 95)',
            opacity: 0,
            borderWidth: 0
          },
          regionHeight: 0.5,
        },
        series: [
          {
            id: 'tx',
            type: 'lines3D',
            coordinateSystem: 'geo3D',
            effect: {
              show: true,
              trailWidth: 2,
              trailOpacity: 1,
              trailLength: 0.2,
              constantSpeed: 5,
              // period: 1
            },
            blendMode: 'lighter',
            lineStyle: {
              // width: 0.2,
              opacity: 0,
            },
            silent: true,
            data: [],
          },
        ],
      })
      return map
    }

    onMounted(async () => {
      await registerMap()
      const mapChart = await initWorldMap()
      mapChart.setOption({
        series: [{
          data: [{
            coords: [[-72.303062, 43.730282], [-44.915199, 6.23344]],
            lineStyle: '#FF4343',
            opacity: 1
          }]
        }]
      })
    })

    return {
      worldMapContainer,
      mapBg,
      registerMap
    }
  }
})
</script>

<style lang="scss" scoped>
  .world-map-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    .map-cvs {
      width: 100%;
      aspect-ratio: 2;
      margin-left: -2vw;
      margin-top: -6vh;
    }
    .bg {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      left: 50%;
      aspect-ratio: 1.8;
      width: 80%;
    }
  }
</style>
