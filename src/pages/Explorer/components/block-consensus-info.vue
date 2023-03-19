<template>
  <div v-if="block">
    <div>
      <description-item>
        <template #label>Slot</template>
        Slot
      </description-item>
    </div>
  </div>
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect } from 'vue'
import DescriptionItem from '@/pages/explorer/components/description-item.vue'
const { block } = defineProps(['block'])
</script>
