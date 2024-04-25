<template>
  <LayoutSider hide-trigger collapsible :collapsed="collapsed">
    <div class="logo"><span v-if="!collapsed">未来延学管理后台</span></div>
    <Menu
      :default-open-keys="openKeys"
      :default-selected-keys="selectKey"
      :style="{ width: '100%' }"
      @menuItemClick="onClickMenuItem"
      @subMenuClick="onClickSubMenu"
    >
      <template v-for="item in menus">
        <MenuItem :key="item.path" v-if="!item.children">
          <component :is="item.meta.icon"></component>
          {{ item.meta.title }}</MenuItem
        >
        <SubMenu v-else :key="item.name">
          <template #title>
            <component :is="item.meta.icon"></component>
            {{ item.meta.title }}</template
          >
          <MenuItem v-for="ee in item.children" :key="ee.path">{{
            ee.meta.title
          }}</MenuItem>
        </SubMenu>
      </template>
    </Menu>
  </LayoutSider>
</template>
<script setup lang="ts">
import router from "@/router";
import appStore from "@/store";
import { LayoutSider, SubMenu, Menu, MenuItem } from "@arco-design/web-vue";
import { onMounted, ref, toRefs, watch } from "vue";
import { useRoute } from "vue-router";
interface Props {
  collapsed: boolean;
}
const props = defineProps<Props>();
const { collapsed } = toRefs(props);
const selectKey = ref<string[]>([]);
const openKeys = ref<string[]>(
  localStorage.getItem("openKeys")
    ? JSON.parse(localStorage.getItem("openKeys")!)
    : []
);
const route = useRoute();

const onClickMenuItem = (key: string) => {
  if (key === location.pathname) {
    return;
  }
  router.push(key);
};
const onClickSubMenu = (key: string) => {
  if (key === location.pathname) {
    return;
  }
  openKeys.value.push(key);
  localStorage.setItem("openKeys", JSON.stringify(openKeys.value));
};

watch(
  () => route.path,
  (newVal) => {
    selectKey.value.shift();
    selectKey.value.push(newVal);
  },
  { immediate: true, deep: true }
);
const handleRoute = (routes) => {
  const arr = [];
  routes.forEach((item) => {
    if (item.children?.length) {
      item.children = handleRoute(item.children);
    }
    if (!item.meta?.isStaticPage && !item.meta?.hidden) {
      arr.push(item);
    }
  });

  return arr;
};

const getMenus = () => {
  const routes = JSON.parse(JSON.stringify(appStore.userStore.routers));

  return handleRoute(routes);
};
const menus = ref([]);
onMounted(() => {
  menus.value = getMenus();
});
</script>
<style scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-weight: 700;
}
</style>
