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

    g(:transform="`translate(${currentPos.x - triangleSize.width / 2} ${currentPos.y - triangleSize.height / 2})`")
      g(:transform="`rotate(${currentPos.deg}, ${triangleSize.width / 2}, ${triangleSize.height / 2})`" fill="#FD693C" stroke="#FFFFFF")
        path(d="M6.59134999999992,1.2714129999999955 C6.941420000000107,1.1138809999999921 7.351589999999987,1.0898970000000077 7.738880000000108,1.2367989999999907 C8.140239999999949,1.3890409999999918 8.457149999999956,1.7059480000000065 8.609390000000076,2.1073140000000024 L8.609390000000076,2.1073140000000024 L12.918629999999894,13.468018999999998 C13.06553000000008,13.85530700000001 13.04153999999994,14.26547500000001 12.88400999999999,14.615546999999992 C12.726480000000038,14.965619000000004 12.435400000000072,15.255594000000002 12.048109999999951,15.402496000000014 C11.87815999999998,15.466961999999995 11.69789999999989,15.5 11.516129999999976,15.5 L11.516129999999976,15.5 L2.897660000000087,15.5 C2.483449999999948,15.5 2.108449999999948,15.332107000000008 1.836999999999989,15.060660000000013 C1.565560000000005,14.789213999999987 1.3976600000000872,14.414213999999987 1.3976600000000872,14 C1.3976600000000872,13.81823 1.430699999999888,13.637972999999988 1.4951699999999164,13.468018999999998 L1.4951699999999164,13.468018999999998 L5.804399999999987,2.1073140000000024 C5.9512999999999465,1.7200249999999926 6.241279999999961,1.4289449999999988 6.59134999999992,1.2714129999999955 Z")

  .test-plan-info
    .test-plan-name {{ controller.testData?.name || '暂未开始' }}
    .test-plan-txn
      .test-plan-txn--current {{ formattedCurrentTxn }}
      span /
      .test-plan-txn--total {{ formattedTotalTxn }}
    .test-plan-elapsed-time
      .test-plan-elapsed-time__text {{ formattedTimeCost }}
      .test-plan-elapsed-time__icon
    .test-plan-estimated-time Estimated Time: {{ formattedTimeEstimated }}
  .test-plan-config-btn(@click="openConfig", :class="{ breathe: !controller.running }")
    .test-plan-config-btn__text Config
    .test-plan-config-btn__icon
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import roadCoordinates from '@/assets/road-coordinates.json'
import { controller } from '../composition/controller.js'
import { formatNumWithUnit, formatTime } from '../composition/util.js'

export default defineComponent({
  name: 'RoadMap',
  setup: (props, { emit }) => {
    const startPos = roadCoordinates[0]
    const triangleSize = { width: 14, height: 16 }

    const currentPos = ref({
      x: roadCoordinates[0].x,
      y: roadCoordinates[0].y,
      deg: 0
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
        deg: (roadCoordinates[nextStage].y >= roadCoordinates[stage].y ? 1 : -1) * roadCoordinates[stage].direction / (Math.PI / 180)
      }
      strokeDasharray.value = `${(1 - percent) * perimeter} 10000`
      strokeDashoffset.value = -(percent) * perimeter
    }
    calcCurrentPos()

    watch(() => controller.percent, () => {
      calcCurrentPos()
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

    const openConfig = () => {
      emit('configShow')
    }

    return {
      points,
      triangleSize,
      currentPos,
      startLine,
      trianglePoints,
      triangleBackPoints,
      strokeDasharray,
      strokeDashoffset,
      controller,
      formattedCurrentTxn,
      formattedTotalTxn,
      formattedTimeCost,
      formattedTimeEstimated,
      openConfig
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
    font-weight: bold;
    font-style: italic;
    font-size: 20px;
    border-radius: 8px 0px 0px 8px;
    user-select: none;
    cursor: pointer;
    background: linear-gradient(90deg,rgba(0, 0, 0, 0.80) 46%,  rgba(0, 0, 0, 0.00));
    &.breathe {
      box-shadow: 0px 0px 20px 0px rgba(179, 195, 255, 0.50);
      .test-plan-config-btn__text {
        background-image:-webkit-linear-gradient(left, #FFCB00, #F08B00); 
        background-clip: text;
        -webkit-background-clip: text; 
        -webkit-text-fill-color: transparent;
      }
    }
  }
}
</style>
