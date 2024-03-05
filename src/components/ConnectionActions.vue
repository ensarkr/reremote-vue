<script setup lang="ts">
import type { connectionStatusT } from "@/typings/websocket"
import { inject } from "vue"

defineProps<{ connectionStatus: connectionStatusT }>()

const tryUntilConnectInitial = inject<() => Promise<void>>("tryUntilConnectInitial")
</script>

<template>
  <div v-show="connectionStatus === 'closed' || connectionStatus === 'error'" class="main">
    <h3 class="title">
      {{ connectionStatus === "error" ? "could not find the port" : "connection closed" }}
    </h3>
    <button class="button" @click="tryUntilConnectInitial">RETRY</button>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.button {
  font-size: 0.9rem;
  padding: 0.3rem 0.5rem;
  border-radius: 3px;
  border: 1px solid var(--border-color);
}
</style>
