<template>
  <a-row class="description-item">
    <a-col :span="5">
      <slot name="label"></slot>
    </a-col>
    <a-col :span="18">
      <slot></slot>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.description-item {
  padding: 12px 0px;
  border-bottom: 1px solid #e7eaf3;
}
</style>
