<template lang="pug">
.road-line-container(ref="lineCvs" :class="roadLineStateCls")
</template>

<script>
import { computed, defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { mountainDistortion, LongRaceDistortion } from '../composition/distortions.js'
import { RoadLine } from '../composition/road-line.js'
import { controller } from '../composition/controller.js'

export default defineComponent({
  name: 'RoadLine',
  setup: () => {
    const lineCvs = ref(null)
    const needAnimate = ref(false)
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
        leftCarsLowSpeedColor: [0x9e9b5f, 0xfdf5cf, 0xf7e88d],
        rightCarsLowSpeedColor: [0xd8ac9b, 0xfbefec, 0xf4c7bb],
        leftCarsHighSpeedColor: [0xf49c9c, 0xff5757, 0xe03f3f],
        rightCarsHighSpeedColor: [0xfaf6da, 0xe3deba, 0xe4d18f],
        sticks: 0x212435,
      }
    }

    let lineComp
    onMounted(() => {
      lineComp = new RoadLine(lineCvs.value, options);
      lineComp.loadAssets().then(() => {
        lineComp.init()
        if (controller.state === 'preparing' || controller.state === 'running') lineComp.start()
        else lineComp.stop()
        if (controller.tps >= 100000) lineComp.onSpeedUp()
      })
    })

    onBeforeUnmount(() => {
      if (lineComp) lineComp.dispose()
    })

    watch(
      () => controller.tps,
      (val) => {
        if (val >= 100000) lineComp.onSpeedUp()
        else lineComp.onSlowDown()
      }
    )

    const roadLineStateCls = computed(() => {
      return [controller.state, needAnimate.value ? 'startAnimate' : '']
    })
    
    watch(() => controller.state, (val, oldVal) => {
      if (val === 'preparing') {}
      else if (val === 'running') {
        lineComp.start()
        if (oldVal === 'preparing') needAnimate.value = true
      } else {
        lineComp.stop()
        needAnimate.value = false
      }
    })

    return {
      lineCvs,
      controller,
      roadLineStateCls
    }
  }
})
</script>

<style lang="scss" scoped>
@keyframes roadlineStartOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes roadlineStartAnimation {
  0% {
    top: 7%;
    transform: scale(1, 1.68);
  }
  100% {
    top: 0;
    transform: scale(1, 1);
  }
}
@keyframes roadlineBlurFilter {
  0% {
    filter: blur(0);
  }
  100% {
    filter: blur(10px);
  }
}
.road-line-container {
  position: absolute;
  top: 7%;
  width: 100%;
  height: 100%;
  transform: scale(1.68);
  transform-origin: 50% 0;
  opacity: 1;
  &.startAnimate {
    animation: roadlineStartAnimation 1 1s forwards, roadlineStartOpacity 1 0.5s forwards;
  }
  &.running, &.completed {
    top: 0;
    opacity: 1;
    transform: scale(1);
  }
  &.completed {
    animation: roadlineBlurFilter 1 0.3s forwards ease-in-out;
  }
}
</style>

<style lang="scss">
@keyframes roadlineStartAnimationCvs {
  0% {
    transform: scale(1.68, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
.road-line-container canvas {
  width: 100%;
  height: 100%;
  transform: scale(1.68, 1);
}

.road-line-container.startAnimate canvas {
  animation: roadlineStartAnimationCvs 1 2s forwards;
}

.road-line-container.running canvas {
  transform: scale(1);
}
</style>
