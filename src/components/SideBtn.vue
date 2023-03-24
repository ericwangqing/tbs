<template lang="pug">
.side-btn(:class="[{ breathe: breathe }, side]")
  .side-btn__text Config
  .side-btn__icon
    CaretRightOutlined
  .side-btn__shadow
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { CaretRightOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'SideBtn',
  components: {
    CaretRightOutlined
  },
  props: {
    side: {
      type: String,
      default: 'right' // left || right
    },
    breathe: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="scss" scoped>
@keyframes drawer-breathe {
  0% {
    box-shadow: none;
  }
  50% {
    box-shadow: 0px 0px 20px 0px rgba(179, 195, 255, 0.50);
  }
  100% {
    box-shadow: none;
  }
}
.side-btn {
  padding: 12px 43px 10px 16px;
  color: #fff;
  font-weight: bold;
  font-style: italic;
  font-size: 20px;
  line-height: 24px;;
  border-radius: 8px 0px 0px 8px;
  user-select: none;
  cursor: pointer;
  background: linear-gradient(90deg,rgba(0, 0, 0, 0.80) 46%,  rgba(0, 0, 0, 0.00));
  display: flex;
  align-items: center;
  z-index: 80;
  .side-btn__shadow {
    position: absolute;
    top: -20px;
    left: -20px;
    right: 0;
    bottom: -20px;
    overflow: hidden;
    &::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 0;
      bottom: 20px;
      z-index: -10;
      border-radius: 8px 0 0 8px;
      // box-shadow: 0px 0px 20px 0px rgba(179, 195, 255, 0.50);
      transition: box-shadow 0.3s ease-in-out;
    }
  }
  &.breathe {
    .side-btn__text {
      background-image:-webkit-linear-gradient(left, #FFCB00, #F08B00);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .side-btn__shadow::after {
      animation: drawer-breathe 4s infinite ease-in-out;
    }
  }
  &__icon {
    margin-left: 35px;
    font-size: 16px;
    width: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: font-size 0.3s ease-in-out;
  }
  &.left {
    padding: 12px 16px 10px 43px;
    border-radius: 0 8px 8px 0;
    flex-direction: row-reverse;
    background: linear-gradient(270deg,rgba(0, 0, 0, 0.80) 46%,  rgba(0, 0, 0, 0.00));
    .side-btn {
      &__shadow {
        left: 0;
        right: -20px;
        &::after {
          left: 0;
          right: 20px;
          border-radius: 0 8px 8px 0;
        }
      }

      &__icon {
        transform: rotate(180deg);
        margin-right: 35px;
        margin-left: 0;
      }
    }
  }
  &:hover {
    .side-btn__icon {
      font-size: 19px;
    }
    .side-btn__shadow::after {
      box-shadow: 0px 0px 20px 0px rgba(179, 195, 255, 0.50);
    }
  }
  &:active {
    .side-btn__icon {
      font-size: 13px;
    }
  }
}
</style>
