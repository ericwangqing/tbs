<template lang="pug">
.config-popup
  .config-popup--mask
  .config-popup--wrapper
    .config-popup--wrapper-header
      span.title
        i Config
        span （
        i {{ configList.length }}
        span ）
      AInputSearch(allowClear)
    .config-popup--wrapper-main(ref="cardList", :class="{ needScroll: needScroll }")
      ConfigCard(
        v-for="item in configList", :key="item.id", :data="item", :selectedId="selectedConfigId"
        @select="selectedConfigId = item.id"
      )
  .config-popup--footer
</template>

<script>
import { computed, defineComponent, ref } from 'vue'

import ConfigCard from './config-card.vue'

export default defineComponent({
  name: 'ConfigPopup',
  components: {
    ConfigCard
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup: () => {
    const cardList = ref(null)
    const selectedConfigId = ref('')
    const configList = ref([
      {
        name: '持续展示',
        id: '1',
        isRunning: true,
        txn: 1000000,
        tps: 100000,
        dataset: {
          name: 'ETH',
          timeRange: [1640966400, 1672502399],
          txCount: 1000000000000,
          estimated: 64800 // seconds
        },
        timeCost: 1000,
        shardCount: 3,
        nodeCount: 30,
        cpuUsed: 0.05,
        memoryUsed: 286, // MB
        bandwidthUsed: 500 // KB, maybe TODO calc unit.
      },
      {
        name: '100K测试',
        id: '2',
        isRunning: false,
        txn: 1000000000000,
        tps: 100000,
        dataset: {
          name: 'ETH',
          timeRange: [1648742400, 1664553599],
          txCount: 1000000000000,
          estimated: 64800 // seconds
        },
        timeCost: 1000,
        shardCount: 100,
        nodeCount: 1000,
        cpuUsed: 0.1,
        memoryUsed: 332, // MB
        bandwidthUsed: 450 // KB, maybe TODO calc unit.
      }
    ])
    for (let i = 3; i < 20; i++) {
      configList.value.push(Object.assign({}, JSON.parse(JSON.stringify(configList.value[1])), {id: `${i}`}))
    }

    const needScroll = computed(() => {
      if (!cardList.value) return false;
      return cardList.value.scrollHeight > cardList.value.clientHeight
    })

    return {
      cardList,
      configList,
      needScroll,
      selectedConfigId
    }
  },
})
</script>

<style lang="scss" scoped>
@keyframes floatOut {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
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
    animation: floatOut 0.2s 1;
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
        width: 340px;
      }
    }
    &-main {
      max-height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 16px 40px;
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
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.00),  rgba(0, 0, 0, 0.80) 22%,  #000000 66%);
  }
}
</style>
