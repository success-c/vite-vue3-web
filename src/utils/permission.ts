import { RoutesMap } from "@/router/routes";

function hasPermission(permissions: string[], route: RoutesMap) {
  if (route.meta && route.meta.roleName) {
    return route.meta.roleName.some((role) => permissions.includes(role));
  }
  return true;
}

export const filterAsyncRouter = (
  routes: RoutesMap[],
  permissions: string[]
) => {
  const accessedRouters = routes.filter((route: RoutesMap) => {
    if (hasPermission(permissions, route)) {
      if (route.children && route.children.length > 0) {
        route.children = filterAsyncRouter(route.children, permissions);
      }
      return true;
    }
    return false;
  });

  return accessedRouters;
};
