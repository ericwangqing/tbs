<template lang="pug">
.explorer.overflow-auto.h-full
  .max-w-1400px.mx-auto.pt-12px.pb-48px
      .flex.pt-20px.pb-30px.text-white
          left-outlined.mt-12px.mr-8px.cursor-pointer
          .text-white
              .text-24px.font-medium 
                component(:is='name',v-if="typeof name==='object'")
                template(v-else) {{name}}
              .text-12px(class="text-white/50")
                  component(:is='label',v-if="typeof label=='object'")
                  template(v-else) {{label}}
      router-view
</template>
<script setup lang="jsx">
import { h } from 'vue'
import { LeftOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
const router = useRouter()
const route = useRoute()
const routeName = route.name
let name, label
if (routeName === 'explorer-block-list') {
  const { type, index } = route.query
  if (type === 'beacon') {
    name = 'ETH'
    label = 'Time Beacon Chain'
  } else {
    name = 'TBS'
    label = `S-${index}`.padStart(3, '0')
  }
} else if (routeName === 'explorer-transaction-list') {
  name = 'Transactions'
  const query = route.query.block
  label = (
    <div>
      For Block
      <RouterLink style="color:#FFAE00" to={'/explorer/block/' + query}>
        {query}
      </RouterLink>
    </div>
  )
} else if (routeName === 'explorer-block-detail') {
  const block = route.params.blockNumber
  name = (
    <div>
      Block
      <span style="font-size:12px"> # </span>
      <RouterLink
        style="color:#FFAE00;font-size:12px"
        to={'/explorer/block/' + block}
      >
        {block}
      </RouterLink>
    </div>
  )
  label = 'Time Beacon Chain'
} else if (routeName === 'explorer-transaction-detail') {
  const block = route.params.blockNumber
  name = <div>Transaction Details</div>
  label = 'Time Beacon Chain'
} else if (routeName === 'explorer-address-detail') {
  name = <div>Address Details</div>
  label = 'Time Beacon Chain'
}
</script>
<style lang="scss" scoped>
.explorer {
  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
