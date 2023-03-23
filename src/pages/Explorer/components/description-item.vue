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
  align: {
    type: String,
    default: 'center',
  },
})
</script>
<style lang="scss" scoped>
.description-item {
  min-height: 48px;
  display: flex;
  align-items: v-bind(align);
  color: white;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &.no-border {
    border-bottom: 0px;
  }
}
</style>
