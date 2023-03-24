<template lang="pug">
.config-popup(:class="{ visible: visible }")
  .config-popup--mask
  .config-popup--container
    .config-popup--container-header
      .title(v-if="mode === ''")
        i Config
        span （
        i {{ controller.testList.length }}
        span ）
      .title(v-else-if="mode === 'create'")
        i Create
      .title(v-else)
        i Setting
      ASpace(:size="40" v-if="mode === ''")
        AButton.create-btn(@click="handleCreate")
          i.iconfont.icon-create
          span Create
        AInputSearch(allowClear size="large")
    .config-popup--container-main(v-if="mode === ''" ref="cardList", :class="{ needScroll: needScroll }")
      ConfigCard(
        v-for="item in controller.testList", :key="item.id", :data="item", :selectedId="selectedConfigId"
        @select="selectedConfigId = item.id" @delete="handleDelete"
      )
    ConfigForm(v-else :data="editTestdata")
  .config-popup--footer
    BreatheBtn(v-if="mode !== ''" @clk="handleSave" size="large" bgColor="linear-gradient(90deg, #ffcb00 3%, #f09b00 96%)" :disable-hint="saveDisabledHint", :disable="!!saveDisabledHint")
      i.iconfont.icon-Save
      span Save
      .btn-wrapper.execute-btn-wrapper
    ASpace(:size="140" v-else)
      ASpace(:size="50")
        BreatheBtn(@clk="handleExecute" badge-hint="Re execute" size="large" bgColor="linear-gradient(90deg, #ffcb00 3%, #f09b00 96%)")
          template(#badge)
            i.iconfont.icon-jieshi
          i.iconfont.icon-Execute
          span Execute
        BreatheBtn(@clk="handlePlayback" badge-hint="Replays the records generated when this test configuration was last executed" disable-hint="This test configuration has not yet executed, cannot playback!" size="large" :disable="!selectedTest.result")
          template(#badge)
            i.iconfont.icon-jieshi
          i.iconfont.icon-zhongzhi
          span Playback
      ASpace(:size="40")
        AButton.download-btn.bottom-animated(type="text" @click="handleDownload")
          i.iconfont.icon-download
          span Download
        AButton.contrast-btn.bottom-animated(type="text" @click="handleContrast")
          i.iconfont.icon-contrast
          span Contrast
        AButton.setting-btn.bottom-animated(type="text" @click="handleEdit")
          i.iconfont.icon-setting
          span Setting
    AButton.back-btn.bottom-animated(type="text" @click="handleBack")
      span Back
      img(:src="BackSvg")

SideBtn.config-btn(@click="openConfig", :breathe="controller.state === 'stopped' || controller.state === 'completed'")
</template>

<script>
import { computed, defineComponent, nextTick, ref, onMounted, onBeforeUnmount } from 'vue'
import BackSvg from '@/assets/back-icon.svg'
import { controller } from '../composition/controller.js'
import { useRoute } from 'vue-router'

import ConfigCard from './config-card.vue'
import ConfigForm from './config-form.vue'

export default defineComponent({
  name: 'ConfigPopup',
  components: {
    ConfigCard,
    ConfigForm
  },
  props: {
    configBtnTop: {
      type: String,
      default: '510px'
    },
    configBtnRight: {
      type: String,
      default: '0'
    }
  },
  emits: ['playback', 'execute'],
  setup: (props, { emit }) => {
    const route = useRoute()
    const cardList = ref(null)
    const selectedConfigId = ref('1')
    const visible = ref(false)
    const mode = ref('') // '' | 'create' | 'edit'
    const editTestdata = ref({})
    const needScroll = ref(false)

    const calcNeedScroll = async () => {
      await nextTick()
      if (!cardList.value) needScroll.value = false;
      needScroll.value = cardList.value.scrollHeight > cardList.value.clientHeight
    }

    const handleCreate = () => {
      mode.value = 'create'
      editTestdata.value = {}
    }

    const jumpPageBeforeStart = String(route.name) === 'blockchain'

    const handlePlayback = () => {
      emit('playback', selectedConfigId.value)
      controller.stop()
      controller.start('Playback', selectedConfigId.value, jumpPageBeforeStart)
      handleBack()
    }

    const handleExecute = () => {
      emit('execute', selectedConfigId.value)
      // TODO This operation need to confirm second time.
      controller.stop()
      controller.start('Executing', selectedConfigId.value, jumpPageBeforeStart)
      handleBack()
    }

    const handleDownload = () => {
      
    }

    const handleContrast = () => {
      
    }

    const handleEdit = () => {
      mode.value = 'edit'
      editTestdata.value = JSON.parse(JSON.stringify(selectedTest.value))
    }

    const handleBack = () => {
      if (mode.value !== '') mode.value = ''
      else visible.value = false
      editTestdata.value = {}
    }

    const handleSave = () => {
      console.log(editTestdata.value)
      // TODO after post api
      mode.value = ''
      editTestdata.value = {}
      calcNeedScroll()
    }

    const saveDisabledHint = computed(() => {
      const list = []
      if (!editTestdata.value.name) list.push('Name')
      if (!editTestdata.value.dataset || !editTestdata.value.dataset.timeRange) list.push('Data range')
      if (!editTestdata.value.shards) list.push('Shards')
      if (!editTestdata.value.nodes) list.push('Node Scale')
      if (list.length > 0) return 'Need ' + list.join(', ')
      return ''
    })

    const handleDelete = () => {
      // TODO
      calcNeedScroll()
    }

    const openConfig = () => {
      visible.value = true
    }

    const selectedTest = computed(() => {
      return controller.testList.find((test) => test.id === selectedConfigId.value)
    })

    onMounted(() => {
      calcNeedScroll()
      window.addEventListener('resize', calcNeedScroll)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', calcNeedScroll)
    })

    return {
      cardList,
      controller,
      needScroll,
      selectedConfigId,
      BackSvg,
      visible,
      selectedTest,
      mode,
      editTestdata,
      saveDisabledHint,
      handleCreate,
      handlePlayback,
      handleExecute,
      handleDownload,
      handleContrast,
      handleEdit,
      handleSave,
      handleDelete,
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
  .ant-input-search {
    width: 280px;
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
      padding: 26px 40px 29px;
      .title {
        font-size: 34px;
        line-height: 41px;
        font-weight: bold;
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
  right: v-bind('configBtnRight');
  top: v-bind('configBtnTop');
}
</style>
