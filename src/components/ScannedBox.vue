<template lang="pug">
.scanned-box
  .border-wrapper.left.top
  .border-wrapper.right.top(v-if="!noRightWrapper")
  .border-wrapper.left.bottom
  .border-wrapper.right.bottom(v-if="!noRightWrapper")
  slot
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
name: 'ScannedBox',
props: {
  noRightWrapper: {
    type: Boolean,
    default: false
  }
},
setup: () => {
  return {}
},
})
</script>

<style scoped lang="scss">
.scanned-box {
  background: linear-gradient(180deg,rgba(0,0,0,0.50), rgba(0,0,0,0.20));
  border: 1px solid;
  border-image: linear-gradient(90deg, rgba(255,203,0,0.50) 3%, rgba(240,139,0,0.50) 96%) 1 1;
  box-shadow: 0px 0px 40px 0px rgba(240,139,0,0.50) inset;
  .border-wrapper {
    position: absolute;
    margin: 0;
    &.top, &.bottom {
      &::before {
        position: absolute;
        content: '';
        height: 4px;
        width: 24px;
        background: #ffd300;
      }
      &::after {
        position: absolute;
        content: '';
        height: 24px;
        width: 4px;
        background: #ffd300;
      }
    }
    &.top {
      top: 0;
      &::before, &::after {
        top: -4px;
      }
      &::after {
        top: -4px;
      }
    }
    &.bottom {
      bottom: 0;
      &::before, &::after {
        bottom: -4px;
      }
    }
    &.left {
      left: 0;
      &::before, &::after {
        left: -4px;
      }
    }
    &.right {
      right: 0;
      &::before, &::after {
        right: -4px;
      }
    }
  }
}
</style>