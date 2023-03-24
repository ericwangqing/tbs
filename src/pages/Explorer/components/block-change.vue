<template lang="pug">
.block-change
  a-button(type="link", @click="change(1)")
    left-outlined(style="color:#FFAE00")
  router-link.mx-8px(v-if="routerAble", :to="`/explorer/block/${blockNumber}`",style="color:#FFAE00") {{ blockNumber }}
  span.mx-8px(v-else) {{ blockNumber }}
  a-button(type="link", @click="change(-1)")
    right-outlined(style="color:#FFAE00")
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

<style lang="scss" scoped>
.block-change .ant-btn {
  padding: 4px 0;
}
</style>
