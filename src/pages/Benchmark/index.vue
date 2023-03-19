<template lang="pug">
.cockpit(@mousedown="isFast = true", @mouseup="isFast = false")
  StarField(:isFast="isFast")
  RoadLine(:isFast="isFast")
</template>

<script>
import { defineComponent, inject, toRefs, ref, onMounted } from 'vue'
import RoadLine from './components/road-line.vue'
import StarField from './components/star-field.vue'

export default defineComponent({
  name: 'Cockpit',
  components: {
    RoadLine,
    StarField
  },
  setup: () => {
    const isFast = ref(false)
    return {
      isFast
    }
  }
})
</script>

<style lang="scss" scoped>
.cockpit {
  width: 100%;
  height: 100%;
  position: relative;
  background: #212435;
}
</style>
  
