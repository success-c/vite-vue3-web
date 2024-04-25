import { RoutesMap, allRoutes } from "@/router/routes";
import { filterAsyncRouter } from "@/utils/permission";
import { defineStore } from "pinia";
import { markRaw, ref } from "vue";

export const userStore = defineStore("user", () => {
  const roleName = ref(["admin", "user"]);
  const routers = ref<RoutesMap[]>([]);
  const handleRoutes = () => {
    const router = markRaw(allRoutes);
    const accessedRoutes = filterAsyncRouter(router, roleName.value);
    routers.value = accessedRoutes;
  };

  return { handleRoutes, routers };
});
