<template>
  <Breadcrumb separator="/">
    <template v-for="item in breadcrumbData" :key="item.path">
      <BreadcrumbItem :style="{ margin: '16px 0' }">
        {{ item.meta.title }}
      </BreadcrumbItem>
    </template>
  </Breadcrumb>
</template>
<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from "@arco-design/web-vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
// 生成数组数据
const breadcrumbData = ref<any[]>([]);
const getBreadcrumbData = () => {
  breadcrumbData.value = route.matched.filter(
    (item) => item.meta && item.meta.title
  );
  // console.log(breadcrumbData.value)
};
// 监听路由变化时触发
watch(
  route,
  () => {
    getBreadcrumbData();
  },
  {
    immediate: true
  }
);
</script>
<style scoped>
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  opacity: 0;
  transition: all 0.3s;
  transform: translateX(20px);
}
</style>
