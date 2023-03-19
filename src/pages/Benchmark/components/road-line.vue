<template lang="pug">
.road-line-container(ref="lineCvs")
</template>

<script>
import { defineComponent, inject, toRefs, ref, onMounted } from 'vue'
import { mountainDistortion, LongRaceDistortion } from '../composition/distortions.js'
import { RoadLine } from '../composition/road-line.js'

export default defineComponent({
  name: 'RoadLine',
  setup: () => {
    const lineCvs = ref(null)
    const options = {
      onSpeedUp: (ev) => {					
      },
      onSlowDown: (ev) => {
      },
      // mountainDistortion || LongRaceDistortion || xyDistortion || turbulentDistortion || turbulentDistortionStill || deepDistortionStill || deepDistortion
      distortion: LongRaceDistortion, 
      
      length: 400,
      roadWidth: 36,
      islandWidth: 2,
      lanesPerRoad: 3,

      fov: 90,
      fovSpeedUp: 150,
      speedUp: 2,
      carLightsFade: 0.4,

      totalSideLightSticks: 200,
      lightPairsPerRoadWay: 200,

      // Percentage of the lane's width
      shoulderLinesWidthPercentage: 0.05,
      brokenLinesWidthPercentage: 0.1,
      brokenLinesLengthPercentage: 0.5,

      /*** These ones have to be arrays of [min,max].  ***/
      lightStickWidth: [0.12, 0.5],
      lightStickHeight: [1.3, 1.7],

      movingAwaySpeed: [60, 80],
      movingCloserSpeed: [-120, -160],

      /****  Anything below can be either a number or an array of [min,max] ****/

      // Length of the lights. Best to be less than total length
      carLightsLength: [400 * 0.05, 400 * 0.15],
      // Radius of the tubes
      carLightsRadius: [0.05, 0.14],
      // Width is percentage of a lane. Numbers from 0 to 1
      carWidthPercentage: [0.3, 0.5],
      // How drunk the driver is.
      // carWidthPercentage's max + carShiftX's max -> Cannot go over 1. 
      // Or cars start going into other lanes 
      carShiftX: [-0.2, 0.2],
      // Self Explanatory
      carFloorSeparation: [0.05, 1],

      colors: {
        roadColor: 0x212435,
        islandColor: 0x212435,
        background: 0x212435,
        shoulderLines: 0x212435,
        brokenLines: 0x212435,
        /***  Only these colors can be an array ***/
        leftCars: [0x9e9b5f, 0xfdf5cf, 0xf7e88d],
        rightCars: [0xd8ac9b, 0xfbefec, 0xf4c7bb],
        sticks: 0x212435,
      }
    }

    onMounted(() => {
      const lineComp = new RoadLine(lineCvs.value, options);
      lineComp.loadAssets().then(lineComp.init)
    })

    return {
      lineCvs
    }
  }
})
</script>

<style lang="scss" scoped>
.road-line-container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
  
