<template>
  <div class="full-screen-container">
    <h1 class="title">演示列表</h1>
    <div class="content-center">
      <div class="demo-item" v-for="(item, index) in demoItems" :key="index">
        <span class="demo-number">{{ index + 1 }}.</span>
        <el-text type="primary">
          <router-link :to="item.route" class="demo-link">{{ item.name }}</router-link>
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElText } from 'element-plus';

// 使用对象数组存储演示项信息，确保与路由配置一致
const demoItems = [
  {
    name: '表格导出PDF功能',
    route: '/table-export-pdf'
  },
  {
    name: '表格筛选功能',
    route: '/table-filter'
  }
];
</script>

<style scoped>
.full-screen-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 40px;
}

.content-center {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.demo-number {
  font-size: 18px;
  font-weight: 600;
  color: #6b7280;
  width: 24px;
}

.demo-link {
  font-size: 18px;
  color: #4096ff;
  text-decoration: none;
  transition: color 0.2s;
}

.demo-link:hover {
  color: #69b1ff;
}
</style>