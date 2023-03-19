<template>
  <div v-if="props.transaction">
    <div>
      <description-item
        v-for="description of descriptions"
        :key="description.label"
      >
        <template #label
          ><a-tooltip
            ><template #title>{{ description.tooltip }}</template
            ><question-circle-outlined class="mr-4px" /></a-tooltip
          >{{ description.label }}:</template
        >
        <template v-if="description.label === 'Block'">
          <router-link
            :to="`/explorer-block/${props.transaction.blockNumber}`"
            >{{ props.transaction.blockNumber }}</router-link
          >
        </template>
        <template v-else-if="description.label === 'Timestamp'">
          {{ props.block && fromNow(props.block.timestamp) }}</template
        >
        <template
          v-if="description.label === 'From' || description.label === 'To'"
        >
          <router-link :to="`/explorer-address/${props.transaction.from}`">{{
            props.transaction.from
          }}</router-link>
        </template>
        <template v-else>
          {{ description.content }}
        </template>
      </description-item>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import DescriptionItem from '@/pages/explorer/components/description-item.vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import useTime from '@/hook/timeHook'
import useTransaction from '@/hook/transactionHook'
import { BigNumber, utils } from 'ethers'
const props = defineProps(['transaction', 'transactionReceipt', 'block'])
const { fromNow } = useTime()
const { getGasUsed, getFee, getGasLimit } = useTransaction()
const descriptions = computed(() => {
  return (
    (props.transaction &&
      props.transactionReceipt && [
        {
          label: 'Transaction Hash',
          tooltip:
            'A TxHash or transaction hash is a unique 66-character identifier that is generated whenever a transaction is executed.',
          content: props.transaction.hash,
        },
        {
          label: 'Status',
          tooltip: 'The status of the transaction.',
          content: '待实现',
        },
        {
          label: 'Block',
          tooltip:
            'Number of the block in which the transaction is recorded. Block confirmations indicate how many blocks have been added since the transaction was produced.',
        },
        {
          label: 'Timestamp',
          tooltip: 'The date and time at which a transaction is produced.',
        },
        {
          label: 'From',
          tooltip: 'The sending party of the transaction.',
        },
        {
          label: 'To',
          tooltip:
            'The receiving party of the transaction (could be a contract address).',
        },
        {
          label: 'Value',
          tooltip:
            'The value being transacted in Ether and fiat value. Note: You can click the fiat value (if available) to see historical value at the time of transaction.',
          content:
            utils.formatUnits(BigNumber.from(props.transaction.value)) +
            'Ether',
        },
        {
          label: 'Transaction Fee',
          tooltip:
            'Amount paid to the block producer for processing the transaction.',
          content:
            props.transactionReceipt &&
            getFee(props.transactionReceipt) + ' Ether',
        },
        {
          label: 'Gas Price',
          tooltip:
            'Cost per unit of gas specified for the transaction, in Ether and Gwei. The higher the gas price the higher chance of getting included in a block.',
          content:
            utils.formatUnits(props.transactionReceipt.effectiveGasPrice) +
            ' Ether',
        },
        {
          label: 'Gas Limit & Usage by Txn',
          tooltip:
            'Maximum amount of gas allocated for the transaction & the amount eventually used. Normal ETH transfers involve 21,000 gas units while contracts involve higher values.',
          content:
            props.transaction &&
            getGasLimit(props.transaction) +
              '|' +
              getGasUsed(props.transactionReceipt),
        },
        {
          label: 'Gas Fees',
          content: '待计算',
          tooltip:
            'Base Fee refers to the network Base Fee at the time of the block, while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay for their tx & to give to the block producer respectively.',
        },
        {
          label: 'Burnt Fees',
          content: '待计算',
          tooltip: 'Total amount of ETH burnt from this tx.',
        },
        {
          label: 'Other Attributes',
          tooltip: 'Other data related to this transaction.',
          content: '待实现',
        },
        {
          label: 'Input Data',
          content: '待实现',
          tooltip:
            'Additional data included for this transaction. Commonly used as part of contract interaction or as a message sent to the recipient.',
        },
      ]) ||
    []
  )
})
</script>
