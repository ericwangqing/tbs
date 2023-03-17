<template lang="pug">
ScannedBox.charts-btn(v-show="!chartVisible" :noRightWrapper="true" @click="chartVisible=!chartVisible")
  LineChartOutlined
.charts-wrapper(:style="{ opacity: chartVisible ? 1 : 0 }")
  AButton.close-btn(type="text" @click="chartVisible=!chartVisible")
    CloseOutlined
  Performance.performance
  .divider
  Resource.resource
</template>

<script>
import { defineComponent, ref } from 'vue'
import ScannedBox from '@/components/ScannedBox.vue'
import { LineChartOutlined, CloseOutlined } from '@ant-design/icons-vue'
import Performance from './Performance.vue'
import Resource from './Resource.vue'

export default defineComponent({
  name: 'Charts',
  components: {
    ScannedBox,
    LineChartOutlined,
    CloseOutlined,
    Performance,
    Resource
  },
  setup: () => {
    const chartVisible = ref(false)
    return {
      chartVisible
    }
  }
})
</script>

<style scoped lang="scss">
.charts-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  height: 72px;
  width: 72px;
  color: #fff;
  font-size: 40px;
  line-height: 72px;
  text-align: center;
  cursor: pointer;
  z-index: 100;
}
.charts-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  padding-top: 20px;
  width: 38vw;
  height: 100%;
  margin-left: 1.5vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(90deg,rgba(33,36,53,0.00), #212435 50%);
  backdrop-filter: blur(10px);
  border-left: solid 1px rgba(255, 255, 255, 0.3);
  .close-btn {
    position: absolute;
    z-index: 10;
    top: 20px;
    color: #fff;
    right: 50px;
    font-size: 24px;
    height: 40px;
    width: 40px;
  }
  .divider {
    height: 1px;
    width: calc(100% - 60px);
    margin: 0 30px;
    background: rgba(255, 255, 255, 0.3);
  }
  .performance, .resource {
    width: 100%;
    height: 47.5%;
  }
}
</style>