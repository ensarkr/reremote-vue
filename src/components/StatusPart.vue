<script setup lang="ts">
import type { connectionStatusT } from "@/typings/websocket"
import type { portsT } from "@/typings/websocket"
import { inject, type Ref } from "vue"

const ports = inject<portsT>("ports")
const connectionStatus = inject<Ref<connectionStatusT>>("connectionStatus")

if (ports === undefined) throw 'trying to inject "ports" without providing'
if (connectionStatus === undefined) throw 'trying to inject "connectionStatus" without providing'
</script>

<template>
  <div class="status">
    <div
      class="dot"
      :class="{
        greenDot: ports.actions !== 'loading',
        grayDot: ports.actions === 'loading' || connectionStatus === 'loading',
        redDot: connectionStatus === 'error',
        blackDot: connectionStatus === 'closed'
      }"
    ></div>
    <span class="url" v-show="ports.ip !== 'localhost' && ports.actions !== 'loading'">
      {{ ports.ip + ":" + ports.actions }}
    </span>
  </div>
</template>

<style scoped>
.status {
  font-size: 1.1rem;
  height: var(--status-height);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: var(--content-width);
  margin-left: var(--content-wrapper-left-padding);
  gap: 0.3rem;
}

.url {
  padding-right: 0.8rem;
}

.dot,
.greenDot,
.grayDot,
.redDot,
.blackDot {
  animation: blinker 2s linear infinite;
  height: 1rem;
  width: 1rem;
  border-radius: 100%;
}

.greenDot {
  border: 1px solid green;
  background-color: green;
}

.grayDot {
  border: 1px solid gray;
  background-color: gray;
}

.redDot {
  border: 1px solid red;
  background-color: red;
}

.blackDot {
  border: 1px solid black;
  background-color: black;
}

@keyframes blinker {
  50% {
    opacity: 0.6;
  }
}
</style>
