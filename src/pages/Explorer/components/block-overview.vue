<template lang="pug">
div(v-if="props.block")
  div
    description-item(v-for="description of descriptions", :key="description.label")
      template(#label)
        a-tooltip
          template(#title) {{ description.tooltip }}
          QuestionCircleFilled.mr-14px(style="color:rgba(255,255,255,0.2)")
        | {{ description.label }}
        | :
      template(v-if="description.label === 'BlockHeight'")
        block-change(@changeBlockNumber="changeBlockNumber", :blockNumber="props.block.number")
      template(v-else-if="description.label === 'Status'") 待实现
      template(v-else-if="description.label === 'Transactions'")
        RouterLink(:to="`/explorer/transaction-list?block=${props.block.number}`")
          a-tag(color="rgba(255, 211, 0, 0.3)") {{ props.block.transactions.length + 'transactions' }}
        | in this block
      template(v-else-if="description.label === 'Fee Recipient'")
        RouterLink(:to="`/explorer/address/${props.block.miner}`")
          | {{
          | props.block.miner
          | }}
      template(v-else-if="description.label === 'Gas Used'") {{ getGasUsed(props.block) +'('+getGasUsePecent(props.block)+'%)'}} 
      template(v-else-if="description.label === 'Parent Hash'")
        RouterLink(:to="`/explorer/block/${props.block.number - 1}`")
          | {{
          | props.block.parentHash
          | }}
      template(v-else) {{ description.content }}

</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DescriptionItem from '@/pages/Explorer/components/description-item.vue'
import BlockChange from '@/pages/Explorer/components/block-change.vue'
import { QuestionCircleFilled } from '@ant-design/icons-vue'
import useBlock from '@/hook/blockHook'
import useTime from '@/hook/timeHook'
import { utils } from 'ethers'
const {
  getGasUsed,
  getGasLimit,
  getGasUsePecent,
  getBaseFeePerGas,
  getBurntFees,
  getReward,
  getBlocksize,
} = useBlock()
const { fromNow, formatTime } = useTime()
const route = useRoute()
const router = useRouter()
const props = defineProps(['block'])
const descriptions = computed(() => {
  console.log(props.block)
  return (
    (props.block && [
      {
        label: 'BlockHeight',
        tooltip:
          'Also known as Block Number.The block height,which indicates the length of the blockchain,increases after the addition of the new block',
      },
      {
        label: 'Status',
        tooltip: 'The finality status of the block',
      },
      {
        label: 'Timestamp',
        tooltip: 'The date and time at which a block is produced',
        content: `${fromNow(props.block.timestamp)}(${formatTime(
          props.block.timestamp
        )})`,
      },
      {
        label: 'Proposed On',
        tooltip: 'Slot and epoch this block is proposed on',
        content: '待实现',
      },
      {
        label: 'Transactions',
        tooltip:
          'The number of transactions in the block.Internal transaction is transactions as a result of contract execution that involves Ether value',
      },
      {
        label: 'Fee Recipient',
        tooltip: 'Address receiving fees from transactions in this block',
      },
      {
        label: 'Block Reward',
        content: props.block.reward + ' Ether',
        tooltip:
          'For each block,the block producer iw rewarded with a finite amount of Ether on top of the fees paid for all transactions in the block.',
      },
      {
        label: 'Total Difficulty',
        content: utils.commify(props.block.totalDifficulty),
        tooltip: 'Total difficulty of the chain until the block',
      },
      {
        label: 'Size',
        content: getBlocksize(props.block) + ' bytes',
        tooltip:
          "The block size is actually determined by the block's gas limit",
      },
      {
        label: 'Gas Used',
        tootlip:
          'The total gas used in the block and its percentage of gas filled in the block',
      },
      {
        label: 'Gas Limit',
        content: getGasLimit(props.block),
        tooltip: 'Total gas limit provided by all transactions in the block',
      },
      {
        label: 'Base Fee Per Gas',
        content: `${getBaseFeePerGas(props.block)} Ether(${getBaseFeePerGas(
          props.block,
          'gwei'
        )} Gwei)`,
        tooltip:
          'Post-London Upgrade,this represents the minimum gasUsed multiplier required for a tx to be included in a block',
      },
      {
        label: 'Burnt Fees',
        tooltip:
          'Post-London Upgrade,this represents the pard of the tx fee that is burnt:baseFeePerGas*gasUsed',
        content: getBurntFees(props.block) + ' Ether',
      },
      {
        label: 'Extra Data',
        tooltip:
          'And data that can be included by the block producer in the block',
        content: props.block.extraData,
      },
      {
        label: 'Hash',
        content: props.block.hash,
        tooltip: 'The hash of the block header of the current block',
      },
      {
        label: 'Parent Hash',
        tooltip:
          'The has of the block from which this block was generated, also known as its parent block',
      },
      {
        label: 'StateRoot',
        content: props.block.stateRoot,
        tooltip: 'The root of the state trie',
      },
      {
        label: 'Nonce',
        content: props.block.nonce,
        tooltip:
          'Block nonce is a value used during mining to demonstrate proof of work for a block',
      },
    ]) ||
    []
  )
})

function changeBlockNumber(blockNumber) {
  router.push({
    name: route.name,
    params: {
      blockNumber,
    },
  })
}
</script>
