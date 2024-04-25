import { userStore } from "@/store/userStore";

export interface IAppStore {
  userStore: ReturnType<typeof userStore>;
}

const appStore: IAppStore = {} as IAppStore;

// 注册store
export const registerStore = () => {
  appStore.userStore = userStore();
};

export default appStore;
