<script setup lang="ts">
import CircleLoader from "@/components/CircleLoader.vue"
import ConnectionActions from "@/components/ConnectionActions.vue"
import type { connectionStatusT } from "@/typings/websocket"
import { inject, type Ref } from "vue"

const connectionStatus = inject<Ref<connectionStatusT>>("connectionStatus")
const logs = inject<Ref<string[]>>("logs")

if (connectionStatus === undefined) throw 'trying to inject "connectionStatus" without providing'

if (logs === undefined) throw 'trying to inject "logs" without providing'
</script>

<template>
  <div class="content">
    <div class="logs" :class="{ centered: connectionStatus !== 'connected' || logs.length === 0 }">
      <p
        v-show="connectionStatus === 'connected'"
        class="log"
        v-for="(item, index) in logs"
        :key="index"
      >
        {{ item }}
      </p>

      <CircleLoader
        v-show="
          connectionStatus === 'loading' || (connectionStatus === 'connected' && logs.length === 0)
        "
        color="white"
        height="2rem"
      >
      </CircleLoader>

      <ConnectionActions :connection-status="connectionStatus"></ConnectionActions>
    </div>
  </div>
</template>

<style scoped>
.content {
  width: var(--content-width);
  height: 100%;
  padding: 0 0.2rem;
  box-sizing: border-box;
}

.logs {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0.5rem;
  border-radius: 3px;
  overflow: auto;
  box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
}

.centered {
  justify-content: center;
  align-items: center;
}

.log {
  margin: 0;
  padding: 0.75rem 0.5rem;
  border-radius: 2px;
}

.log:hover {
  background-color: rgba(36, 35, 35, 0.973);
}
</style>
