<template>
  <div class="full-screen-container">
    <h1 class="title">演示列表</h1>
    <div class="category-container">
      <!-- 遍历所有分类 -->
      <div 
        class="category-section" 
        v-for="category in Object.values(categorizedItems)" 
        :key="category.id"
        v-show="category.items.length > 0"
      >
        <h2 class="category-title">{{ category.name }}</h2>
        <div class="content-center">
          <div class="demo-item" v-for="(item, index) in category.items" :key="item.id">
            <span class="demo-number">{{ index + 1 }}.</span>
            <el-text type="primary">
              <router-link :to="item.path" class="demo-link">{{ item.name }}</router-link>
            </el-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElText } from 'element-plus';
import { getDemoItemsByCategory } from '../demo-config.js';

// 从配置中获取按分类组织的演示项目
const categorizedItems = getDemoItemsByCategory();
</script>

<style scoped>
.full-screen-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 20px 0 30px 0;
}

.category-container {
  text-align: center;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  gap: 40px;
}

.category-section {
  width: 100%;
}

.category-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e5e7eb;
}

.content-center {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.demo-item:hover {
  background-color: #f3f4f6;
}

.demo-number {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  width: 24px;
}

.demo-link {
  font-size: 16px;
  color: #4096ff;
  text-decoration: none;
  transition: color 0.2s;
}

.demo-link:hover {
  color: #69b1ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .full-screen-container {
    padding: 10px;
  }
  
  .title {
    font-size: 20px;
    margin: 15px 0 20px 0;
  }
  
  .category-title {
    font-size: 18px;
  }
  
  .demo-link {
    font-size: 14px;
  }
  
  .category-container {
    flex-direction: column;
    gap: 20px;
  }
}
</style>