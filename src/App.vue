<script setup lang="ts">
import { onBeforeMount } from "vue";
import appStore from "./store";
import CustomLayout from "./layout/index.vue";
import { RouterView, useRoute } from "vue-router";
onBeforeMount(() => {
  appStore.userStore.handleRoutes();
});
const route = useRoute();
</script>
<template>
  <CustomLayout v-if="!route.meta.noLayout"></CustomLayout>
  <RouterView v-else></RouterView>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.logo {
  padding: 1.5em;
  height: 6em;
  transition: filter 300ms;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
