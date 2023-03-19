<template>
  <div>
    <left-outlined @click="change(1)" /><router-link
      v-if="routerAble"
      class="mx-8px"
      :to="`/explorer-block/${blockNumber}`"
      >{{ blockNumber }}</router-link
    ><span v-else class="mx-8px">{{ blockNumber }}</span
    ><right-outlined @click="change(-1)" />
  </div>
</template>
<script setup>
import { RightOutlined, LeftOutlined } from '@ant-design/icons-vue'
const props = defineProps(['blockNumber', 'routerAble'])
const emit = defineEmits(['changeBlockNumber'])

function change(direction) {
  if (props.blockNumber === 0) {
    return
  }
  emit('changeBlockNumber', props.blockNumber + direction)
}
</script>
