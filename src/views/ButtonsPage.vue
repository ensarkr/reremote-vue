<script setup lang="ts">
import ButtonEdit from "@/components/ButtonEdit.vue"
import CircleLoader from "@/components/CircleLoader.vue"
import ConnectionActions from "@/components/ConnectionActions.vue"
import type { customButtonT } from "@/typings/button"
import type { connectionStatusT } from "@/typings/websocket"
import { inject, ref, type Ref } from "vue"

const customButtons = inject<Ref<customButtonT[] | null>>("customButtons")
const connectionStatus = inject<Ref<connectionStatusT>>("connectionStatus")

if (customButtons === undefined) throw 'trying to inject "customButtons" without providing'
if (connectionStatus === undefined) throw 'trying to inject "connectionStatus" without providing'

const chosenButton = ref<customButtonT | null>(null)

const chooseButton = (customButtonID?: string) => {
  if (customButtonID !== undefined && customButtons.value !== null)
    chosenButton.value = customButtons.value.find(
      (e) => e.custom_button_id === customButtonID
    ) as customButtonT
  else chosenButton.value = null
}
</script>

<template>
  <div class="content">
    <div
      class="buttonList"
      :class="{ centered: connectionStatus !== 'connected' || customButtons === null }"
    >
      <!-- loading or custom buttons loading -->
      <CircleLoader
        v-show="connectionStatus === 'loading' || customButtons === null"
        color="white"
        height="2rem"
      >
      </CircleLoader>

      <!-- closed or error -->
      <ConnectionActions :connection-status="connectionStatus"></ConnectionActions>

      <!-- customButtons fetched -->
      <button
        v-show="customButtons !== null"
        :class="[
          'buttonItem',
          chosenButton?.custom_button_id === item.custom_button_id ? 'chosenButton' : ''
        ]"
        v-for="(item, index) in customButtons"
        :key="index"
        @click="
          () => {
            chooseButton(item.custom_button_id)
          }
        "
      >
        {{ item.custom_button_name }}
      </button>
      <button
        v-show="customButtons !== null"
        :class="['buttonItem', chosenButton === null ? 'chosenButton' : '']"
        @click="
          () => {
            chooseButton()
          }
        "
      >
        add new button
      </button>
    </div>
    <div class="buttonEditWrapper">
      <!-- customButtons fetched -->
      <ButtonEdit
        :chosenButton="chosenButton"
        v-show="customButtons !== null"
        :key="chosenButton === null ? 'defaultKey' : chosenButton.custom_button_id"
      >
      </ButtonEdit>
    </div>
  </div>
</template>

<style scoped>
.content {
  width: var(--content-width);
  height: 100%;
  display: flex;
  gap: 1rem;
  padding: 0 0.2rem;
  box-sizing: border-box;
}

.buttonList {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 3px;
  overflow: auto;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
}

.centered {
  justify-content: center;
  align-items: center;
}

.buttonItem {
  margin: 0;
  padding: 0.5rem 0.5rem;
  text-align: start;
}

.buttonItem:hover {
  background-color: rgba(36, 35, 35, 0.973);
}

.chosenButton {
  background-color: rgba(36, 35, 35, 0.973);
}

.buttonEditWrapper {
  flex: 1;
  height: 100%;
}
</style>
