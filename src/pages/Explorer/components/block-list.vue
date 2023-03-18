<template>block-list</template>
<script setup>
import { inject, onMounted } from 'vue'
const TBSApi = inject('TBSApi')

onMounted(async () => {
  const number = await TBSApi.getBlockNumber()
  console.log(number, 111111111111)
})
</script>
