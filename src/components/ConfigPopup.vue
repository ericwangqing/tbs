<template lang="pug">
.config-popup(:class="{ visible: visible }")
  .config-popup--mask
  .config-popup--container
    .config-popup--container-header
      slot(name="header")
    .config-popup--container-main(ref="popupMain", :class="{ needScroll: needScroll }")
      slot(name="main")
  .config-popup--footer
    .operation-btns
      slot(name="footer")
    AButton.back-btn.bottom-animated(type="text" @click="handleBack")
      span Back
      img(:src="BackSvg")

SideBtn.config-btn(@click="openConfig", :breathe="btnEmphasize", :side="configBtnSide" :class="configBtnSide")
</template>

<script>
import { computed, defineComponent, nextTick, ref, onMounted, onBeforeUnmount } from 'vue'
import BackSvg from '@/assets/back-icon.svg'
import SideBtn from './SideBtn.vue'
export default defineComponent({
  name: 'ConfigPopup',
  components: {
    SideBtn
  },
  props: {
    configBtnTop: {
      type: String,
      default: '510px'
    },
    configBtnMargin: {
      type: String,
      default: '0'
    },
    configBtnSide: {
      type: String,
      default: 'right' // right | left
    },
    btnEmphasize: {
      type: Boolean,
      default: false
    }
  },
  setup: (props, { emit }) => {
    const popupMain = ref(null)
    const visible = ref(false)
    const needScroll = ref(false)

    const calcNeedScroll = async () => {
      await nextTick()
      if (!popupMain.value) needScroll.value = false;
      needScroll.value = popupMain.value.scrollHeight > popupMain.value.clientHeight
    }

    const handleBack = () => {
      visible.value = false
      emit('close')
    }

    const openConfig = () => {
      visible.value = true
      emit('show')
    }

    onMounted(() => {
      calcNeedScroll()
      window.addEventListener('resize', calcNeedScroll)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', calcNeedScroll)
    })

    return {
      popupMain,
      needScroll,
      BackSvg,
      visible,
      handleBack,
      openConfig,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/theme/mixin.scss';
@mixin btnSize() {
  width: 180px;
  height: 46px;
  border-radius: 8px;
}

@keyframes floatUp {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
.config-popup {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  color: #fff;
  transition: transform 0.3s ease-in-out;
  transform: translate3d(0, 100%, 0);
  &.visible {
    transform: translate3d(0, 0, 0);
  }
  .ant-btn {
    color: #fff;
    font-size: 24px;
    @include btnSize;
    padding: 0;
    i {
      font-size: 24px;
      margin-right: 16px;
    }
    &:not(.ant-btn-text):after {
      display: none;
    }
  }

  &--mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(22, 24, 30, 0.80) 0%,  rgba(0, 0, 0, 0.95));
  }
  &--container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 1800px;
    height: calc(100vh - 130px);
    margin: 0 auto;
    background: #212435;
    border-radius: 8px;
    // animation: floatOut 0.2s 1;
    transform-origin: right center;
    padding-bottom: 119px;
    display: flex;
    flex-direction: column;
    &-header {
      display: flex;
      justify-content: space-between;
      padding: 26px 40px 29px;
    }
    &-main {
      max-height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 20px;
      padding: 0 40px;
      overflow-y: auto;
      &.needScroll {
        padding-right: 12px;
      }
      @include scrollbar(#3a3d4c, #4e505d);
    }
  }
  &--footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 135px;
    z-index: 1;
    padding: 0 60px 0 100px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.00),  rgba(0, 0, 0, 0.80) 22%,  #000000 66%);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ant-btn-text.bottom-animated {
      position: relative;
      span {
        font-family: PingFangSC, PingFangSC-Semibold;
      }
    }
    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 2px;
      img {
        margin-left: 10px;
      }
    }
  }
}
.config-btn {
  position: fixed;
  right: v-bind('configBtnMargin');
  top: v-bind('configBtnTop');
  &.left {
    right: unset;
    left: v-bind('configBtnMargin');
  }
}
</style>
