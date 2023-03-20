<template lang="pug">
.search-bar-container(:class="{'search-bar-active': focus}")
  input.search-bar-input(v-model="searchInput" @keyup.enter="onSearch" :placeholder="placeholder" @focus="onFocus" @blur="onBlur")
  slot
    SearchOutlined.search-bar-icon(@click="onSearch")
</template>

<script>
import {defineComponent, ref} from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: "SearchBar",
  components: { SearchOutlined },
  emits: ['search'],
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  setup: (props, { emit }) => {
    const searchInput = ref('')
    const focus = ref(false)
    const onSearch = () => {
      emit('search', searchInput.value)
    }
    const onFocus = () => {
      focus.value = true
    }
    const onBlur = () => {
      focus.value = false
    }
    return {
      searchInput,
      focus,
      onSearch,
      onFocus,
      onBlur
    }
  }
})
</script>

<style lang="scss" scoped>
.search-bar-container {
  width: 210px;
  height: 30px;
  border: 1px solid rgba(255,255,255,0.45);
  border-radius: 4px;
  padding-left: 12px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 30px;
  transition: border 200ms ease;
  .search-bar-input {
    background: transparent;
    outline: none;
    border: none;
    height: fit-content;
    width: 160px;
    font-size: 14px;
    ::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    color: rgba(255, 255, 255, 0.8);
    line-height: 20px;
  }
  .search-bar-icon {
    color: white;
    font-size: 20px;
  }
}
.search-bar-active {
  border: 1px solid rgba(255,255,255,0.8);
}
</style>
