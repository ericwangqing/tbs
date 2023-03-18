<template lang="pug">
.home.pt-20px
  BasicInfoCard.basic-info(:class="{ 'mr-38vw': chartVisible } ", :chainHeight="config.chainHeight", :totalTransactions="config.totalTransactions")
  WorldMap.world-map(:config="config")
  Charts(:config="config", @visible="onVisibleChange")
  Config(:default-config="config" @change-config="onChangeConfig" @changeForgeAccountRatio="onChangeForgeAccountRatio")

</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue'
import BasicInfoCard from './components/BasicInfoCard.vue'
import WorldMap from './components/WorldMap.vue'
import Charts from './components/Charts.vue'
import Config from './components/Config.vue'

import { useRoute } from 'vue-router'
import controller from './composition/controller.js'
import { isNil } from 'lodash'

export default defineComponent({
  name: 'Home',
  components: {
    BasicInfoCard,
    WorldMap,
    Charts,
    Config
  },
  setup: () => {
    const chartVisible = ref(false)
    const configVisible = ref(false)
    const route = useRoute()
    const isSecurity = ref(route.name === 'security')
    const config = ref({
      tps: 15,
      chainHeight: 181311,
      totalTransactions: 103123414,
      playing: true,
      nodeScale: 1000,
      latencyInSwarm: 20,
      latencyBetweenSwarm: 100,
      swarmScale: 1,
      attackType: 'Sybil',
      forgeAccountRatio: 30,
      isAttackSimulate: route.name === 'security',
      startAttackSimulate: false,
    })

    watch(() => route.name, (newRouteName) => {
      config.value.isAttackSimulate = newRouteName === 'security'
      isSecurity.value = newRouteName === 'security'
      if (!config.value.isAttackSimulate) {
        config.value.startAttackSimulate = false
      }
      onChangeConfig(toRaw(config.value))
    })

    setInterval(() => {
      if(config.value.playing) {
        config.value.chainHeight += config.value.tps / (40 + 10 * Math.random())
        config.value.totalTransactions += config.value.tps
      }
    }, 1000)

    if (config.value.isAttackSimulate && config.value.startAttackSimulate) {
      const attackerNodeScale = Math.floor(config.value.nodeScale * config.value.forgeAccountRatio / 100)
      controller.setNodesScale(config.value.nodeScale - attackerNodeScale,  attackerNodeScale)
    } else {
      controller.setNodesScale(config.value.nodeScale,  0)
    }
    controller.autoGenerateTx(config.value.tps)

    const onChangeConfig = (newConfig) => {
      console.log('change config', newConfig)
      configVisible.value = false;
      if (newConfig.tps)
        controller.autoGenerateTx(newConfig.tps);

      newConfig.nodeScale && (config.value.nodeScale = newConfig.nodeScale);
      if (newConfig.tps) {
        config.value.tps = newConfig.tps
        config.value.swarmScale = Math.ceil(newConfig.nodeScale / (150 + Math.random() * 50))
      }
      if (!isNil(newConfig.isAttackSimulate))
        config.value.isAttackSimulate = newConfig.isAttackSimulate;
      if (!isNil(newConfig.startAttackSimulate))
        config.value.startAttackSimulate = newConfig.startAttackSimulate;
      if (newConfig.forgeAccountRatio)
        config.value.forgeAccountRatio = newConfig.forgeAccountRatio;

      if (!isNil(newConfig.startAttackSimulate)) {
        if (config.value.startAttackSimulate) {
          const attackerNodeScale = Math.floor(config.value.nodeScale * config.value.forgeAccountRatio / 100);
          controller.setNodesScale(config.value.nodeScale - attackerNodeScale, attackerNodeScale);
        } else {
          controller.setNodesScale(config.value.nodeScale, 0);
        }
      }
    }

    const onChangeForgeAccountRatio = (forgeAccountRatio) => {
      config.value.forgeAccountRatio = forgeAccountRatio;
      if (config.value.startAttackSimulate) {
        const attackerNodeScale = Math.floor(config.value.nodeScale * config.value.forgeAccountRatio / 100);
        controller.setNodesScale(config.value.nodeScale-attackerNodeScale, attackerNodeScale);
      }
    }

    const onVisibleChange = (val) => {
      chartVisible.value = val
    }

    const onKeydown = (event) => {
      if (event.key === 'p') {
        config.value.playing = !config.value.playing
        if (config.value.playing) controller.play()
        else controller.pause()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', onKeydown)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeydown)
    })

    return {
      config,
      chartVisible,
      isSecurity,
      onVisibleChange,
      onChangeConfig,
      onChangeForgeAccountRatio
    }
  },
})
</script>

<style scoped lang="scss">
.home {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .world-map {
    width: 88%;
    flex-grow: 1;
  }
}
</style>