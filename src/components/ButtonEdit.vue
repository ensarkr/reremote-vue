<script setup lang="ts">
import type { snackbarItemT } from "@/context/SnackbarProvider.vue"
import type { customButtonT } from "@/typings/button"
import type { requestT, allResponsesT } from "@/typings/websocket"
import { inject, ref } from "vue"

const { chosenButton } = defineProps<{ chosenButton: customButtonT | null }>()
const buttonName = ref<customButtonT["custom_button_name"]>(
  chosenButton === null ? "" : chosenButton.custom_button_name
)
const buttonType = ref<customButtonT["custom_button_type"]>(
  chosenButton === null ? "run_app" : chosenButton.custom_button_type
)
const appPath = ref<string>(
  chosenButton !== null && chosenButton.custom_button_type === "run_app"
    ? chosenButton.app_path
    : ""
)
const cli = ref<"cmd" | "powershell">(
  chosenButton !== null && chosenButton.custom_button_type === "run_command"
    ? chosenButton.cli
    : "cmd"
)
const command = ref<string>(
  chosenButton !== null && chosenButton.custom_button_type === "run_command"
    ? chosenButton.command
    : ""
)
const status = ref<"loading" | "available">("available")

const addSnackbarItem =
  inject<(item: Pick<snackbarItemT, "message" | "secondaryColor">) => void>("addSnackbarItem")
if (addSnackbarItem === undefined) throw 'trying to inject "addSnackbarItem" without providing'

const sendMessage = inject<(message: requestT) => Promise<allResponsesT>>("sendMessage")
if (sendMessage === undefined) throw 'trying to inject "sendMessage" without providing'

const run = async () => {
  status.value = "loading"
  switch (buttonType.value) {
    case "run_app": {
      if (appPath.value.trim().length === 0) {
        status.value = "available"
        addSnackbarItem({ message: "empty app path" })
        return
      }

      const res = await sendMessage({ name: "run_app", app_path: appPath.value })

      if (res.status) {
        status.value = "available"
        addSnackbarItem({ message: "successfully ran" })
        return
      } else {
        status.value = "available"
        addSnackbarItem({ message: res.error_message })
        return
      }
    }
    case "run_command": {
      if (command.value.trim().length === 0) {
        status.value = "available"
        addSnackbarItem({ message: "empty command" })
        return
      }

      const res = await sendMessage({ name: "run_command", cli: cli.value, command: command.value })

      if (res.status) {
        status.value = "available"
        addSnackbarItem({ message: "successfully ran" })
        return
      } else {
        status.value = "available"
        addSnackbarItem({ message: res.error_message })
        return
      }
    }
  }
}

const add = async () => {
  status.value = "loading"
  if (buttonName.value.trim().length === 0) {
    status.value = "available"
    addSnackbarItem({ message: "empty button name" })
    return
  }

  switch (buttonType.value) {
    case "run_app": {
      if (appPath.value.trim().length === 0) {
        status.value = "available"
        addSnackbarItem({ message: "empty app path" })
        return
      }

      const res = await sendMessage({
        name: "add_custom_button",
        custom_button_data: {
          custom_button_id:
            chosenButton === null ? Math.random().toString() : chosenButton.custom_button_id,
          custom_button_name: buttonName.value,
          custom_button_type: "run_app",
          app_path: appPath.value
        }
      })

      if (res.status) {
        status.value = "available"
        addSnackbarItem({ message: "success" })
        return
      } else {
        status.value = "available"
        addSnackbarItem({ message: res.error_message })
        return
      }
    }
    case "run_command": {
      if (command.value.trim().length === 0) {
        status.value = "available"
        addSnackbarItem({ message: "empty command" })
        return
      }

      const res = await sendMessage({
        name: "add_custom_button",
        custom_button_data: {
          custom_button_id:
            chosenButton === null ? Math.random().toString() : chosenButton.custom_button_id,
          custom_button_name: buttonName.value,
          custom_button_type: "run_command",
          cli: cli.value,
          command: command.value
        }
      })

      if (res.status) {
        status.value = "available"
        addSnackbarItem({ message: "success" })
        return
      } else {
        status.value = "available"
        addSnackbarItem({ message: res.error_message })
        return
      }
    }
  }
}

const remove = async () => {
  if (chosenButton === null) {
    return
  }

  status.value = "loading"
  const res = await sendMessage({
    name: "remove_custom_button",
    custom_button_id: chosenButton.custom_button_id
  })

  if (res.status) {
    status.value = "available"
    addSnackbarItem({ message: "successfully removed" })
    return
  } else {
    status.value = "available"
    addSnackbarItem({ message: res.error_message })
    return
  }
}
</script>

<template>
  <div class="buttonEdit">
    <input v-model="buttonName" class="buttonName" placeholder="Button name" />
    <div class="buttonGroup">
      <span class="padTitle">TYPE</span>
      <button
        :class="['button', buttonType === 'run_app' ? 'selectedButton' : '']"
        @click="buttonType = 'run_app'"
      >
        APP
      </button>
      <button
        :class="['button', buttonType === 'run_command' ? 'selectedButton' : '']"
        @click="buttonType = 'run_command'"
      >
        COMMAND
      </button>
    </div>

    <div v-show="buttonType === 'run_app'">
      <span class="padTitle">APP PATH</span>
    </div>
    <input
      t
      v-show="buttonType === 'run_app'"
      class="smallInput"
      placeholder="C:\Windows\System32\calc.exe"
      v-model="appPath"
    />

    <div v-show="buttonType === 'run_command'" class="buttonGroup">
      <span class="padTitle">CLI</span>
      <button :class="['button', cli === 'cmd' ? 'selectedButton' : '']" @click="cli = 'cmd'">
        CMD
      </button>
      <button
        :class="['button', cli === 'powershell' ? 'selectedButton' : '']"
        @click="cli = 'powershell'"
      >
        POWERSHELL
      </button>
    </div>

    <div v-show="buttonType === 'run_command'">
      <span class="padTitle">COMMAND</span>
    </div>
    <textarea
      rows="3"
      title="command"
      v-show="buttonType === 'run_command'"
      class="smallInput"
      placeholder="notepad"
      v-model="command"
    ></textarea>

    <div class="buttons">
      <button
        v-show="chosenButton !== null"
        class="bigButton"
        :disabled="status === 'loading'"
        @click="remove"
      >
        REMOVE
      </button>

      <button class="bigButton" :disabled="status === 'loading'" @click="run">RUN</button>
      <button class="bigButton" :disabled="status === 'loading'" @click="add">
        {{ chosenButton === null ? "ADD" : "SAVE" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.buttonEdit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.buttonName {
  background-color: black;
  color: white;
  padding: 1rem 0.5rem;
  font-size: 1.5rem;
  border: 1px solid var(--border-color);
  outline: none;
  border-radius: 3px;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
}

.padTitle {
  padding-left: 0.5rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.button {
  font-size: 0.9rem;
  padding: 0.3rem 0.5rem;
  border-radius: 3px;
  border: 1px solid var(--border-color);
}

.buttonGroup {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  gap: 1rem;
}

.selectedButton {
  color: black;
  background-color: rgba(255, 255, 255, 0.863);
}

.smallInput {
  background-color: black;
  color: white;
  padding: 0.5rem 0.5rem;
  font-size: 1.2rem;
  border: 1px solid var(--border-color);
  outline: none;
  border-radius: 3px;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.bigButton {
  font-size: 1.1rem;
  padding: 0.4rem 0.6rem;
  border-radius: 3px;
  border: 1px solid var(--border-color);
}
</style>
