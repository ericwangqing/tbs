<template lang="pug">
.tps-gauge
  svg.tps-gauge--track(:width="`${diameter}px`" :height="`${diameter}px`" :viewBox="`0 0 ${diameter} ${diameter}`" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink")
    defs
      radialGradient(id="tps-gradientTrackRed" r="0.58")
        stop(offset="70%" stop-color="#C00000" stop-opacity="0.1")
        stop(offset="100%" stop-color="#FF9494" stop-opacity="0.1")
      radialGradient(id="tps-gradientTrackBlue" r="0.56")
        stop(offset="70%" stop-color="#C05100" stop-opacity="0.1")
        stop(offset="100%" stop-color="#DEB500" stop-opacity="0.1")

    circle(:cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" stroke="rgba(255, 255, 255, 0.05)" fill="none")

    circle(:cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" :stroke="`url(#tps-gradientTrackBlue)`" fill="none" :stroke-dasharray="lowSpeedTrackDasharray" :stroke-dashoffset="`-${lowSpeedDashoffset}`")
    circle(:cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" :stroke="`url(#tps-gradientTrackRed)`" fill="none" :stroke-dasharray="highSpeedTrackDasharray" :stroke-dashoffset="`-${highSpeedDashoffset}`")


  svg.tps-gauge--line(:class="{ burning: burning }" :width="`${diameter}px`" :height="`${diameter}px`" :viewBox="`0 0 ${diameter} ${diameter}`" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink")
    defs
      radialGradient(id="tps-gradientLineRed" r="0.58")
        stop(offset="70%" stop-color="#C00000")
        stop(offset="100%" stop-color="#FF9494")
      radialGradient(id="tps-gradientLineBlue" r="0.56")
        stop(offset="70%" stop-color="#C05100")
        stop(offset="100%" stop-color="#DEB500")

      radialGradient(id="tps-gradientPointerWhite" r="0.6")
        stop(offset="70%" stop-color="#fff" stop-opacity="0.5")
        stop(offset="100%" stop-color="#fff")

    circle(:cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" :stroke="`url(#tps-gradientLineBlue)`" fill="none" :stroke-dasharray="lowSpeedLineDasharray" :stroke-dashoffset="`-${lowSpeedDashoffset}`")
    circle(:cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" :stroke="`url(#tps-gradientLineRed)`" fill="none" :stroke-dasharray="highSpeedLineDasharray" :stroke-dashoffset="`-${highSpeedDashoffset}`")

    circle(:cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" :stroke="`url(#tps-gradientPointerWhite)`" fill="none" :stroke-dasharray="pointerDasharray" :stroke-dashoffset="`-${pointerDashoffset}`")

</template>

<script>
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  name: 'TpsGauge',
  props: {
    radius: {
      type: Number,
      default: 161
    },
    strokeWidth: {
      type: Number,
      default: 34
    },
    percent: {
      type: Number,
      default: 0 // 0 ~ 100
    },
    id: {
      type: String,
      reqiured: true
    },
    burning: {
      type: Boolean,
      default: false
    }
  },
  setup: (props) => {
    const diameter = ref(props.radius * 2 + props.strokeWidth)
    const center = ref(props.radius + props.strokeWidth / 2)
    const perimeter = props.radius * Math.PI * 2
    const blankPercent = 0.33 // Threshold of arc to offset, because the gauge's bottom have about 120 deg blank. 1 / 3 of a circle.
    const highSpeedPercent = 0.114
    const lowSpeedPercent = 1 - 0.33 - 0.114
    const totalPercent = lowSpeedPercent + highSpeedPercent
    const threshold = lowSpeedPercent / totalPercent

    const lowSpeedDashoffset = perimeter * (0.25 + blankPercent / 2) // start at 0:15, so need offset of 1/4 and half of blank.
    const highSpeedDashoffset = perimeter * (0.25 + blankPercent / 2 + lowSpeedPercent)

    const lowSpeedTrackDasharray = ref(`${perimeter * lowSpeedPercent} ${perimeter}`)
    const highSpeedTrackDasharray = ref(`${perimeter * highSpeedPercent} ${perimeter * (1 - highSpeedPercent)}`)

    const lowSpeedLineDasharray = ref(`0 ${perimeter}`)
    const highSpeedLineDasharray = ref(`0 ${perimeter}`)

    const pointerDasharray = ref(`0 ${perimeter}`)
    const pointerDashoffset = ref(`${perimeter * (0.25 + blankPercent / 2)}`)

    const resetData = () => {
      lowSpeedLineDasharray.value = `0 ${perimeter}`
      highSpeedLineDasharray.value = `0 ${perimeter}`

      pointerDasharray.value = `0 ${perimeter}`
      pointerDashoffset.value = `${perimeter * (0.25 + blankPercent / 2)}`
    }

    const calcLineAndPointerPos = () => {
      const percent = props.percent / 100
      if (!percent) {
        resetData()
      } else {
        const percentInCircle = percent * totalPercent
        if (percent > threshold) {
          const overflow = percentInCircle - lowSpeedPercent
          lowSpeedLineDasharray.value = lowSpeedTrackDasharray.value
          highSpeedLineDasharray.value = `${perimeter * overflow} ${perimeter * (1 - overflow)}`
        } else {
          lowSpeedLineDasharray.value = `${perimeter * percentInCircle} ${perimeter}`
          highSpeedLineDasharray.value = `0 ${perimeter}`
        }
        pointerDasharray.value = `2 ${perimeter}`
        pointerDashoffset.value = `${perimeter * (0.25 + blankPercent / 2 + percent * totalPercent)}`
      }
    }

    calcLineAndPointerPos()

    watch(() => props.percent, calcLineAndPointerPos)

    return {
      diameter,
      center,
      lowSpeedDashoffset,
      highSpeedDashoffset,
      lowSpeedTrackDasharray,
      highSpeedTrackDasharray,

      lowSpeedLineDasharray,
      highSpeedLineDasharray,

      pointerDasharray,
      pointerDashoffset
    }
  }
})
</script>

<style lang="scss" scoped>
@keyframes burningGauge {
  0% {
    filter: drop-shadow(0px 0px 0px rgba(#FC9B21, 0.5));
  }
  50% {
    filter: drop-shadow(0px 0px 25px rgba(#FC9B21, 0.5));
  }
  100% {
    filter: drop-shadow(0px 0px 0px rgba(#FC9B21, 0.5));
  }
}

.tps-gauge {
  position: relative;
  &--track, &--line {
    position: absolute;
    top: 0;
    left: 0;
  }
  &--line.burning {
    animation: burningGauge ease-in-out infinite 4s;
  }
}
</style>
