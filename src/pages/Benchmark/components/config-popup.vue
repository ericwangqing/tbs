<template lang="pug">
.config-popup(:class="{ visible: visible }")
  .config-popup--mask
  .config-popup--wrapper
    .config-popup--wrapper-header
      .title
        i Config
        span （
        i {{ controller.testList.length }}
        span ）
      ASpace(:size="40")
        AButton.create-btn(@click="handleCreate")
          i.iconfont.icon-create
          span Create
        AInputSearch(allowClear)
    .config-popup--wrapper-main(ref="cardList", :class="{ needScroll: needScroll }")
      ConfigCard(
        v-for="item in controller.testList", :key="item.id", :data="item", :selectedId="selectedConfigId"
        @select="selectedConfigId = item.id"
      )
  .config-popup--footer
    ASpace(:size="140")
      ASpace(:size="50")
        ABadge.config-btn--badged(count="?" :title="'Re execute'" :offset="[3, -12]")
          AButton.execute-btn(@click="handleExecute")
            i.iconfont.icon-Execute
            span Execute
          .btn-wrapper.execute-btn-wrapper
        ABadge.config-btn--badged(count="?" :title="'Replays the records generated when this test configuration was last executed'" :offset="[3, -12]")
          AButton.playback-btn(@click="handlePlayback")
            i.iconfont.icon-zhongzhi
            span Playback
          .btn-wrapper
          ATooltip(v-if="!selectedTest.result" title="This test configuration has not yet executed, cannot playback!")
            .btn-disabled-wrapper
      ASpace(:size="40")
        AButton.download-btn(type="text" @click="handleDownload")
          i.iconfont.icon-download
          span Download
        AButton.contrast-btn(type="text" @click="handleContrast")
          i.iconfont.icon-contrast
          span Contrast
        AButton.setting-btn(type="text" @click="handleEdit")
          i.iconfont.icon-setting
          span Setting
    AButton.back-btn(type="text" @click="handleBack")
      span Back
      img(:src="BackSvg")

.config-btn(@click="openConfig", :class="{ breathe: controller.state === 'stopped' || controller.state === 'completed' }")
  .config-btn__text Config
  CaretRightOutlined.config-btn__icon
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import BackSvg from '@/assets/back-icon.svg'
import { controller } from '../composition/controller.js'
import { CaretRightOutlined } from '@ant-design/icons-vue'

import ConfigCard from './config-card.vue'

export default defineComponent({
  name: 'ConfigPopup',
  components: {
    ConfigCard,
    CaretRightOutlined
  },
  props: {
    configBtnTop: {
      type: String,
      default: '510px'
    }
  },
  emits: ['playback', 'execute'],
  setup: (props, { emit }) => {
    const cardList = ref(null)
    const selectedConfigId = ref('1')
    const visible = ref(false)

    const needScroll = computed(() => {
      if (!cardList.value) return false;
      return cardList.value.scrollHeight > cardList.value.clientHeight
    })

    const handleCreate = () => {

    }

    const handlePlayback = () => {
      emit('playback', selectedConfigId.value)
      handleBack()
    }

    const handleExecute = () => {
      emit('execute', selectedConfigId.value)
      handleBack()
    }

    const handleDownload = () => {
      
    }

    const handleContrast = () => {
      
    }

    const handleEdit = () => {
      
    }

    const handleBack = () => {
      visible.value = false
    }

    const openConfig = () => {
      visible.value = true
    }

    const selectedTest = computed(() => {
      return controller.testList.find((test) => test.id === selectedConfigId.value)
    })

    return {
      cardList,
      controller,
      needScroll,
      selectedConfigId,
      BackSvg,
      visible,
      selectedTest,
      handleCreate,
      handlePlayback,
      handleExecute,
      handleDownload,
      handleContrast,
      handleEdit,
      handleBack,
      openConfig,
    }
  },
})
</script>

