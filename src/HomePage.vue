<template>
  <div class="main-container">
    <div class="content-center">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <el-text type="primary" class="text-2xl font-bold">演示列表</el-text>
      </div>
      
      <!-- 功能列表 -->
      <div class="space-y-4">
        <!-- 表格导出PDF功能 -->
        <div class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-md transition-colors">
          <el-text type="info" class="font-medium w-8 text-center">1</el-text>
          <div class="flex-1">
            <el-text class="text-base cursor-pointer hover:text-primary">表格导出PDF功能</el-text>
          </div>
        </div>
        
        <!-- 表格筛选功能 -->
        <div class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-md transition-colors">
          <el-text type="info" class="font-medium w-8 text-center">2</el-text>
          <div class="flex-1">
            <el-text class="text-base cursor-pointer hover:text-primary">表格筛选功能</el-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElText } from 'element-plus'
</script>

<style scoped>
.main-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-center {
  max-width: 300px;
  width: 100%;
}
</style>