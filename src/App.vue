<script setup lang="ts">
import { RouterView } from "vue-router"
import WebsocketProvider from "./context/WebsocketProvider.vue"
import NavbarPart from "./components/NavbarPart.vue"
import StatusPartVue from "./components/StatusPart.vue"
import SnackbarProvider from "./context/SnackbarProvider.vue"
import FooterPartVue from "./components/FooterPart.vue"
</script>

<template>
  <SnackbarProvider>
    <WebsocketProvider>
      <NavbarPart></NavbarPart>
      <main>
        <RouterView />
      </main>
      <StatusPartVue></StatusPartVue>
      <FooterPartVue></FooterPartVue>
    </WebsocketProvider>
  </SnackbarProvider>
</template>

<style scoped></style>
