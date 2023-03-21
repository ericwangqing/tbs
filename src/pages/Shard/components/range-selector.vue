<template lang="pug">
.range-selector-container
  .range-selector-wrapper
    a-input.range-selector-input(placeholder="#" v-model:value="startInput" @keyup.enter="onConfirm")
    .range-selecotr-sep
    a-input.range-selector-input(placeholder="#" v-model="endInput" @keyup.enter="onConfirm")
    .range-selector-ok-btn(@click="onConfirm")
</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'RangeSelector',
  emits: ['confirm'],
  props: {
    min: {
      type: Number,
      require: true
    },
    max: {
      type: Number,
      require: true
    }
  },
  setup: (props, { emit }) => {
    const startInput = ref('')
    const endInput = ref('')
    const clampInput = (input) => {
      const value = Number(input.value)
      if (value < props.min) {
        input.value = String(props.min)
      } else if (value > props.max) {
        input.value = String(props.max)
      }
      return input.value
    }
    const getInput = (input, fallback) => {
      const value = input.value.trim()
      if (value === '') return String(fallback)
      if (Number.isInteger(Number(value))) {
        return clampInput(input)
      } else {
        input.value = ''
        return String(fallback)
      }
    }
    const onConfirm = () => {
      let start = getInput(startInput, props.min)
      let end = getInput(endInput, props.max)
      if (Number(start) > Number(end)) {
        ;[startInput.value, endInput.value] = [end, start]
        ;[start, end] = [end, start]
      }
      emit('confirm', {start: Number(start), end: Number(end)})
    }
    return {
      startInput,
      endInput,
      onConfirm
    }
  }
})
</script>

<style scoped lang="scss">
.range-selector-container {
  position: relative;
  width: 284px;
  height: 30px;
  overflow: hidden;
  &:hover {
    overflow: unset;
  }
  .range-selector-wrapper {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 342px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.20);
      background: #4e505e;
    }
    .range-selecotr-sep {
      width: 10px;
      height: 1px;
      background: rgba(255,255,255,0.45);
      margin: 0 6px;
    }
    .range-selector-input {
      width: 124px;
      height: 30px;
      font-size: 14px;
      line-height: 30px;
      padding-left: 16px;
      padding-right: 28px;
    }
    .range-selector-ok-btn {
      position: relative;
      cursor: pointer;
      margin-left: 10px;
      width: 40px;
      height: 30px;
      background: linear-gradient(90deg,#ffcb00 3%, #f08b00 96%);
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      &::after {
        content: "OK";
        font-size: 16px;
        font-style: italic;
        font-weight: bold;
        color: #000000;
      }
      &:active::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: inherit;
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

}
</style>
