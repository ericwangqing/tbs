<template lang="pug">
div(v-if="props.block")
  div
    description-item(v-for="description of descriptions", :key="description.label")
      template(#label)
      template(v-if="description.label === 'Status'")
      template(v-else-if="description.label === 'Transactions'")
      template(v-else)
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect, toRefs } from 'vue'
import DescriptionItem from '@/pages/explorer/components/description-item.vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import useBlock from '@/hook/blockHook'
const { getGasUsed, getGasLimit, getGasUsePecent, getBaseFeePerGas } =
  useBlock()
const props = defineProps(['block'])
const descriptions = computed(() => {
  console.log(props.block)
  return (
    (props.block && [
      {
        label: 'Slot',
        tooltip: '',
        content: '待实现',
      },
      {
        label: 'Epoch',
        tooltip: '',
        content: '待实现',
      },
      {
        label: 'Proposer Index',
        content: '待实现',
        tooltip: '',
      },
      {
        label: 'Slot Root Hash',
        content: '待实现',
        tooltip: '',
      },
      {
        label: 'Beacon Chain Deposit Count',
        content: '待实现',
        tooltip: '',
      },
      {
        label: 'Slot Graffiti',
        content: '待实现',
        tooltip: '',
      },
      {
        label: 'Block Randomness',
        content: '待实现',
        tooltip: '',
      },
      {
        label: 'Randao Reveal',
        tooltip: '',
        content: '待实现',
      },
    ]) ||
    []
  )
})
</script>
