<template lang="pug">
.breathe-btn(:class="btnClass")
  ATooltip(v-if="badgeHint" :title="badgeHint")
    sup.breathe-btn__badge
      slot(name="badge")
  sup.breathe-btn__badge(v-else)
    slot(name="badge")
  button(@click="handleClick" :disabled="disable")
    span.breathe-btn__content
      slot
  .breathe-btn__wrapper
  ATooltip(v-if="disableHint && disable" :title="disableHint")
    .breathe-btn__disabled-wrapper
  .breathe-btn__disabled-wrapper(v-else-if="disable")
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
  name: 'BreatheBtn',
  props: {
    size: {
      type: String,
      default: 'default' // small | default | large
    },
    bgColor: {
      type: String,
      default: '#fff'
    },
    badge: {
      type: String,
      default: ''
    },
    badgeHint: {
      type: String,
      default: ''
    },
    disable: {
      type: Boolean,
      default: false
    },
    disableHint: {
      type: String,
      default: ''
    }
  },
  setup: (props, { emit }) => {
    const handleClick = () => {
      if (props.disable) return
      emit('clk')
    }
    const btnClass = computed(() => {
      if (props.size === 'small') return 'breathe-btn-sm'
      if (props.size === 'large') return 'breathe-btn-lg'
      return ''
    })
    const btnSize = computed(() => {
      if (props.size === 'large') {
        return { defaultW: '180px', defaultH: '46px', hoverW: '186px', hoverH: '48px', activeW: '174px', activeH: '44px' }
      }
      if (props.size === 'small') {
        return { defaultW: '40px', defaultH: '32px', hoverW: '44px', hoverH: '36px', activeW: '36px', activeH: '28px' }
      }
      return { defaultW: '120px', defaultH: '40px', hoverW: '124px', hoverH: '44px', activeW: '116px', activeH: '38px' }
    })
    const fontSize = computed(() => {
      if (props.size === 'small') return '16px'
      if (props.size === 'large') return '24px'
      return '20px'
    })
    const borderRadius = computed(() => {
      if (props.size === 'large') return '8px'
      return '4px'
    })
    return {
      btnClass,
      btnSize,
      fontSize,
      borderRadius,
      handleClick
    }
  },
})
</script>

<style lang="scss" scoped>
.breathe-btn {
  position: relative;
  z-index: 0;
  width: v-bind('btnSize.defaultW');
  height: v-bind('btnSize.defaultH');
  font-size: v-bind('fontSize');
  button {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-style: italic;
    font-family: Helvetica;
    font-weight: bold;
    color: #000;
    width: 100%;
    height: 100%;
  }
  &__content {
    line-height: v-bind('fontSize');
    &:deep i {
      font-size: v-bind('fontSize');
      font-weight: normal;
      margin-right: 6px;
    }
  }
  &__wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    background: v-bind('bgColor');
    transition: all 0.3s ease-in-out;
    width: v-bind('btnSize.defaultW');
    height: v-bind('btnSize.defaultH');
    border-radius: v-bind('borderRadius');
  }
  &__disabled-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    background: rgba(255, 255, 255, 0.3);
    width: v-bind('btnSize.defaultW');
    height: v-bind('btnSize.defaultH');
    border-radius: v-bind('borderRadius');
    cursor: not-allowed;
  }
  button:hover + &__wrapper {
    width: v-bind('btnSize.hoverW');
    height: v-bind('btnSize.hoverH');
    box-shadow: 0px 0px 20px 0px rgba(179, 195, 255, 0.50);
  }
  button:active + &__wrapper {
    width: v-bind('btnSize.activeW');
    height: v-bind('btnSize.activeH');
    box-shadow: 0px 0px 20px 0px rgba(179, 195, 255, 0.50);
  }
  &__badge {
    position: absolute;
    right: -10px;
    top: -21px;
    display: flex;
    :deep i {
      font-size: 16px;
      line-height: 16px;
      color: rgba(255, 255, 255, 0.3);
    }
  }
  &-lg {
    font-weight: bold;
  }
}
</style>
