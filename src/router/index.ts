import appStore from "@/store";
import { RoutesMap, routes } from "./routes";
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});
let hasRoles = true;
router.beforeEach((to, _, next) => {
  if (to.path == "/") {
    router.push("/dashboard");
  }
  // 设置页面标题
  document.title = `${to.meta.title} - 未来延学`;
  const routers = appStore.userStore.routers;
  if (hasRoles) {
    routers.forEach((route: RoutesMap) => {
      router.addRoute(route as any);
    });
    hasRoles = false;
    next({ ...to, replace: true });
  } else {
    next();
  }
});

export default router;
