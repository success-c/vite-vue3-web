export type Meta = {
  isChild: boolean;
  parentPath: string;
  title: string;
  icon: any;
  order: number;
  isStaticPage?: boolean;
  index: number;
  hidden?: boolean;
  noLayout?: boolean;
  roleName?: Array<string>;
};
export type RoutesMap = {
  path: string;
  name: string;
  component: any;
  meta: Meta;
  children?: RoutesMap[];
  redirect?: string;
};
const compModules = import.meta.glob("../views/**/index.vue");
const pageModules = import.meta.glob("../views/**/page.ts", {
  eager: true,
  import: "default"
}) as Record<string, Meta & { order: number }>;
const initRouter = (key: any, meta: Meta) => {
  const path = key.replace("../views", "").replace("/page.ts", "") || "/";
  const name = path.split("/").filter(Boolean).join("-") || "index";
  const compPath = key.replace("page.ts", "index.vue");
  const component = compModules[compPath];
  const route = {
    path,
    name,
    component,
    meta
  } as RoutesMap;
  if (meta.isChild) {
    route.children = [];
  }
  return route;
};

const sortRoutes = () => {
  const sortPages = new Map<string, Meta>();
  const sortKey = Object.keys(pageModules).sort(
    (a, b) => pageModules[a].order - pageModules[b].order
  );
  sortKey.forEach((key) => {
    sortPages.set(key, pageModules[key]);
  });
  return sortPages;
};

const genRoutes = (sortPages) => {
  const routes: any[] = [];
  for (const [path, meta] of sortPages.entries()) {
    if (!!meta.parentPath) {
      const finlRoutesHandle = (routes) => {
        const parentIndex = routes.findIndex(
          (item) => item.path == meta.parentPath
        );
        if (parentIndex !== -1) {
          routes[parentIndex].children?.push(initRouter(path, meta));
        }
      };
      finlRoutesHandle(routes);
      continue;
    }
    routes.push(initRouter(path, meta));
    // if (meta.index == 0) {
    //   routes.push(initRouter(path, meta));
    // }
    // if (meta.index == 1) {
    //   const parentIndex = routes.findIndex(
    //     (item) => item.path == meta.parentPath
    //   );
    //   if (parentIndex !== -1) {
    //     routes[parentIndex].children?.push(initRouter(path, meta));
    //   }
    // }
    // if (meta.index == 2) {
    //   const page = pageModules[`../views${meta.parentPath}/page.ts`] as any;

    //   const oneParentIndex = routes.findIndex(
    //     (item) => item.path == page.parentPath
    //   );
    //   const twoParentIndex = routes[oneParentIndex]?.children?.findIndex(
    //     (item: any) => item.path == meta.parentPath
    //   );
    //   if (twoParentIndex !== -1) {
    //     routes[oneParentIndex].children[twoParentIndex].children.push(
    //       initRouter(path, meta)
    //     );
    //   }
    // }
  }
  return routes;
};
const sortPages = sortRoutes();

export const allRoutes = genRoutes(sortPages);
console.log(";;;;", allRoutes);

export const routes = [
  {
    // 404页面
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/404.vue"),
    hidden: true
  }
];
