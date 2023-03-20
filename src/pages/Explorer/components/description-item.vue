<template lang="pug">
a-row.description-item
  a-col(:span="props.labelSpan")
    slot(name="label")
  a-col(:span="props.contentSpan")
    slot  
</template>
<script setup>
const props = defineProps({
  labelSpan: {
    type: Number,
    default: 5,
  },
  contentSpan: {
    type: Number,
    default: 18,
  },
})
</script>
<style lang="scss" scoped>
.description-item {
  padding: 12px 0px;
  border-bottom: 1px solid #e7eaf3;
}
</style>
