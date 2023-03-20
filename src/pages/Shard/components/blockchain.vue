<template lang="pug">
.blockchain-container
  Block.block-item(
    v-for="(block, index) in blocks"
    v-show="!block.$hide"
    :block="block"
    :key="block.$key"
    :style="[getBlockStyle(index)]"
  )
</template>

<script>
import {defineComponent, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRaw, watch} from 'vue'
import Block from './block.vue'

export default defineComponent({
  name: 'Blockchain',
  components: {Block},
  props: {
    blocks: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  setup: (props) => {
    const blocks = props.blocks
    const getBlockStyle = (index) => {
      if (blocks.length < 6) {
        index += 7 - blocks.length
      }
      const ret = {
        transform: `translateX(${index * (200 + 20)}px)`
      }
      if (index === 6) {
        ret.transform = ret.transform + ` scale(0.7)`
      }
      return ret
    }
    return {
      getBlockStyle,
    }
  }
})
</script>

<style scoped lang="scss">
.blockchain-container {
  .block-item {
    position: absolute;
    transition: transform 0.5s ease;
  }
}

</style>
