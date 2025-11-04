<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMenu, ElMenuItem, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';
import { getMenuItems } from './demo-config.js';

const route = useRoute();
const currentPath = ref(route.path);

// 监听路由变化
watch(() => route.path, (newPath) => {
  currentPath.value = newPath;
});

// 从配置中获取导航菜单项
const menuItems = getMenuItems();
</script>

<template>
  <div class="app-container">

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

.page-content {
  padding: 24px;
  min-height: calc(100vh - 120px);
}

.breadcrumb-container {
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}
</style>