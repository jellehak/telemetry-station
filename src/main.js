import { createApp } from "vue";
import App from "./App.vue";
import components from "./components/vite.register.js";

export const app = createApp(App)
app.use(components)
app.mount("#app");

export default {app}
