<template lang="pug">
.finish-modal(v-if="controller.state === 'completed'")
  .finish-modal--border
  .finish-modal--bg
  .finish-modal--content
    span {{controller.testData.name}} finished!
  .finish-modal--btns
    AButton.download-btn(type="text" @click="handleDownload")
      i.iconfont.icon-download
      span Download
    AButton.download-btn(type="text" @click="handlePlayback")
      i.iconfont.icon-zhongzhi
      span Playback

</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { controller } from '../composition/controller.js'

export default defineComponent({
  name: 'FinishModal',
  setup: (props, { emit }) => {
    const handleDownload = () => {
      // TODO
    }
    const handlePlayback = () => {
      emit('playback')
    }
    return {
      controller,
      handleDownload,
      handlePlayback
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/theme/mixin.scss';
.finish-modal {
  top: 280px;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding: 24px 80px;
  font-size: 40px;
  white-space: nowrap;
  color: #fff;
  @include linearGradientRadiusBorder(min-content, min-content, 2, 8, #171925, linear-gradient(90deg, #FFCB00 3%, #F08B00 96%));
  position: absolute;
  &--content {
    position: relative;
  }
  &--btns {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 30px 0 12px;
    .ant-btn {
      color: #fff;
      width: 180px;
      height: 46px;
      font-size: 24px;
      font-weight: bold;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.30);
      i {
        font-size: 24px;
        margin-right: 16px;
      }
    }
  }
}
</style>
