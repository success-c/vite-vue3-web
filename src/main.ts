import { createApp } from "vue";
import "./style.scss";
import App from "./App.vue";
import { createPinia } from "pinia";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";

import router from "@/router";
import { registerStore } from "./store";
const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
registerStore();
app.use(ArcoVue);
app.use(ArcoVueIcon);

app.use(router);
app.mount("#app");
