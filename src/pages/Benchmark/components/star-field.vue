<template lang="pug">
.star-field-container(ref="starFieldCvs")
</template>

<script>
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { StarField } from '../composition/star-field.js'

export default defineComponent({
  name: 'StarField',
  props: {
    isFast: {
      default: false,
      type: Boolean
    },
  },
  setup: (props) => {
    const starFieldCvs = ref(null)
    const starField = new StarField()

    onMounted(() => {
      starField.init(starFieldCvs.value)
      starField.render()
    })

    watch(
      () => props.isFast,
      (val) => {
        if (val) starField.speedUp()
        else starField.speedDown()
      }
    )
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
