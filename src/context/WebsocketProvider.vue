<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import type {
  requestT,
  allResponsesT,
  updateT,
  portsT,
  requestWithConIDT
} from "../typings/websocket"
import type { customButtonT } from "@/typings/button"
import type { connectionStatusT, resolverItemT } from "@/typings/websocket"
const connectionStatus = ref<connectionStatusT>("loading")
const ports = ref<portsT>({
  ip: "localhost",
  actions: "loading",
  frontend: "loading",
  settings: "loading"
})
const websocket = ref<WebSocket | null>(null)
const logs = ref<string[]>([])
const customButtons = ref<customButtonT[] | null>(null)
const resolvers = ref<resolverItemT[]>([])

const tryUntilConnect = async () => {
  connectionStatus.value = "loading"
  let port = 7272

  for (let i = 0; i < 30; i++) {
    const socket = new WebSocket(`ws://localhost:${port}/`)

    socket.onopen = () => {
      websocket.value = socket
      connectionStatus.value = "connected"
      i = 30
    }

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    })

    if (i > 10) port++
  }
  setupWebsocket()
}

const resetEverything = () => {
  logs.value = []
  customButtons.value = null
  ports.value = { ip: "localhost", actions: "loading", frontend: "loading", settings: "loading" }
}

const setupWebsocket = async () => {
  if (websocket.value !== null) {
    websocket.value.onclose = () => {
      connectionStatus.value = "closed"
      resetEverything()
    }

    websocket.value.onerror = () => {
      connectionStatus.value = "error"
      resetEverything()
    }

    websocket.value.onmessage = (ev: MessageEvent) => {
      const data: allResponsesT | updateT = JSON.parse(ev.data)

      if (data.type === "update") {
        if (data.log !== undefined) {
          // * don not show any log until all logs are fetched
          if (logs.value.length > 0) logs.value = [...logs.value, data.log]
        } else if (data.custom_buttons !== undefined) {
          customButtons.value = data.custom_buttons
        } else if (data.ports !== undefined) {
          ports.value = data.ports
        }
      } else {
        const resolver = resolvers.value.find((e) => e.con_id === data.con_id)
        if (resolver !== undefined) {
          resolver.resolver(data)
          resolvers.value = resolvers.value.filter((e) => e.con_id !== data.con_id)
        }
      }
    }
    {
      const res = await sendMessage({ name: "get_custom_buttons" })
      if (res.status && res.value.custom_buttons) {
        customButtons.value = res.value.custom_buttons
      }
    }
    {
      const res = await sendMessage({ name: "get_logs" })
      if (res.status && res.value.logs) {
        logs.value = res.value.logs
      }
    }
    {
      const res = await sendMessage({ name: "get_ports" })
      if (res.status && res.value.ports) {
        ports.value = res.value.ports
      }
    }
  } else {
    connectionStatus.value = "error"
    resetEverything()
  }
}

const sendMessage = (message: requestT): Promise<allResponsesT> => {
  return new Promise((resolve) => {
    const conID = Math.random().toString()
    const errorResponse: allResponsesT = {
      status: false,
      con_id: conID,
      type: "response",
      error_message: "websocket connection error"
    }

    if (websocket.value === null || !websocket.value.OPEN) return resolve(errorResponse)

    const req: requestWithConIDT = { ...message, con_id: conID }
    try {
      websocket.value.send(JSON.stringify(req))
    } catch (error) {
      connectionStatus.value = "error"
      resetEverything()
    }
    resolvers.value = [...resolvers.value, { con_id: conID, resolver: resolve }]
    setTimeout(() => {
      resolve(errorResponse)
    }, 5000)
  })
}

onMounted(() => {
  tryUntilConnect()
})

const tryUntilConnectInitial = tryUntilConnect

provide("connectionStatus", connectionStatus)
provide("logs", logs)
provide("customButtons", customButtons)
provide("sendMessage", sendMessage)
provide("ports", ports)
provide("tryUntilConnectInitial", tryUntilConnectInitial)
</script>

<template>
  <slot></slot>
</template>
