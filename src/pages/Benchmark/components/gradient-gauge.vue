<template lang="pug">
svg.gradient-gauge(:width="`${diameter}px`" :height="`${diameter}px`" :viewBox="`0 0 ${diameter} ${diameter}`" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink")
  defs
    linearGradient(x1="0" y1="0" x2="1" y2="0" :id="`${id}-gradientDef`")
      stop(offset="0%" :stop-color="leftColor")
      stop(offset="100%" :stop-color="rightColor")
  foreignObject(v-if="!needShadow" x="0" y="0" :width="diameter" :height="diameter")
    body.gauge-content-wrapper(xmlns="http://www.w3.org/1999/xhtml")
      .gauge-content
        slot
  g
    circle(v-if="backRingAround" :cx="center" :cy="center" :r="radius + strokeWidth / 2 - backLineStrokeWidth / 2", :stroke-width="backLineStrokeWidth" :stroke="`url(#${id}-gradientDef)`" fill="none" :stroke-dasharray="`${backLinePerimeter} ${backLinePerimeter - backLineArcToDashOffset - 77}`" :stroke-dashoffset="`-${backLineArcToDashOffset}`")
    circle(v-if="backRingAround" :cx="center" :cy="center" :r="radius + strokeWidth / 2 + backRingAroundPadding / 2 + backRingStrokeWidth / 2" :stroke-width="backRingStrokeWidth" stroke="rgba(255, 255, 255, 0.05)" fill="none")
    circle(v-else :cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" stroke="rgba(255, 255, 255, 0.05)" fill="none")
  circle(:cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" :stroke="`url(#${id}-gradientDef)`" fill="none" :stroke-dasharray="strokeDasharray" :stroke-dashoffset="`-${arcToDashOffset}`" :stroke-linecap="`${ percent > 0 ? 'round' : 'unset' }`")

</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'

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
    },
    percentChangeAnimate: {
      type: Boolean,
      default: true
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

    const calcStrokeOffset = (percent) => {
      if (!percent) percent = 0
      const val = percent / 100 * (perimeter * 0.65) // 0.65 is 1 - 0.425 * 2 / 6.28, arc in circle.
      const maxVal = perimeter - arcToDashOffset
      if (val > maxVal) {
        strokeDasharray.value = `${maxVal} ${arcToDashOffset - val + maxVal}`
      } else {
        strokeDasharray.value = `${val} ${perimeter - val}`
      }
    }
    calcStrokeOffset(0)

    let interval = null
    watch(() => props.percent, (val, oldVal) => {
      if (props.percentChangeAnimate) {
        if (interval) {
          clearInterval(interval)
        }
        const diff = val - oldVal
        let delta = diff / 5
        interval = setInterval(() => {
          calcStrokeOffset(oldVal + delta)
          delta += diff / 5
          if (Math.abs(delta) > Math.abs(diff)) {
            clearInterval(interval)
            interval = null
          }
        }, 50)
      } else {
        calcStrokeOffset(val)
      }
    })

    const contentDiameter = computed(() => {
      return `calc(100% - ${2 * props.backRingStrokeWidth}px)`
    })

    const contentPadding = computed(() => {
      return `calc(${props.backRingStrokeWidth}px)`
    })

    return {
      diameter,
      center,
      strokeDasharray,
      arcToDashOffset,
      backLinePerimeter,
      backLineArcToDashOffset,
      contentDiameter,
      contentPadding
    }
  },
})
</script>

<style lang="scss" scoped>
.gauge-content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
}
.gauge-content {
  position: absolute;
  top: v-bind('contentPadding');
  left: v-bind('contentPadding');
  width: v-bind('contentDiameter');
  height: v-bind('contentDiameter');
  border-radius: 50%;
  z-index: 2;
  background: rgba(0,0,0,0.20);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
