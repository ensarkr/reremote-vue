<script setup lang="ts">
import { inject, onUnmounted } from "vue"
import type { snackbarItemT } from "@/context/SnackbarProvider.vue"

const { snackbarItemData } = defineProps<{ snackbarItemData: snackbarItemT }>()

const removeSnackbarItem = inject<(id: string) => void>("removeSnackbarItem")

const timeout = setTimeout(() => {
  if (removeSnackbarItem !== undefined) {
    removeSnackbarItem(snackbarItemData.id)
  }
}, 2500)

onUnmounted(() => clearTimeout(timeout))
</script>

<template>
  <div class="snackbarItem">
    {{ snackbarItemData.message }}
  </div>
</template>

<style scoped>
.snackbarItem {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: black;
  color: white;
  pointer-events: auto;
  border: 1px solid var(--border-color);
}
</style>
