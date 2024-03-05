<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<template>
  <nav class="navbar">
    <div class="innerNavbar">
      <div class="left">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2rem"
          height="2rem"
          viewBox="0 0 24 24"
          style="fill: rgba(253, 246, 246, 1)"
        >
          <path d="M13 9h-3v2h3a1 1 0 0 0 0-2z"></path>
          <path
            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm2.13 15-2.67-4H10v4H8V7h5a3 3 0 0 1 .79 5.88L16.54 17z"
          ></path>
        </svg>
      </div>
      <div class="right">
        <RouterLink
          to="/"
          :class="[
            'tab',
            router.currentRoute.value.fullPath.includes('buttons') ? '' : 'activeTab'
          ]"
        >
          LOGS
        </RouterLink>
        <RouterLink
          to="/buttons"
          :class="[
            'tab',
            router.currentRoute.value.fullPath.includes('buttons') ? 'activeTab' : ''
          ]"
        >
          BUTTONS</RouterLink
        >
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  height: var(--navbar-height);
  display: flex;
  padding-left: var(--content-wrapper-left-padding);
}

.innerNavbar {
  height: 100%;
  width: var(--content-width);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.tab {
  padding: 0 0.8rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid black;
  font-weight: bold;
}

.activeTab {
  border-bottom: 2px solid white;
}

.right {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}
</style>
