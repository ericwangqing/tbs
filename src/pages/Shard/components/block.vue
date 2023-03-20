<template lang="pug">
.block-container(:class="{'block-shadow': block.state !== 'loading'}")
  .block-bg(:style="{background: bgColor}" :class="{'block-scale': blockScale}")
  .block-state-icon(:class="stateIcon")
  .block-content
    a-skeleton(active v-if="block.state === 'loading'" :paragraph="{ rows: 4, width: [104, 60, 60, 40] }" :title="false")
    template(v-else)
      .block-height(:style="{color: blockHeightColor}") {{block.number}}
      template(v-if="isBeaconBlock")
        template(v-if="block.state === 'finalized'")
          .block-field epoch: {{getEpoch}}
          .block-field slot: {{block.slot}}
          .block-field txn: {{block.txn}}
          .block-field tbs: {{block.tbs}}
        template(v-else)
          .block-field age: {{age}}s ago
      template(v-else)
        template(v-if="block.state === 'finalized' || block.state === 'unfinalized'")
          .block-field age: {{age}}s ago
          .block-field txn: {{block.txn}}
          .block-field miner: {{block.miner}}
          .block-field hash: {{block.hash}}
        template(v-else)
          .block-field age: {{age}}s ago
</template>

<script>
import {computed, defineComponent, onBeforeUnmount, onMounted, ref, toRaw, watch} from 'vue'

export default defineComponent({
  name: 'Block',
  props: {
    block: {
      type: Object,
      require: true
    }
  },
  components: {},
  setup: (props) => {
    const block = props.block
    const isBeaconBlock = computed(() => {
      return !!block.$beacon
    })
    const getEpoch = computed(() => {
      return Math.floor(block.slot / 32)
    })
    const getBlockHeightColor = () => {
      const dict = {
        collect: '#000000',
        attest: '#000000',
        unfinalized: '#000000',
        finalized: '#3C7BFD'
      }
      return dict[block.state] || '#000000'
    }
    const getStateIcon = () => {
      const dict = {
        collect: 'icon-shouji',
        attest: 'icon-jianzheng',
        unfinalized: 'icon-chukuai',
        finalized: 'icon-qiaoding'
      }
      return ['iconfont', dict[block.state]]
    }
    const getBlockBackgroundColor = () => {
      const dict = {
        collect: '#91929e',
        attest: '#c5c7d1',
        unfinalized: '#eff0f9',
        finalized: '#eff0f9',
        loading: '#4e505e'
      }
      return dict[block.state] || '#91929e'
    }
    const getAge = () => {
      return Math.round((Date.now() - block.timestamp) / 1000)
    }
    const blockScale = ref(false)
    const bgColor = ref(getBlockBackgroundColor())
    const blockHeightColor = ref(getBlockHeightColor())
    const stateIcon = ref(getStateIcon())
    const age = ref(getAge())
    watch(() => block.state, () => {
      // 先放大缩小
      blockScale.value = true
      // 后变背景颜色、字体颜色、状态图标
      setTimeout(() => {
        bgColor.value = getBlockBackgroundColor()
        blockHeightColor.value = getBlockHeightColor()
        stateIcon.value = getStateIcon()
      }, 200)
      setTimeout(() => {
        blockScale.value = false
      }, 400)
    })
    const timer = setInterval(() => {
      age.value = getAge()
    }, 1000)
    onBeforeUnmount(() => {
      clearInterval(timer)
    })
    return {
      getEpoch,
      isBeaconBlock,
      blockScale,
      bgColor,
      blockHeightColor,
      stateIcon,
      age
    }
  }
})
</script>

<style scoped lang="scss">
.block-container {
  position: relative;
  width: 200px;
  height: 124px;
  border-radius: 4px;
  &.block-shadow {
    box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.20);
  }
  .block-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: background 200ms ease;
    border-radius: inherit;
  }
  .block-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 13px 18px 17px 18px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-wrap: nowrap;
  }
  .block-field, .block-height {
    color: #000000;
    font-size: 12px;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .block-height {
    font-size: 16px;
    font-weight: 600;
    transition: color 200ms ease;
  }
}

.block-scale {
  animation: block-scale 400ms forwards ease;
}

.block-state-icon {
  position: absolute;
  width: 76px;
  height: 76px;
  font-size: 76px;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  opacity: 0.08;
}

:deep(.ant-skeleton) {
  .ant-skeleton-content .ant-skeleton-paragraph > li + li {
    margin-top: 10px;
  }
}

@keyframes block-scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
