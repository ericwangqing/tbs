<template lang="pug">
.star-field-container(ref="starFieldCvs" :class="starFieldStateCls")
</template>

<script>
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { StarField } from '../composition/star-field.js'
import { controller } from '../composition/controller.js'

export default defineComponent({
  name: 'StarField',
  setup: () => {
    const starFieldCvs = ref(null)
    const starField = new StarField()
    const needAnimate = ref(false)

    onMounted(() => {
      starField.init(starFieldCvs.value)
      starField.render()
      if (controller.state === 'preparing' || controller.state === 'running') starField.start()
      else starField.stop()
      if (controller.tps >= 100000) starField.speedUp()
    })

    watch(
      () => controller.tps,
      (val) => {
        if (val >= 100000) starField.speedUp()
        else starField.speedDown()
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
      starFieldStateCls
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
    animation: starfieldStartAnimation 1 1s 5.2s forwards, starfieldStartOpacity 1 0.5s 5.2s forwards;
  }
  &.running {
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

.star-field-container.startAnimate canvas {
  animation: starfieldStartAnimationCvs 1 2s 5.2s forwards;
}

.star-field-container.running canvas {
  transform: scale(1);
}
</style>
