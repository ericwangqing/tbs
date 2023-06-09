<template lang="pug">
.benchmark-header
  .category-switcher
    .category-ceil(@click="changeTo('cockpit')", :class="{ selected: category === 'cockpit' }")
      i.iconfont.icon-dashboard.category-ceil--icon
      .category-ceil--name Cockpit
    ATooltip(:title="controller.state === 'stopped' && category === 'cockpit' ? 'Should start executing or playback from config button firstly, then view the chain overview.' : ''" placement="bottom")
      .category-ceil(@click="changeTo('chain')", :class="{ selected: category === 'chain', disabled: controller.state === 'stopped' && category === 'cockpit' }")
        i.iconfont.icon-blockchain2.category-ceil--icon
        .category-ceil--name Chain
  ScannedBox.block-info-board
    .block-info-board-ceil
      .block-info-board-ceil__label TPS
      .block-info-board-ceil__num {{ thousands(controller.tps) }}
    .block-info-board-ceil
      .block-info-board-ceil__label Total transactions
      .block-info-board-ceil__num {{ thousands(controller.txCount) }}
    .block-info-board-ceil
      .block-info-board-ceil__label Chain height
      .block-info-board-ceil__num {{ thousands(controller.chainHeight) }}
    .block-info-board-ceil
      .block-info-board-ceil__label Shards
      .block-info-board-ceil__num {{ thousands(controller.shards) }}
    .block-info-board-ceil
      .block-info-board-ceil__label Nodes
      .block-info-board-ceil__num {{ thousands(controller.nodes) }}
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import { controller } from '@/pages/Benchmark/composition/controller.js'
import { thousands } from '@/pages/Benchmark/composition/util.js'
import ScannedBox from '@/components/ScannedBox.vue'

export default defineComponent({
  name: 'BenchmarkHeader',
  components: {
    ScannedBox
  },
  props: {
    category: {
      type: String,
      default: 'cockpit' // cockpit | chain
    }
  },
  setup: (props, { emit }) => {
    const changeTo = (category) => {
      if (category === props.category) return
      if (controller.state === 'stopped' && category === 'chain') return
      emit('change-category', category)
    }
    return {
      controller,
      changeTo,
      thousands
    }
  },
})
</script>

<style lang="scss" scoped>
.benchmark-header {
  .category-switcher {
    position: absolute;
    top: 22px;
    left: 30px;
    display: flex;
    align-items: center;
    padding-top: 13px;
    .category-ceil {
      padding: 0 25px;
      color: rgba(255, 255, 255, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      &--icon {
        font-size: 40px;
        line-height: 40px;
      }
      &--name {
        font-size: 16px;
        line-height: 18px;
      }
      &:hover:not(.disabled) {
        .category-ceil--icon, .category-ceil--name {
          color: #fff;
        }
      }
      &:active:not(.disabled) {
        .category-ceil--icon {
          font-size: 36px;
        }
      }
      &.selected, &.selected:hover, &.selected:active {
        cursor: default;
        .category-ceil--icon {
          color: rgba(#FFA900, 0.85);
          font-size: 40px;
        }
        .category-ceil--name {
          color: #fff;
        }
      }
      &:not(:last-child) {
        border-right: solid 1px rgba(255, 255, 255, 0.3);
      }
      &.disabled {
        cursor: not-allowed;
      }
    }
  }
  .block-info-board {
    position: absolute;
    top: 22px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    width: min-content;
    border-radius: 4px;
    background: linear-gradient(180deg,rgba(0,0,0,0.50), rgba(0,0,0,0.20));
    &-ceil {
      padding: 16px 66px 13px;
      position: relative;
      &__label {
        color: #fff;
        white-space: nowrap;
        font-size: 20px;
        line-height: 23px;
        font-family: 'PangMenZhengDaoBiao';
      }
      &__num {
        color: #ffa900;
        font-size: 34px;
        font-weight: bold;
        line-height: 39px;
      }
      &:not(&:last-child)::after {
        content: '';
        height: 62px;
        width: 1px;
        background: rgba(255, 255, 255, 0.3);
        position: absolute;
        right: 0;
        top: 12px;
      }
      &:first-child {
        padding-left: 50px;
      }
      &:last-child {
        padding-right: 50px;
      }
    }
  }
}
</style>
