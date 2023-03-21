<template lang="pug">
.star-field-container(ref="starFieldCvs")
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

    onMounted(() => {
      starField.init(starFieldCvs.value)
      starField.render()
      if (controller.running) starField.start()
      if (controller.isFast) starField.speedUp()
    })

    watch(
      () => controller.isFast,
      (val) => {
        if (val) starField.speedUp()
        else starField.speedDown()
      }
    )

    watch(
      () => controller.running,
      (val) => {
        if (val) starField.start()
        else starField.stop()
      }
    )

    onBeforeUnmount(() => {
      if (starField) starField.dispose()
    })

    return {
      starFieldCvs,
    }
  },
})
</script>

<style lang="scss" scoped>
.star-field-container {
  width: 100%;
  height: 50%;
  position: absolute;
  top: 0;
  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>


<style lang="scss">
.star-field-container canvas {
  width: 100%;
  height: 100%;
}
</style>
