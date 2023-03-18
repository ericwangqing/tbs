<template lang="pug">
ConfigPopup.home-config(:configBtnSide="'left'", :configBtnTop="'949px'" :visible="visible" @show="visible=true" @close="visible=false")
  template(#header)
    .config-title Network Configuration
  template(#main)
    AForm.config-form(:model="configData", :label-col="{ span: 24 }", :wrapper-col="{ span: 18 }")
      AFormItem(label="Node Scale")
        AInputNumber.w-240px(v-model:value="configData.nodeScale" :formatter="numberFormatter" size="large")
      AFormItem.no-control(:label="`Swarms: ${swarmScale}`")
      AFormItem.inline-form-item(label="Latency In Swarm (ms)")
        AInputNumber.w-240px(v-model:value="configData.latencyInSwarm" addon-after="ms" :formatter="numberFormatter" size="large")
      AFormItem.inline-form-item(label="Latency Between Swarm")
        AInputNumber.w-240px(v-model:value="configData.latencyBetweenSwarm" addon-after="ms" :formatter="numberFormatter" size="large")
      AFormItem.inline-form-item(label="Throughput")
        AInputNumber.w-240px(v-model:value="configData.tps" addon-after="TPS" :formatter="numberFormatter" size="large")
      AFormItem
        BreatheBtn(@clk="onChangeConfig")
          span Config
      //- AButton(type="primary" html-type="submit" @click="onChangeConfig" size="large") Config

      ADivider(v-if="defaultConfig.isAttackSimulate")
      h3(v-if="defaultConfig.isAttackSimulate") Attack Simulation

      AFormItem.inline-form-item(label="Attack Type" v-if="defaultConfig.isAttackSimulate")
        ASelect.w-240px(ref="select", v-model:value="configData.attackType", :options="AttackTypeList" size="large")

      AFormItem.inline-form-item(label="ForgeAccountRatio" v-if="defaultConfig.isAttackSimulate && configData.attackType === 'Sybil'")
        AInputNumber.w-240px(v-model:value="configData.forgeAccountRatio" addon-after="%" size="large")

      AFormItem.inline-form-item(label="Attacked Node" v-if="defaultConfig.isAttackSimulate && configData.attackType === 'Finney'")
        ASelect.w-240px(ref="select" value="node1" :options="FinneyAttackNodeList" size="large")

      AFormItem.inline-form-item(label="Attacked Swarm" v-if="defaultConfig.isAttackSimulate && configData.attackType === 'Eclipse'")
        ASelect.w-240px(ref="select" value="swarm1" :options="EclipseNodeList" size="large")
    
  template(#footer)
    AFormItem(v-if="defaultConfig.isAttackSimulate")
      BreatheBtn(@clk="onSimulateSwitch" bgColor="linear-gradient(90deg,#ffcb00 3%, #f08b00 96%)")
        span {{ simulateButtonName }}

</template>

<script>
import { defineComponent, reactive, toRaw, computed, watch, ref } from 'vue'
import BreatheBtn from '@/components/BreatheBtn.vue'
const AttackTypeList = [
  { value: 'Finney', label: 'Finney(race)' },
  { value: 'Eclipse', label: 'Eclipse' },
  { value: 'Sybil', label: 'Sybil' },
  { value: 'DDos', label: 'DDos', disabled: true },
  { value: 'routing', label: 'routing', disabled: true },
  { value: 'DAO', label: 'DAO', disabled: true },
  { value: 'parityMultising', label: 'parityMultising', disabled: true }
]
const FinneyAttackNodeList = [
  { value: 'node1', label: 'NxfiHffwafewzooiweifpoiewqfweoi' },
  { value: 'node2', label: 'Lfoiwqfqwjfiopqjfowjqfnvoqwfwf' },
  { value: 'node3', label: 'mopfqwnwefFOIWOWEIjfoqnwffnqwof' },
  { value: 'node4', label: 'fawefwofewfnawoovneifjweofawef' },
  { value: 'node5', label: 'fwefwoepfjoweajfwefmwoefw' }
]
const EclipseNodeList = [
  { value: 'swarm1' },
  { value: 'swarm2' },
  { value: 'swarm3' },
  { value: 'swarm4' },
  { value: 'swarm5' },
]

export default defineComponent({
  name: 'Config',
  emits: ['changeConfig', 'changeForgeAccountRatio'],
  props: {
    defaultConfig: Object
  },
  components: {
    BreatheBtn
  },
  setup: (props, { emit }) => {
    const visible = ref(false)
    const configData = reactive({
      ...props.defaultConfig,
      swarmScale: 1
    })

    const swarmScale = computed(() => {
      return Math.ceil(configData.nodeScale / (50 + Math.random() * 50))
    })

     watch(() => props.defaultConfig.startAttackSimulate, () => {
      configData.startAttackSimulate = props.defaultConfig.startAttackSimulate
    })

    const onChangeConfig = () => {
      configData.swarmScale = swarmScale
      visible.value = false
      emit('changeConfig', toRaw(configData))
    }

    const simulateButtonName = computed(() => {
      return configData.startAttackSimulate ? 'Stop' : 'Start'
    })

    const onSimulateSwitch = () => {
      configData.startAttackSimulate = !configData.startAttackSimulate;
      visible.value = false
      emit('changeConfig', { startAttackSimulate: configData.startAttackSimulate, forgeAccountRatio: configData.forgeAccountRatio })
    }

    const numberFormatter = (value) => {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    watch(() => configData.forgeAccountRatio, () => {
      emit('changeForgeAccountRatio', configData.forgeAccountRatio)
    })

    return {
      configData,
      swarmScale,
      AttackTypeList,
      FinneyAttackNodeList,
      EclipseNodeList,
      simulateButtonName,
      visible,
      onChangeConfig,
      onSimulateSwitch,
      numberFormatter
    }
  }
})
</script>

<style lang="scss" scoped>
.config-title {
  font-size: 34px;
  font-weight: 700;
  color: #fff;
  font-style: italic;
}
  .config-form {
    :deep(.ant-form-item-label) {
      label {
        font-size: 20px;
        color: #fff;
      }
    }
    .no-control:deep(label) {
      color: #ffae00;
    }
    .inline-form-item {
      display: inline-block;
      margin-right: 60px;
    }
    .ant-divider {
      border-color: #3f4048;
    }
    h3 {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
    }
    .ant-select {
      width: 240px;
    }
  }
</style>
