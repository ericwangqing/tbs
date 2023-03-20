<template lang="pug">
div
  a-button(type="link", @click="change(1)")
    left-outlined
  router-link.mx-8px(v-if="routerAble", :to="`/explorer-block/${blockNumber}`") {{ blockNumber }}
  span.mx-8px(v-else) {{ blockNumber }}
  a-button(type="link", @click="change(-1)")
    right-outlined
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
