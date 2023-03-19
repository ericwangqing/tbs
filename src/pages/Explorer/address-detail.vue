<template>
  <div class="px-48px pt-12px pb-48px h-100%">
    <div class="text-white text-36px">
      <span>address</span>
      <span class="text-white text-16px ml-8px"> {{ address }}</span>
    </div>
  </div>
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const address = computed(() => {
  return route.params.hash
})
</script>
