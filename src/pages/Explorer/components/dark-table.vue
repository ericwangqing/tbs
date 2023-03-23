<template lang="pug">
.dark-table-container
  a-table(v-bind="$attrs")
    template(v-for="(item, key, index) in $slots" :key="index" v-slot:[key]="slotScope")
      slot(:name="key" v-bind="slotScope")
</template>
<script>
import { defineComponent } from 'vue'
export default {
  inheritAttrs: false,
}
</script>
<script setup></script>
<style lang="scss" scoped>
.dark-table-container {
  :deep(.ant-table-wrapper) {
    .ant-table {
      background-color: transparent;
      color: white;
    }
    table {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #4e505e;
      .ant-table-thead {
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.5),
          rgba(0, 0, 0, 0.2)
        );

        .ant-table-cell {
          background-color: transparent;
          border-bottom: 0px;
          padding: 12px 16px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }
      }

      .ant-table-tbody {
        .ant-table-cell {
          background-color: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
