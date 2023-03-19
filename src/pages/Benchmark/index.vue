<template lang="pug">
.cockpit
  RoadLine
</template>

<script>
import { defineComponent, inject, toRefs, ref, onMounted } from 'vue'
import RoadLine from './components/road-line.vue'

export default defineComponent({
  name: 'Cockpit',
  components: {
    RoadLine
  },
  setup: () => {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
.cockpit {
  width: 100%;
  height: 100%;
}
</style>
  
