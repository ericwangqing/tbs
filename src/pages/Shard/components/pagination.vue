<template lang="pug">
.pagination-container
  a-pagination(v-bind="$attrs")
    template(v-for="(item, key, index) in $slots" :key="index" v-slot:[key])
      slot(:name="key")
</template>

<script>
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'Pagination',
  inheritAttrs: false
})
</script>

<style scoped lang="scss">
.pagination-container {
  :deep(.ant-pagination) {
    .ant-pagination-item a {
      color: rgba(255,255,255,0.65);
    }
    .ant-pagination-item:hover a {
      color: white;
    }
    .ant-pagination-item-active {
      border-color: transparent;
      background: #4e505e;
    }
    .ant-pagination-item-active a {
      color: white;
    }
    .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link {
      color: rgba(255, 255, 255, 0.85);
    }
    .ant-pagination-prev:hover .ant-pagination-item-link, .ant-pagination-next:hover .ant-pagination-item-link {
      color: white;
    }
    .ant-pagination-disabled .ant-pagination-item-link, .ant-pagination-disabled:hover .ant-pagination-item-link {
      color: #7c7e85;
      cursor: not-allowed;
    }
    .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon, .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon {
      color: white;
    }
    .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis, .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis {
      color: #7c7e85;
    }
    .ant-select {
      color: rgba(255,255,255,0.65);
    }
    .ant-select:not(.ant-select-customize-input) .ant-select-selector {
      background-color: #4e505e;
      border: none;
      border-radius: 2px;
    }
    .ant-select-arrow {
      color: #bfbfbf;
    }
    .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
      border-color: transparent;
      box-shadow: none;
    }
    .ant-pagination-options-quick-jumper {
      color: rgba(255,255,255,0.65);
    }
    .ant-pagination-options-quick-jumper input:hover {
      border-color: rgba(255,255,255,0.45);
    }
    .ant-pagination-options-quick-jumper input {
      color: rgba(255, 255, 255, 0.8);
      background-color: transparent;
      border: 1px solid rgba(255,255,255,0.45);
      border-radius: 4px;
    }
    .ant-pagination-options-quick-jumper input:focus, .ant-pagination-options-quick-jumper input-focused {
      border-color: rgba(255,255,255,0.8);
      box-shadow: none;
    }
    .ant-select-dropdown {
      background-color: #61636f;
      border-radius: 4px;
    }
    .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
      color: #ffffff;
      font-weight: 600;
      background-color: #556a99;
    }
    .ant-select-item-option-content {
      color: #ffffff;
    }
  }
}
</style>