<style lang="scss" scoped>
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
  position: absolute;
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
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(22, 24, 30, 0.80) 0%,  rgba(0, 0, 0, 0.95));
  }
  &--wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 1800px;
    height: calc(100vh - 130px);
    margin: 0 auto;
    background: #3a3d4c;
    border-radius: 8px;
    // animation: floatOut 0.2s 1;
    transform-origin: right center;
    padding-bottom: 119px;
    display: flex;
    flex-direction: column;
    &-header {
      display: flex;
      justify-content: space-between;
      padding: 26px 40px;
      .title {
        font-size: 34px;
        line-height: 41px;
        font-weight: bold;
      }
      .ant-input-search {
        width: 280px;
        height: 50px;
        &:deep {
          .ant-input-affix-wrapper {
            line-height: 40px;
            background: rgba(#000, 0.1);
            border-radius: 8px 0 0 8px;
            padding-left: 16px;
            border: 1px solid rgba(255, 255, 255, 0.45);
            border-right: none;
            box-shadow: none;
          }
          .ant-input-suffix svg {
            color: rgba(#fff, 0.15);
            font-size: 12px;
          }
          input {
            background: transparent;
            color: #fff;
            font-size: 18px;
          }
          .ant-input-group-addon {
            background: transparent;
            left: 0;
          }
          button.ant-btn.ant-input-search-button {
            height: 50px;
            width: 64px;
            background: rgba(#000, 0.1);
            border-radius: 0 8px 8px 0;
            border: 1px solid rgba(255, 255, 255, 0.45);
            border-left: none;
            svg {
              color: #fff;
              font-size: 22px;
            }
          }
        }
      }
      .create-btn {
        background: rgba(255, 255, 255, 0.10);
        border: 1px solid #979797;
        height: 50px;
        i {
          margin-right: 14px;
          transition: font-size 0.3s ease-in-out;
          width: 24px;
          height: 24px;
          display: inline-block;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.20);
        }
        &:active i {
          font-size: 20px;
        }
      }
    }
    &-main {
      max-height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 40px;
      overflow-y: auto;
      &.needScroll {
        padding-right: 20px;
        margin-right: 8px;
      }
      &::-webkit-scrollbar {
        width: 12px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #4e505d;
      }
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

    .config-btn--badged {
      &:deep .ant-badge-count {
        width: 14px;
        height: 14px;
        background: rgba(#fff, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
        min-width: unset;
        font-size: 12px;
        border: none;
        box-shadow: none;
        cursor: pointer;
      }
      .btn-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        @include btnSize;
        background: #fff;
        transition: all 0.3s ease-in-out;
        &.execute-btn-wrapper {
          background: linear-gradient(90deg,#ffcb00 3%, #f08b00 96%);
        }
      }
      .ant-btn {
        color: #000;
        font-family: Helvetica;
        font-weight: bold;
        font-style: italic;
        background: transparent;
        border: none;
        i {
          margin-right: 6px;
        }
        &:hover, &:active {
          & + .btn-wrapper {
            height: 48px;
            width: 186px;
            box-shadow: 0px 0px 20px 0px rgba(179,195,255,0.50);
          }
        }
        &:active {
          & + .btn-wrapper {
            height: 44px;
            width: 174px;
          }
        }
        &::after {
          display: none;
        }
      }
      .btn-disabled-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        background: rgba(255, 255, 255, 0.3);
        @include btnSize;
        cursor: not-allowed;
      }
    }
    .ant-btn-text {
      position: relative;
      span {
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
      }
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 2px;
        background: #fff;
        transition: width 0.3s ease-in-out;
      }
      &:hover {
        &::after {
          width: 100%;
        }
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
  right: 0;
  top: v-bind('configBtnTop');
  padding: 12px 46px 10px 16px;
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
  &.breathe {
    box-shadow: 0px 0px 20px 0px rgba(179, 195, 255, 0.50);
    .config-btn__text {
      background-image:-webkit-linear-gradient(left, #FFCB00, #F08B00);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  &__icon {
    margin-left: 35px;
  }
}
</style>
