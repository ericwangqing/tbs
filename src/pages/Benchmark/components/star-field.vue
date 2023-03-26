<template lang="pug">
.star-field-container(ref="starFieldCvs" :class="starFieldStateCls")
.hash-move-window(v-show="hashFly")
  .hash-move(v-for="hashObj in hashList" :key="hashObj.hash" :style="{ transform: hashObj.transform, opacity: hashObj.opacity }") {{ hashObj.hash }}
  .block-move(v-for="blockObj in blockList" :key="blockObj.hash" :style="{ transform: blockObj.transform, opacity: blockObj.opacity }")
    img(:src="blockObj.status === 'minting' ? mintingImg : confirmedImg" :class="blockObj.status")
  img(:src="mintingImg" style="position: fixed; top: -1000px;")
  img(:src="confirmedImg" style="position: fixed; top: -1000px;")
</template>

<script>
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { StarField } from '../composition/star-field.js'
import { controller } from '../composition/controller.js'
import { getAddressKeyString, randomBetween } from '../composition/util'
import mintingImg from '@/assets/minting.png'
import confirmedImg from '@/assets/confirmed.png'

export default defineComponent({
  name: 'StarField',
  setup: () => {
    const starFieldCvs = ref(null)
    const starField = new StarField()
    const needAnimate = ref(false)
    const hashFly = ref(false)
    const hashList = ref([])
    const blockList = ref([])

    onMounted(() => {
      starField.init(starFieldCvs.value)
      starField.render()
      if (controller.state === 'running') starField.start()
      else starField.stop()
      if (controller.tps >= controller.fastThreshold) starField.speedUp()
    })

    const getOffset = () => {
      const side = Math.random() < 0.5
      return {
        offsetY: randomBetween(-15, -1, 1),
        offsetX: side ? randomBetween(200, 600, 20) : randomBetween(-600, -200, 20),
        offsetXASide: side ? randomBetween(-600, -200, 20) : randomBetween(200, 600, 20)
      }
    }

    const setElementPerspectivePos = (list, offsetZFrom, offsetZTo, offsetY, offsetX, rotateY, isBlock) => {
      list.push({
        hash: getAddressKeyString(),
        opacity: 0,
        transform: `translateZ(${offsetZFrom}) translateY(${offsetY}) translateX(${offsetX}) rotateY(${rotateY})`,
        status: isBlock ? 'minting' : undefined
      })
      setTimeout(() => {
        if (list[0]) {
          list[0].transform = `translateZ(${offsetZTo}) translateY(${offsetY}) translateX(${offsetX}) rotateY(${rotateY})`
          list[0].opacity = isBlock ? 0.65 : 0.85
        }
      }, 300)
      if (isBlock) {
        setTimeout(() => {
          if (list[0]) list[0].status = 'confirmed'
        }, 800)
      }
    }

    const startFly = () => {
      hashFly.value = true
      const { offsetY, offsetX, offsetXASide } = getOffset()
      const hashDirection = offsetX / Math.abs(offsetX)
      const blockDirection = offsetXASide / Math.abs(offsetXASide)
      setElementPerspectivePos(hashList.value, '-1500px', '500px', `${offsetY}vh`, `${offsetX}px`, `${-hashDirection * 90}deg`)
      setElementPerspectivePos(blockList.value, '-1500px', '200px', `${offsetY}vh`, `${offsetXASide}px`, `${blockDirection * 5}deg`, true)

      setTimeout(() => {
        hashList.value.splice(0, 1)
        blockList.value.splice(0, 1)
        if (!hashFly.value || controller.state !== 'running') return
        startFly()
      }, 2000)
    }

    const stopFly = () => {
      hashFly.value = false
    }

    watch(
      () => controller.tps,
      (val) => {
        if (val >= controller.fastThreshold) {
          starField.speedUp()
          if (!hashFly.value) startFly()
        } else {
          starField.speedDown()
          stopFly()
        }
      }
    )
    
    watch(() => controller.state, (val, oldVal) => {
      if (val === 'preparing') {}
      else if (val === 'running') {
        starField.start()
        if (oldVal === 'preparing') needAnimate.value = true
      } else {
        starField.stop()
        needAnimate.value = false
        stopFly()
      }
    })

    onBeforeUnmount(() => {
      if (starField) starField.dispose()
    })

    const starFieldStateCls = computed(() => {
      return [controller.state, needAnimate.value ? 'startAnimate' : '']
    })

    return {
      starFieldCvs,
      controller,
      starFieldStateCls,
      hashList,
      hashFly,
      blockList,
      mintingImg,
      confirmedImg
    }
  },
})
</script>

<style lang="scss" scoped>
@keyframes starfieldStartOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes starfieldStartAnimation {
  0% {
    top: 7%;
    transform: scale(1, 1.68);
  }
  100% {
    top: 0;
    transform: scale(1, 1);
  }
}
.star-field-container {
  position: absolute;
  width: 100%;
  height: 50%;
  top: 7%;
  transform: scale(1.68);
  transform-origin: 50% 0;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  &.startAnimate {
    animation: starfieldStartAnimation 1 1s forwards, starfieldStartOpacity 1 0.5s forwards;
  }
  &.running, &.pausing {
    top: 0;
    opacity: 1;
    transform: scale(1);
  }
  &.completed {
    opacity: 0;
  }
}
.hash-move-window {
  position: absolute;
  width: 100%;
  height: 50%;
  top: 0;
  color: #fff;
  font-size: 40px;
  font-weight: bold;
  perspective-origin: center bottom;
  perspective: 10vw;
  .hash-move, .block-move {
    position: absolute;
    top: 40%;
    left: calc(50% - 450px);
    width: 900px;
    text-align: center;
    // transform: translateZ(-500px) translateY(-15vh) translateX(40vw) rotateY(-90deg);
    opacity: 0;
    transition: all 1.5s;
  }
  .block-move {
    height: 200px;
    width: 200px;
    left: calc(50% - 150px);
    z-index: 999;
    transition: all 1.5s, opacity 0.5s;
    img {
      width: 100%;
    }
  }
}
</style>


<style lang="scss">
@keyframes starfieldStartAnimationCvs {
  0% {
    transform: scale(1.68, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
.star-field-container canvas {
  width: 100%;
  height: 100%;
  transform: scale(1, 1.68);
}

.star-field-container.startAnimate canvas {
  animation: starfieldStartAnimationCvs 1 2s forwards;
}

.star-field-container.running canvas, .star-field-container.pausing canvas {
  transform: scale(1);
}
</style>
