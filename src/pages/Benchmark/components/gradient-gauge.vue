<template lang="pug">
svg.gradient-gauge(:width="`${diameter}px`" :height="`${diameter}px`" :viewBox="`0 0 ${diameter} ${diameter}`" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink")
  defs
    linearGradient(x1="1" y1="0" x2="0" y2="0" :id="`${id}-gradientDef`")
      stop(offset="0%" :stop-color="leftColor")
      stop(offset="100%" :stop-color="rightColor")
  circle(v-if="backRingAround" :cx="center" :cy="center" :r="radius + strokeWidth / 2 - backLineStrokeWidth / 2", :stroke-width="backLineStrokeWidth" :stroke="`url(#${id}-gradientDef)`" fill="none" :stroke-dasharray="`${backLinePerimeter} ${backLinePerimeter - backLineArcToDashOffset - 77}`" :stroke-dashoffset="`-${backLineArcToDashOffset}`")
  circle(v-if="backRingAround" :cx="center" :cy="center" :r="radius + strokeWidth / 2 + backRingAroundPadding / 2 + backRingStrokeWidth / 2" :stroke-width="backRingStrokeWidth" stroke="rgba(255, 255, 255, 0.05)" fill="none")
  circle(v-else :cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" stroke="rgba(255, 255, 255, 0.05)" fill="none")
  circle(:cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" :stroke="`url(#${id}-gradientDef)`" fill="none" :stroke-dasharray="strokeDasharray" :stroke-dashoffset="`-${arcToDashOffset}`" stroke-linecap="round")
  foreignObject(v-if="!needShadow" x="0" y="0" :width="diameter" :height="diameter")
    body.gauge-content(xmlns="http://www.w3.org/1999/xhtml")
      slot
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

// gauge with gradient color as left to right.
export default defineComponent({
  name: 'GradientGauge',
  props: {
    radius: {
      type: Number,
      default: 161
    },
    strokeWidth: {
      type: Number,
      default: 34
    },
    leftColor: {
      type: String,
      default: '#C02700'
    },
    rightColor: {
      type: String,
      default: '#DEB500'
    },
    backRingAround: {
      type: Boolean,
      default: false // back ring is around or behind the circle arc.
    },
    backRingAroundPadding: {
      type: Number,
      default: 5
    },
    backRingStrokeWidth: {
      type: Number,
      default: 4
    },
    backLineStrokeWidth: {
      type: Number,
      default: 2
    },
    percent: {
      type: Number,
      default: 0 // 0 ~ 100
    },
    needShadow: {
      type: Boolean,
      default: true // no shadow, can add content in circle. otherwise content will disturb the shadow.
    },
    id: {
      type: String,
      reqiured: true
    }
  },
  setup: (props) => {
    const diameter = ref(props.radius * 2 + props.strokeWidth)
    const center = ref(props.radius + props.strokeWidth / 2)
    const perimeter = props.radius * Math.PI * 2
    const arcToDashOffset = 0.425 * perimeter // Threshold of arc to offset, because the gauge's bottom have about 129 deg blank. 64.8deg -> 0.425rad
    const strokeDasharray = ref(`1 ${perimeter - 1}`)

    const backLinePerimeter = props.backRingAround ? center.value * Math.PI * 2 : 0
    const backLineArcToDashOffset = 0.425 * backLinePerimeter
    if (props.backRingAround) {
      diameter.value += (props.backRingAroundPadding + props.backLineStrokeWidth) * 2
      center.value += props.backRingAroundPadding + props.backLineStrokeWidth
    }

    const calcStrokeOffset = () => {
      const val = props.percent / 100 * (perimeter * 0.65) // 0.65 is 1 - 0.425 * 2 / 6.28, arc in circle.
      const maxVal = perimeter - arcToDashOffset
      if (val > maxVal) {
        strokeDasharray.value = `${maxVal} ${arcToDashOffset - val + maxVal}`
      } else {
        strokeDasharray.value = `${val} ${perimeter - val}`
      }
    }
    calcStrokeOffset()

    watch(() => props.percent, calcStrokeOffset)

    return {
      diameter,
      center,
      strokeDasharray,
      arcToDashOffset,
      backLinePerimeter,
      backLineArcToDashOffset
    }
  },
})
</script>

<style lang="scss" scoped>
.gauge-content {
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
