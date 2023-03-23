<template lang="pug">
.blockchain-container(:class="{'blockchain-move': move}")
  .block-item(v-for="block in blocks" :key="block.number")
    Block(:block="block" :class="{'block-new': block.state === 'collect' && move}")
    .blockchain-linkline
</template>

<script>
import {defineComponent, watch, ref} from 'vue'
import {useNewBlockTrigger} from "../composition/util"
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
    const move = ref(false)
    const len = props.blocks.length
    const lastNumber = len <= 1 ? -1 : props.blocks[props.blocks.length - 1]?.number
    const lastBlock = useNewBlockTrigger(() => props.blocks, lastNumber)
    watch(lastBlock, () => {
      if (lastBlock.value) {
        move.value = true
        setTimeout(() => move.value = false, 500)
      }
    }, {immediate: true})
    return {
      move
    }
  }
})
</script>

<style scoped lang="scss">
.blockchain-container {
  position: absolute;
  right: 0;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .block-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .blockchain-linkline {
    height: 4px;
    width: 20px;
    opacity: 0.1;
    background: #ffffff;
  }
}

.block-new {
  animation: scale 0.5s ease-in-out forwards;
}

.blockchain-move {
  animation: move 0.5s ease-in-out forwards;
}

@keyframes scale {
  0% {
    transform: scale(0.7);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes move {
  0% {
    transform: translateX(220px);
  }
  100% {
    transform: translateX(0px);
  }
}

</style>
