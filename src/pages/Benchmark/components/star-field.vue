<template lang="pug">
.star-field-container(ref="starFieldCvs" :class="{ started: started, alreadyStart: alreadyStart, completed: controller.completed }")
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { StarField } from '../composition/star-field.js'
import { controller } from '../composition/controller.js'

export default defineComponent({
  name: 'StarField',
  setup: () => {
    const starFieldCvs = ref(null)
    const starField = new StarField()
    const started = ref(false)
    const alreadyStart = ref(false)

    onMounted(() => {
      starField.init(starFieldCvs.value)
      starField.render()
      if (controller.started) alreadyStart.value = true
      if (controller.running) starField.start()
      if (controller.isFast) starField.speedUp()
        if (controller.completed) starField.stop()
    })

    watch(
      () => controller.isFast,
      (val) => {
        if (val) starField.speedUp()
        else starField.speedDown()
      }
    )
    
    watch(() => controller.started, (val) => {
      if (val) {
        started.value = true
        setTimeout(() => {
          starField.start()
        }, 2200)
      }
    })

    watch(
      () => controller.running,
      (val) => {
        if (!val) starField.stop()
        else if (!controller.runningByStart && controller.started) starField.start()
      }
    )

    onBeforeUnmount(() => {
      if (starField) starField.dispose()
    })

    watch(() => controller.completed, (val) => {
      if (val) started.value = alreadyStart.value = false
    })

    return {
      starFieldCvs,
      alreadyStart,
      controller,
      started
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
  &.started {
    animation: starfieldStartAnimation 1 1s forwards, starfieldStartOpacity 1 0.5s forwards;
  }
  &.alreadyStart {
    top: 0;
    opacity: 1;
    transform: scale(1);
  }
  &.completed {
    opacity: 0;
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

.star-field-container.started canvas {
  animation: starfieldStartAnimationCvs 1 2s forwards;
}

.star-field-container.alreadyStart canvas {
  transform: scale(1);
}
</style>
