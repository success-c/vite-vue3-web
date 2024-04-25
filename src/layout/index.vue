<template>
  <Layout class="layout">
    <Slider :collapsed="collapsed"></Slider>
    <Layout>
      <LayoutHeader style=" display: flex; align-items: center;padding: 0 20px">
        <Button shape="round" @click="onCollapse">
          <IconCaretRight v-if="collapsed" />
          <IconCaretLeft v-else />
        </Button>
        <div style=" display: flex;margin-left: auto">
          <span style="margin-right: 15px">欢迎回来~</span>
          <div>
            <Popover trigger="click" position="bottom">
              <span class="button">BOTTOM</span>
              <template #content>
                <p class="item">修改密码</p>
                <p class="item">退出登录</p>
              </template>
            </Popover>
          </div>
        </div>
      </LayoutHeader>
      <Layout style="padding: 0 24px">
        <ZBreadcrumb></ZBreadcrumb>
        <div style="flex: 1">
          <RouterView v-cloak v-slot="{ Component, route }">
            <template v-if="Component">
              <transition name="slide" mode="out-in">
                <KeepAlive include="dashboard">
                  <component
                    style="
                      padding: 20px;
                      height: 100%;
                      background-color: #fff;
                      border-radius: 10px;
                      box-sizing: border-box;
                    "
                    :is="Component"
                    :key="route.name"
                  />
                </KeepAlive>
              </transition>
            </template>
          </RouterView>
        </div>

        <LayoutFooter>北京赛博公司</LayoutFooter>
      </Layout>
    </Layout>
  </Layout>
</template>
<script setup lang="ts">
import {
  IconCaretRight,
  IconCaretLeft
  // IconHome,
  // IconCalendar
} from "@arco-design/web-vue/es/icon";
import Slider from "./sider/index.vue";
import ZBreadcrumb from "./breadcrumb/index.vue";
import {
  Layout,
  LayoutHeader,
  Button,
  LayoutFooter,
  Popover
} from "@arco-design/web-vue";
import { ref } from "vue";
import { RouterView } from "vue-router";
const collapsed = ref(false);
const onCollapse = () => {
  collapsed.value = !collapsed.value;
};
</script>
<style scoped lang="scss">
.slide-enter-from,
.slide-leave-to {
  transform: translateX(30px);
  opacity: 0;
  transition: all 0.4s;
}

.slide-enter-to,
.slide-leave-form {
  transform: translateX(0);
  opacity: 1;
  transition: all 0.2s 0.2s;
}

.layout {
  height: 100%;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
}

.layout :deep(.arco-layout-sider) .logo {
  margin: 12px 8px;
  height: 32px;
  background: rgb(255 255 255 / 20%);
}

.layout :deep(.arco-layout-sider-light) .logo {
  background: var(--color-fill-2);
}

.layout :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
  background: var(--color-bg-3);
}

.layout :deep(.arco-layout-footer) {
  height: 48px;
  font-size: 14px;
  color: var(--color-text-2);
  font-weight: 400;
  line-height: 48px;
}

.layout :deep(.arco-layout-content) {
  font-size: 14px;
  color: var(--color-text-2);
  background-color: var(--color-bg-3);
  font-weight: 400;
}

.layout :deep(.arco-layout-content) {
  padding: 20px;
  border-radius: 10px;
}

.layout :deep(.arco-layout-footer) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
}

.item {
  width: 80px;
  height: 40px;
  text-align: center;
  transition: all 0.3s;
  line-height: 40px;
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: #368bec;
  }
}
</style>
