<template>
  <a-card :loading="loading" :bodyStyle="{ padding: 0 }">
    <a-list :data-source="filterDataSource">
      <template #renderItem="{ item, index }">
        <a-list-item>
          <slot :item="item" :lastItem="datasource[index + 1]"></slot>
        </a-list-item>
      </template>
    </a-list>
    <template #title>
      <div class="font-bold">{{ props.headerTitle }}</div>
    </template>
    <template #actions>
      <div @click="$emit('viewMore')">{{ props.footerTitle }}</div>
    </template>
  </a-card>
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

const filterDataSource = computed(() => {
  return props.datasource.slice(0, props.datasource.length - 1)
})
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
