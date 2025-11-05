<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMenu, ElMenuItem, ElBreadcrumb, ElBreadcrumbItem, ElSwitch } from 'element-plus';
import { getMenuItems } from './demo-config.js';

const route = useRoute();
const currentPath = ref(route.path);
const isDarkMode = ref(false);

// 监听路由变化
watch(() => route.path, (newPath) => {
  currentPath.value = newPath;
});

// 切换暗黑模式
const toggleDarkMode = (value) => {
  isDarkMode.value = value;
  if (value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  // 保存用户偏好到 localStorage
  localStorage.setItem('darkMode', value);
};

// 页面加载时检查用户偏好设置
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    isDarkMode.value = JSON.parse(savedDarkMode);
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
    }
  }
});

// 从配置中获取导航菜单项
const menuItems = getMenuItems();
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <div class="navbar bg-base-100 shadow-md">
      <div class="flex-1">
        <a class="btn btn-ghost font-bold text-2xl" style="font-size: 1.5rem;">Demo List</a>
      </div>
      <div class="flex-none gap-2">
        <div class="tooltip tooltip-bottom" data-tip="切换主题">
          <button class="btn btn-circle btn-ghost" @click="toggleDarkMode(!isDarkMode)">
            <span class="text-2xl" style="font-size: 1.5rem">{{ isDarkMode ? '☀️' : '🌙' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 面包屑导航 -->
    <div class="breadcrumb-container" v-if="currentPath !== '/'">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ menuItems.find(item => item.path === currentPath)?.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 页面内容 -->
    <div class="page-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

.navbar {
  padding: 10px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: var(--el-bg-color-page);
  border-bottom: 1px solid var(--el-border-color-light);
}

.page-content {
  padding: 24px;
  min-height: calc(100vh - 120px);
}

.breadcrumb-container {
  padding: 16px 24px;
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-light);
}
</style>