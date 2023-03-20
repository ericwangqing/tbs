<template lang="pug">
a-card(:loading="props.loading", :bodyStyle="{ padding: 0 }")
  a-list(:data-source="props.datasource")
    template(#renderItem="{ item, index }")
      a-list-item
        slot(:item="item")
  template(#title)
    div.font-bold {{ props.headerTitle }}
  template(#actions)
    div(@click="$emit('viewMore')") {{ props.footerTitle }}  
</template>
<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps([
  'datasource',
  'headerTitle',
  'footerTitle',
  'loading',
])

defineEmits(['viewMore'])
</script>
<style lang="scss">
.ant-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  .ant-card-body {
    height: 100%;
    flex: 1;
    height: 0px;
    overflow-y: auto;
  }
}
</style>
