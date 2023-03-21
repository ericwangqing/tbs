<template lang="pug">
.count-down
  .count-down--content(:class="{ show: showThree }") 3
  .count-down--content(:class="{ show: showTwo }") 2
  .count-down--content(:class="{ show: showOne }") 1
  .count-down--content(:class="{ show: showGo }") Go!
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export default defineComponent({
  name: 'Countdown',
  setup: () => {
    const showThree = ref(false)
    const showTwo = ref(false)
    const showOne = ref(false)
    const showGo = ref(false)

    const sleep = (time) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve('done'), time)
      })
    }

    onMounted(async () => {
      showThree.value = true
      await sleep(1300)
      showThree.value = false
      showTwo.value = true
      await sleep(1300)
      showTwo.value = false
      showOne.value = true
      await sleep(1500)
      showOne.value = false
      showGo.value = true
      await sleep(800)
      showGo.value = false
    })

    return {
      showThree,
      showTwo,
      showOne,
      showGo
    }
  },
})
</script>

<style lang="scss" scoped>
@keyframes countdownShow {
  0% {
    font-size: 60px;
    line-height: 216px;
  }
  100% {
    font-size: 180px;
    line-height: 216px;
  }
}

.count-down {
  position: absolute;
  top: 182px;
  right: 0;
  left: 0;
  margin: 0 auto;
  width: min-content;
  font-size: 180px;
  font-family: Helvetica;
  font-weight: bold;
  font-style: italic;
  letter-spacing: 9px;
  color: rgba(#fff, 0.65);
  &--content {
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    line-height: 216px;
    &.show {
      opacity: 1;
      animation: countdownShow 1 0.3s ease-in-out forwards;
    }
  }
}
</style>
