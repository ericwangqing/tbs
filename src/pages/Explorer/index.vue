<template lang="pug">
.explorer.overflow-auto.h-full(ref="explorer" :class="{ needScroll: needScroll }")
  .max-w-1400px.mx-auto.pt-12px.pb-48px
      .flex.pt-20px.pb-36px.text-white
          left-outlined.mt-12px.mr-8px.cursor-pointer(@click="back()")
          .text-white
              .text-24px.font-medium 
                component(:is='name',v-if="typeof name==='object'")
                template(v-else) {{name}}
              .text-12px(class="text-white/50")
                  component(:is='label',v-if="typeof label=='object'")
                  template(v-else) {{label}}
      router-view(@finish="handleFinish")
</template>
<script setup lang="jsx">
import { h, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { LeftOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
const router = useRouter()
const route = useRoute()
const explorer = ref(null)
const needScroll = ref(false)
const routeName = route.name
let name, label
let routeOption
if (routeName === 'explorer-block-list') {
  const { type, index, chain } = route.query
  if (type === 'beacon') {
    name = <div class="font-bold">{chain || 'ETH'}</div>
    label = 'Time Beacon Chain'
  } else {
    name = <div class="font-bold">TBS</div>
    label = `S-${index}`.padStart(3, '0')
  }
  routeOption = {
    name: 'blockchain',
  }
} else if (routeName === 'explorer-transaction-list') {
  name = <div class="font-bold">Transactions</div>
  const query = route.query.block
  label = (
    <div>
      For Block
      <RouterLink class="ml-2px" style="color:#FFAE00" to={'/explorer/block/' + query}>
        {query}
      </RouterLink>
    </div>
  )
  routeOption = {
    path: `block/${query}`,
  }
} else if (routeName === 'explorer-block-detail') {
  const block = route.params.blockNumber
  name = (
    <div class="font-bold">
      Block
      <span class="ml-8px" style="font-size:12px"> # </span>
      <RouterLink
        style="color:#FFAE00;font-size:12px"
        to={'/explorer/block/' + block}
      >
        {block}
      </RouterLink>
    </div>
  )
  label = 'Time Beacon Chain'
  routeOption = {
    name: `explorer-block-list`,
  }
} else if (routeName === 'explorer-transaction-detail') {
  const block = route.params.blockNumber
  name = <div class="font-bold">Transaction Details</div>
  label = 'Time Beacon Chain'
  routeOption = {
    name: `explorer-transaction-list`,
  }
} else if (routeName === 'explorer-address-detail') {
  name = <div class="font-bold">Address Details</div>
  label = 'Time Beacon Chain'
}
function back() {
  const routers = router.getRoutes()
  if (routers.length > 1) {
    router.back()
  } else {
    routeOption && router.push(routeOption)
  }
}

const calcNeedScroll = async () => {
  await nextTick()
  if (!explorer.value) needScroll.value = false;
  needScroll.value = explorer.value.scrollHeight > explorer.value.clientHeight
}

onMounted(() => {
  window.addEventListener('resize', calcNeedScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', calcNeedScroll)
})

const handleFinish = () => {
  calcNeedScroll()
}
</script>
<style lang="scss" scoped>
.explorer.needScroll {
  padding-left: 28px;
}
</style>
