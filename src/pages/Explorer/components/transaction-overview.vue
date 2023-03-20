<template lang="pug">
div(v-if="props.transaction")
  div
    description-item(v-for="description of descriptions", :key="description.label")
      template(#label)
        a-tooltip
          template(#title) {{ description.tooltip }}
          question-circle-outlined.mr-4px
        | {{ description.label }}
        | :
      template(v-if="description.label === 'Transaction Hash'")
        | {{ props.transaction.hash
        | }}
        copy-outlined(@click="copyHash(props.transaction.hash)").ml-4px
      template(v-else-if="description.label === 'Status'")
        a-tag(:color="props.transactionReceipt.status === 0 ? 'error' : 'success'")
          | {{
          | props.transactionReceipt.status === 0 ? 'fail' : 'success'
          | }}
      template(v-else-if="description.label === 'Block'")
        router-link(:to="`/explorer-block/${props.transaction.blockNumber}`") {{ props.transaction.blockNumber }}
        | {{ props.blockStart - props.block.number + 1 }}
        | Block Confirmations
      template(v-else-if="description.label === 'Timestamp'") {{ props.block && fromNow(props.block.timestamp) }}
        | (
        | {{
        | formatTime(props.block.timestamp)
        | }}
        | )
      template(v-else-if="description.label === 'From' || description.label === 'To'")
        router-link(:to="`/explorer-address/${props.transaction[description.label.toLocaleLowerCase()]}`")
          | {{
          | props.transaction[description.label.toLocaleLowerCase()]
          | }}
        copy-outlined(@click="copyHash(props.transaction[description.label])").ml-4px
      template(v-else-if="description.label === 'Gas Fees'")
        span Base:
          | {{ getBaseFeePerGas(props.block) }}
          | Ether
        span.ml-16px Max:
          | {{ getMaxPerGas(props.transaction) }}
          | Ether
        span.ml-16px Max Priority:
          | {{
          | getMaxPriorityFeePerGas(props.transaction)
          | }}
          | Ether
      template(v-else-if="description.label === 'Burnt Fees'")
        | {{
        | getBurntFees(props.block, props.transactionReceipt) + ' Ether'
        | }}
      template(v-else-if="description.label === 'Other Attributes'")
        a-tag Txn Type:
          | {{ transaction.type }}
        a-tag nonce:
          | {{ transaction.nonce }}
        a-tag Position In Block:
          | {{ transaction.transactionIndex }}
      template(v-else-if="description.label === 'Input Data'")
        a-textarea(disabled, :auto-size="{ minRows: 5, maxRows: 5 }", v-model:value="props.transaction.input")
      template(v-else) {{ description.content }}
  
</template>
<script setup>
import { computed } from 'vue'
import DescriptionItem from '@/pages/explorer/components/description-item.vue'
import { QuestionCircleOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { useClipboard } from '@vueuse/core'
import useTime from '@/hook/timeHook'
import useBlock from '@/hook/blockHook'
import useTransaction from '@/hook/transactionHook'
import { message } from 'ant-design-vue'
const { copy } = useClipboard()
const props = defineProps([
  'transaction',
  'transactionReceipt',
  'block',
  'blockStart',
])
const { fromNow, formatTime } = useTime()
const {
  getGasUsed,
  getFee,
  getGasLimit,
  getGasPrice,
  getValue,
  getGasLimitPecent,
  getMaxPerGas,
  getMaxPriorityFeePerGas,
  getBurntFees,
} = useTransaction()
const { getBaseFeePerGas } = useBlock()
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
          content: getValue(props.transaction) + ' Ether',
        },
        {
          label: 'Transaction Fee',
          tooltip:
            'Amount paid to the block producer for processing the transaction.',
          content: getFee(props.transactionReceipt) + ' Ether',
        },
        {
          label: 'Gas Price',
          tooltip:
            'Cost per unit of gas specified for the transaction, in Ether and Gwei. The higher the gas price the higher chance of getting included in a block.',
          content: getGasPrice(props.transactionReceipt) + ' Ether',
        },
        {
          label: 'Gas Limit & Usage by Txn',
          tooltip:
            'Maximum amount of gas allocated for the transaction & the amount eventually used. Normal ETH transfers involve 21,000 gas units while contracts involve higher values.',
          content:
            getGasLimit(props.transaction) +
            ' | ' +
            getGasUsed(props.transactionReceipt) +
            '(' +
            getGasLimitPecent(props.transaction, props.transactionReceipt) +
            '%' +
            ')',
        },
        {
          label: 'Gas Fees',
          tooltip:
            'Base Fee refers to the network Base Fee at the time of the block, while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay for their tx & to give to the block producer respectively.',
        },
        {
          label: 'Burnt Fees',
          tooltip: 'Total amount of ETH burnt from this tx.',
        },
        {
          label: 'Other Attributes',
          tooltip: 'Other data related to this transaction.',
        },
        {
          label: 'Input Data',
          tooltip:
            'Additional data included for this transaction. Commonly used as part of contract interaction or as a message sent to the recipient.',
        },
      ]) ||
    []
  )
})

function copyHash(hash) {
  copy(hash)
  message.success('复制成功')
}
</script>
