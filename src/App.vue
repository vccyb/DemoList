<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMenu, ElMenuItem, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';

const route = useRoute();
const currentPath = ref(route.path);

// 监听路由变化
watch(() => route.path, (newPath) => {
  currentPath.value = newPath;
});

// 导航菜单项
const menuItems = [
  {
    name: '首页',
    path: '/'
  },
  {
    name: '表格导出PDF',
    path: '/table-export-pdf'
  },
  {
    name: '表格筛选',
    path: '/table-filter'
  }
];
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->

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

.top-nav {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
}

.breadcrumb-container {
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.page-content {
  padding: 24px;
  min-height: calc(100vh - 120px);
}
</style>