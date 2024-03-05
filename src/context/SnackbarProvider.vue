<script setup lang="ts">
import { provide, ref } from "vue"
import SnackbarItem from "../components/SnackbarItem.vue"

export type snackbarItemT = { id: string; message: string; secondaryColor?: string }

const snackbar = ref<snackbarItemT[]>([])

const addSnackbarItem = (item: Pick<snackbarItemT, "message" | "secondaryColor">) => {
  snackbar.value = [...snackbar.value, { id: Math.random().toString(), ...item }]
}

const removeSnackbarItem = (id: string) => {
  snackbar.value = snackbar.value.filter((e) => e.id !== id)
}

provide("addSnackbarItem", addSnackbarItem)
provide("removeSnackbarItem", removeSnackbarItem)
</script>

<template>
  <div class="snackbarHolder">
    <SnackbarItem v-for="item in snackbar" :key="item.id" :snackbarItemData="item"> </SnackbarItem>
  </div>

  <slot></slot>
</template>

<style scoped>
.snackbarHolder {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: none;
  padding: 1rem;
  box-sizing: border-box;
  max-width: 320px;
  z-index: 2;
}
</style>
