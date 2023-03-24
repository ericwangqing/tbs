<template lang="pug">
div(v-if="props.transaction")
  div
    description-item(v-for="description of descriptions", :key="description.label",:align="description.align||'center'")
      template(#label)
        div(:style="{paddingTop:description.align==='start'?'12px':'0px'}")
          a-tooltip
            template(#title) {{ description.tooltip }}
            QuestionCircleFilled.mr-4px(style="color:rgba(255,255,255,0.2)")
          | {{ description.label }}
          | :
      template(v-if="description.label === 'Transaction Hash'")
        | {{ props.transaction.hash
        | }}
        i.iconfont.icon-copy.ml-8px.text-2xl.align-middle.cursor-pointer(@click="copyHash(props.transaction.hash)")
      template(v-else-if="description.label === 'Status'")
        a-tag(:color="props.transactionReceipt.status === 0 ? 'error' : 'rgba(90,216,166,0.3)'")
          | {{
          | props.transactionReceipt.status === 0 ? 'fail' : 'Success'
          | }}
      template(v-else-if="description.label === 'Block'")
        router-link(:to="`/explorer/block/${props.transaction.blockNumber}`") {{ props.transaction.blockNumber }}
        span.ml-10px {{ props.blockStart - props.block.number + 1 }} Block Confirmations
      template(v-else-if="description.label === 'Timestamp'") {{ props.block && fromNow(props.block.timestamp) }}
        | (
        | {{
        | formatTime(props.block.timestamp)
        | }}
        | )
      template(v-else-if="description.label === 'From' || description.label === 'To'")
        router-link(:to="`/explorer/address/${props.transaction[description.label.toLocaleLowerCase()]}`")
          | {{
          | props.transaction[description.label.toLocaleLowerCase()]
          | }}
        i.iconfont.icon-copy.ml-8px.text-2xl.align-middle.cursor-pointer(@click="copyHash(props.transaction.hash)")
      template(v-else-if="description.label === 'Gas Fees'")
        span(v-if="props.block.baseFeePerGas")    
          span.text-black-30 Base：
          | {{ getBaseFeePerGas(props.block) }}
          | Ether
        span.ml-16px(v-if="props.transaction.maxFeePerGas")
          span.text-black-30  Max：
          | {{ getMaxPerGas(props.transaction) }}
          | Ether
        span.ml-16px(v-if="props.transaction.maxFeePerGas")
          span.text-black-30 Max Priority：
          | {{
          | getMaxPriorityFeePerGas(props.transaction)
          | }}
          | Ether
      template(v-else-if="description.label === 'Burnt Fees'")
        span.text-black-30 Burnt：
        | {{
        | getBurntFees(props.block, props.transactionReceipt) + ' Ether'
        | }}
      template(v-else-if="description.label === 'Other Attributes'")
        a-tag(color='rgba(194,194,194,0.3)') Txn Type:
          | {{ transaction.type }}
        a-tag(color='rgba(194,194,194,0.3)') nonce:
          | {{ transaction.nonce }}
        a-tag(color='rgba(194,194,194,0.3)') Position In Block:
          | {{ transaction.transactionIndex }}
      template(v-else-if="description.label === 'Input Data'")
        a-textarea(class="my-12px! dark-input",disabled, :auto-size="{ minRows: 5, maxRows: 5 }", v-model:value="props.transaction.input")
      template(v-else) {{ description.content }}
  
</template>
<script setup>
import { computed } from 'vue'
import DescriptionItem from '@/pages/explorer/components/description-item.vue'
import { QuestionCircleFilled, CopyOutlined } from '@ant-design/icons-vue'
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
          label: 'Sponsored',
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
          align: 'start',
          tooltip:
            'Additional data included for this transaction. Commonly used as part of contract interaction or as a message sent to the recipient.',
        },
      ]) ||
    []
  )
})

function copyHash(hash) {
  copy(hash)
  message.success('Copied!')
}
</script>
<style lang="scss" scoped>
.text-black-30 {
  color: rgba(255, 255, 255, 0.3);
}
textarea.ant-input {
  cursor: text;
}
</style>
