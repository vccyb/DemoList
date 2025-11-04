import { createRouter, createWebHistory } from 'vue-router';
import { generateRoutes } from '../demo-config.js';

// 生成路由配置
const routes = generateRoutes();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;