<template lang="pug">
ALayout
  ALayoutHeader.layout-header
    .logo(@click="goHome")
        img(:src="Logo")
    AMenu(
      mode="horizontal"
      v-model:selectedKeys="selectedRoute"
      @click="linkToRoute"
    )
      AMenuItem(key="home" title="Home") Home
      AMenuItem(key="benchmark" title="Benchmark") Benchmark
      AMenuItem(key="security" title="Security") Security
    
    .logos
      i.iconfont.icon-ETHglobal(@click="jumpTo('eth')")
      i.iconfont.icon-GitHub(@click="jumpTo('github')")
      i.iconfont.icon-Polygon(@click="jumpTo('Polygon')")
      i.iconfont.icon-Polybase(@click="jumpTo('Polybase')")
      i.iconfont.icon-Gnosis(@click="jumpTo('Gnosis')")

  ALayoutContent
    slot

  ALayoutFooter
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Logo from '@/assets/logo.png'
const benchmarkPageList = ['benchmark', 'blockchain', 'explorer', 'explorer-block-list', 'explorer-transaction-list', 'explorer-block-detail', 'explorer-transaction-detail']

export default defineComponent({
  name: 'Nav',
  setup: () => {
    const route = useRoute()
    const router = useRouter()

    const selectedRoute = ref([String(route.name)])

    const linkToRoute = ({ key }) => {
      if (key !== String(route.name)) router.push({ name: key })
    }

    watch(
      () => route.name,
      () => {
        if (route.name) {
          if (benchmarkPageList.find((name) => name === String(route.name))) selectedRoute.value = ['benchmark']
          else selectedRoute.value = [String(route.name)]
        }
      }
    )

    const goHome = () => {
      router.push({ name: 'home' })
    }

    const jumpTo = (where) => {
      if (where === 'eth') window.open('https://ethglobal.com/showcase/tbs-hqkne')
      else if (where === 'github') window.open('https://github.com/ericwangqing/tbs')
      else if (where === 'Polygon') window.open('https://polygon.technology/')
      else if (where === 'Polybase') window.open('https://polybase.xyz/')
      else if (where === 'Gnosis') window.open('https://www.gnosis.io/')
    }

    return {
      route,
      selectedRoute,
      Logo,
      goHome,
      linkToRoute,
      jumpTo
    }
  }
})
</script>

<style lang="sass" scoped>
.ant-layout
  height: 100%
  background: #212435

  .layout-header
    position: relative
    width: 100%
    display: flex
    align-items: center
    justify-content: center
    height: 90px
    background: #212435
    box-shadow: 0px 1px 8px 0px rgba(255, 255, 255, 0.15)
    z-index: 1000

    .logo
      position: absolute
      left: 0
      display: inline-block
      font-size: 30px
      margin-right: 282px
      user-select: none
      height: 100%
      color: #fff
      cursor: pointer
      img
        max-height: 100%

    .ant-menu
      line-height: 90px
      font-size: 20px
      background: transparent
      border-bottom-color: transparent
      color: rgba(255, 255, 255, 0.5)
      font-family: 'PangMenZhengDaoBiao'
      :deep .ant-menu-item
        padding: 0
        font-weight: 400
        transition: all 0.3s
        opacity: 1 !important
        height: auto !important
        order: unset !important
        position: relative !important
        .ant-menu-title-content
          text-align: center
          display: block
        &::before
          display: block
          content: attr(title)
          font-weight: bold
          visibility: hidden
          height: 1px
          color: transparent
          margin-bottom: -1px
          overflow: hidden
          padding: 0 60px
        &:after
          border-bottom-width: 8px
          border-color: transparent
          left: 0
          right: 0
        &-selected
          color: #fff
          font-weight: bold
          &::after
            border-image: linear-gradient(90deg,#ffcb00 3%, #f08b00 96%) 1
        &:hover
          color: #fff
          &:after
            border-color: transparent
      :deep .ant-menu-overflow-item-rest
        display: none !important
    .logos
      position: absolute
      right: 30px
      display: flex
      i
        margin: 0 8px
        font-size: 32px
        color: rgba(255, 255, 255, 0.65)
        cursor: pointer
        &:hover
          color: #fff
  &-content
    flex-grow: 1

  &-footer
    color: #fff
    text-align: center
    background: transparent
    position: absolute
    bottom: 0
    left: 0
    right: 0
    padding-bottom: 8px

</style>
