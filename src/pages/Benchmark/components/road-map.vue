<template lang="pug">
.road-map-container
  svg(width="238px" height="229px" viewBox="-20 -20 238 229" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="filter: drop-shadow(0px 0px 4px 0px rgba(0, 0, 0, 0.3));")
    defs
    linearGradient(x1="0" y1="0" x2="0" y2="1" id="gradient1")
      stop(offset="0%" stop-color="#FFCB00")
      stop(offset="100%" stop-color="#F08B00")
    g(stroke-width="5" fill="none" fill-rule="evenodd")
      polygon(:points="points" stroke="url(#gradient1)")
      polygon(:points="startLine" stroke="#fff")
      polygon(:points="points" stroke="#fff" stroke-width="5" fill="none" fill-rule="evenodd" :stroke-dasharray="strokeDasharray" :stroke-dashoffset="strokeDashoffset")
    g
      polygon(style="fill: #fff; stroke: #fff; stroke-width: 4", stroke-linejoin="round" :points="triangleBackPoints" )
      polygon(style="fill: #FD693C; stroke: #FD693C; stroke-width: 4", stroke-linejoin="round" :points="trianglePoints" )

  .test-plan-info
    .test-plan-name {{ controller.testData?.name || 'Not Running' }}
    .test-plan-txn
      .test-plan-txn--current {{ formattedCurrentTxn }}
      span /
      .test-plan-txn--total {{ formattedTotalTxn }}
    .test-plan-elapsed-time
      .text-plan-elapsed-time__text {{ formattedTimeCost }}
      .text-plan-elapsed-time__icon
    .test-plan-estimated-time Estimated Time: {{ formattedTimeEstimated }}
  .test-plan-config-btn
    .text-plan-config-btn__text Config
    .text-plan-config-btn__icon
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import roadCoordinates from '@/assets/road-coordinates.json'
import { controller } from '../composition/controller.js'
import { formatNumWithUnit, formatTime } from '../composition/util.js'

export default defineComponent({
  name: 'RoadMap',
  setup: () => {
    const startPos = roadCoordinates[0]

    const currentPos = ref({
      x: roadCoordinates[0].x,
      y: roadCoordinates[0].y,
      assist: 1
    })

    let perimeter = 0
    roadCoordinates.map((p) => perimeter += p.distance)
    
    const trianglePoints = ref('')
    const triangleBackPoints = ref('')
    let stage = 0
    const strokeDasharray = ref('0 1000')
    const strokeDashoffset = ref(0)

    const points = computed(() => {
      return roadCoordinates.map((point) => `${point.x} ${point.y}`).join(' ')
    })

    const startLine = computed(() => {
      return `${startPos.x - 4 + 2} ${startPos.y + 4 + 2} ${startPos.x + 4 + 2} ${startPos.y - 4 + 2}`
    })

    const calcCurrentPos = () => {
      const percent = controller.percent
      for (let i = 0; i < roadCoordinates.length; i++) {
        if (i === roadCoordinates.length - 1 || (roadCoordinates[i].percent <= percent && roadCoordinates[i + 1].percent > percent)) {
          stage = i
          break
        }
      }
      const morePercent = percent - roadCoordinates[stage].percent
      const nextStage = stage === roadCoordinates.length - 1 ? 0 : stage + 1
      const nextPercent = stage === roadCoordinates.length - 1 ? 1 : roadCoordinates[nextStage].percent
      currentPos.value = {
        x: roadCoordinates[stage].x + (roadCoordinates[nextStage].x - roadCoordinates[stage].x) * morePercent / (nextPercent - roadCoordinates[stage].percent),
        y: roadCoordinates[stage].y + (roadCoordinates[nextStage].y - roadCoordinates[stage].y) * morePercent / (nextPercent - roadCoordinates[stage].percent),
        assist: roadCoordinates[nextStage].y >= roadCoordinates[stage].y ? -1 : 1 // x、y均大时，仅凭coordinate上记录的direction（atant）值，无法判断正负，需要辅助。
      }
      strokeDasharray.value = `${(1 - percent) * perimeter} 10000`
      strokeDashoffset.value = -(percent) * perimeter
    }
    calcCurrentPos()

    const calcTrianglePointsWithSize = (width, height) => {
      // 根据当前pos，以及所处的direction，计算三角points。
      const { direction } = roadCoordinates[stage]
      let { x, y, assist } = currentPos.value
      const head = {
        x: x - assist * height / 2 * Math.sin(direction),
        y: y - assist * height / 2 * Math.cos(direction)
      }
      const bottom = {
        x: x + assist * (height / 2.5) * Math.sin(direction),
        y: y + assist * (height / 2.5) * Math.cos(direction)
      }
      const left = {
        x: bottom.x + width / 2 * Math.cos(direction),
        y: bottom.y - width / 2 * Math.sin(direction)
      }
      const right = {
        x: bottom.x - width / 2 * Math.cos(direction),
        y: bottom.y + width / 2 * Math.sin(direction)
      }
      return `${head.x} ${head.y} ${left.x} ${left.y} ${right.x} ${right.y}`
    }

    const calcTrianglePoints = () => {
      trianglePoints.value = calcTrianglePointsWithSize(10, 14)
      triangleBackPoints.value = calcTrianglePointsWithSize(16, 20)
    }

    calcTrianglePoints()

    watch(() => controller.percent, () => {
      calcCurrentPos()
      calcTrianglePoints()
    })

    const formattedCurrentTxn = computed(() => {
      return formatNumWithUnit(controller.txCount)
    })

    const formattedTotalTxn = computed(() => {
      if (!controller.testData) return '0'
      return formatNumWithUnit(controller.testData.txn)
    })

    const formattedTimeCost = computed(() => {
      return formatTime(controller.timeCost)
    })

    const formattedTimeEstimated = computed(() => {
      if (!controller.testData) return '00:00.00'
      return formatTime(controller.testData.estimated)
    })

    return {
      points,
      startLine,
      trianglePoints,
      triangleBackPoints,
      strokeDasharray,
      strokeDashoffset,
      controller,
      formattedCurrentTxn,
      formattedTotalTxn,
      formattedTimeCost,
      formattedTimeEstimated
    }
  },
})
</script>

<style lang="scss" scoped>
.road-map-container {
  .test-plan-info {
    display: flex;
    flex-direction: column;
    color: #fff;
    align-items: flex-end;
    padding-right: 20px;
    font-family: Helvetica, Helvetica-Regular;
    .test-plan-name {
      font-size: 30px;
      font-weight: bold;
    }
    .test-plan-txn, .test-plan-estimated-time {
      font-size: 16px;
      display: flex;
      font-style: italic;
      color: rgba(255, 255, 255, 0.45);
      span {
        margin: 0 4px;
        color: #fff;
      }
      &--current {
        color: #FFD300;
      }
    }
    .test-plan-elapsed-time {
      font-size: 34px;
      font-weight: bold;
      font-style: italic;
    }
  }
  .test-plan-config-btn {
    position: fixed;
    right: 0;
    padding: 12px 45px 10px 16px;
    margin-top: 40px;
    color: #fff;
    background: linear-gradient(90deg,rgba(0,0,0,0.80) 46%, rgba(0,0,0,0.00));
    font-weight: bold;
    font-style: italic;
    font-size: 20px;
    border-radius: 8px 0px 0px 8px;
    user-select: none;
    cursor: pointer;
  }
}
</style>
