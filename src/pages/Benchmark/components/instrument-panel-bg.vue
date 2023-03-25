<template lang="pug">
.instrument-panel-bg
  svg.instrument-panel-bg--ring(:class="{ burning: isBurning }" width='1661px', height='390px', viewBox='0 0 1661 390', version='1.1', xmlns='http://www.w3.org/2000/svg', xlink='http://www.w3.org/1999/xlink')
    defs
      linearGradient(x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-ring")
        stop(stop-color="#FB6555" offset="0%")
        stop(stop-color="#A20D0A" offset="10.6570797%")
        stop(stop-color="#331F1F" offset="100%")
    g(stroke='url(#linearGradient-ring)', stroke-width='2', fill='none', fill-rule='evenodd')
      path(d='M830.344735,1 C903.870661,1 970.546813,23.8958316 1019.37788,61.042182 C1232.91306,70.0295511 1442.68768,93.9805163 1648.69778,132.897765 C1652.22524,133.564134 1655.14866,135.597205 1657.02362,138.345549 C1658.89858,141.093893 1659.72508,144.557511 1659.058,148.088659 L1659.058,148.088659 L1614.01713,381.70382 C1613.60882,383.821618 1612.4779,385.645663 1610.90987,386.940259 C1609.34183,388.234854 1607.33668,389 1605.17988,389 L1605.17988,389 L46.889972,389 C44.6752393,389 42.6251399,388.194248 41.0424988,386.841568 C39.4598576,385.488888 38.3446747,383.58928 37.9997748,381.401568 L37.9997748,381.401568 L1.16017888,147.726695 C0.614619691,144.26619 1.48934841,140.900775 3.36041736,138.234562 C5.23148626,135.568348 8.09889534,133.601337 11.538697,132.93764 C216.091643,93.4698785 426.196296,69.3866499 641.823716,60.6834999 C690.572894,23.7483349 757.056007,1 830.344735,1 L830.344735,1 Z')

  svg.instrument-panel-bg--main(:class="{ burning: isBurning }" width='1661px', height='390px', viewBox='0 0 1661 390', version='1.1', xmlns='http://www.w3.org/2000/svg', xlink='http://www.w3.org/1999/xlink')
    defs
      linearGradient(x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-main-ring")
        stop(stop-color="#FFCB00" offset="0%")
          animate(ref="borderAniToRed1" attributeName="stop-color" :values="borderAniToRed1Vals" :dur="dur" repeatCount="1" begin="indefinite" fill="freeze")
        stop(stop-color="#F08B00" offset="100%")
          animate(ref="borderAniToRed2" attributeName="stop-color" :values="borderAniToRed2Vals" :dur="dur" repeatCount="1" begin="indefinite" fill="freeze")
      linearGradient(x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-main")
        stop(stop-color="#3C2F26" stop-opacity="0.85" offset="0%")
          animate(ref="maskAniToRed1" attributeName="stop-color" :values="maskAniToRed1Vals" :dur="dur" repeatCount="1" begin="indefinite" fill="freeze")
        stop(stop-color="#20170F" offset="100%")
          animate(ref="maskAniToRed2" attributeName="stop-color" :values="maskAniToRed2Vals" :dur="dur" repeatCount="1" begin="indefinite" fill="freeze")
    g(stroke='url(#linearGradient-main-ring)', stroke-width='2', fill='url(#linearGradient-main)', fill-rule='evenodd')
      path(d='M830.344735,1 C903.870661,1 970.546813,23.8958316 1019.37788,61.042182 C1232.91306,70.0295511 1442.68768,93.9805163 1648.69778,132.897765 C1652.22524,133.564134 1655.14866,135.597205 1657.02362,138.345549 C1658.89858,141.093893 1659.72508,144.557511 1659.058,148.088659 L1659.058,148.088659 L1614.01713,381.70382 C1613.60882,383.821618 1612.4779,385.645663 1610.90987,386.940259 C1609.34183,388.234854 1607.33668,389 1605.17988,389 L1605.17988,389 L46.889972,389 C44.6752393,389 42.6251399,388.194248 41.0424988,386.841568 C39.4598576,385.488888 38.3446747,383.58928 37.9997748,381.401568 L37.9997748,381.401568 L1.16017888,147.726695 C0.614619691,144.26619 1.48934841,140.900775 3.36041736,138.234562 C5.23148626,135.568348 8.09889534,133.601337 11.538697,132.93764 C216.091643,93.4698785 426.196296,69.3866499 641.823716,60.6834999 C690.572894,23.7483349 757.056007,1 830.344735,1 L830.344735,1 Z')

</template>

<script>
import { defineComponent, watch, ref, nextTick } from 'vue'

export default defineComponent({
  name: 'InstrumentPanelBg',
  props: {
    isBurning: {
      type: Boolean,
      default: false
    }
  },
  setup: (props) => {
    const borderAniToRed1 = ref(null)
    const borderAniToRed2 = ref(null)
    const borderAniToRed1Vals = ref('#FFCB00;#FB6555')
    const borderAniToRed2Vals = ref('#F08B00;#A20D0A')
    
    const maskAniToRed1 = ref(null)
    const maskAniToRed2 = ref(null)
    const maskAniToRed1Vals = ref('#262D3C;#3C2F26')
    const maskAniToRed2Vals = ref('#0F1220;#20170F')

    const dur = ref('0.4s')
 
    watch(() => props.isBurning, (val) => {
      if (val) {
        borderAniToRed1Vals.value = '#FFCB00;#FB6555'
        borderAniToRed2Vals.value = '#F08B00;#A20D0A'

        maskAniToRed1Vals.value = '#262D3C;#3C2F26'
        maskAniToRed2Vals.value = '#0F1220;#20170F'

        dur.value = '0.4s'
      } else {
        borderAniToRed1Vals.value = '#FB6555;#FFCB00'
        borderAniToRed2Vals.value = '#A20D0A;#F08B00'

        maskAniToRed1Vals.value = '#3C2F26;#262D3C'
        maskAniToRed2Vals.value = '#20170F;#0F1220'

        dur.value = '0.2s'
      }
      nextTick(() => {
        borderAniToRed1.value.beginElement()
        borderAniToRed2.value.beginElement()

        maskAniToRed1.value.beginElement()
        maskAniToRed2.value.beginElement()
      })
    })

    return {
      borderAniToRed1,
      borderAniToRed2,
      borderAniToRed1Vals,
      borderAniToRed2Vals,

      maskAniToRed1,
      maskAniToRed2,
      maskAniToRed1Vals,
      maskAniToRed2Vals,

      dur
    }
  }
})
</script>

<style lang="scss" scoped>
@keyframes burningBg {
  0% {
    filter: drop-shadow(0px 0px 0px #ffc0a8);
  }
  50% {
    filter: drop-shadow(0px 0px 20px #ffc0a8);
  }
  100% {
    filter: drop-shadow(0px 0px 0px #ffc0a8);
  }
}

@keyframes shakeBg {
  0% {
    width: 1661px;
    height: 390px;
  }
  50% {
    top: -0.5px;
    left: -0.5px;
    width: calc(100% - 1px);
    height: calc(100% - 1px);
  }
  100% {
    width: 1661px;
    height: 390px;
  }
}

.instrument-panel-bg {
  position: relative;
  width: 1661px;
  height: 390px;
  &--main, &--ring {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    &.burning {
      animation: shakeBg ease-in-out infinite 0.04s;
    }
  }
  &--ring.burning {
    animation: burningBg ease-in-out infinite 4s, shakeBg ease-in-out infinite 0.04s;
  }
}
</style>
