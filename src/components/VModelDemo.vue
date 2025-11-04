<template>
  <div class="v-model-demo-container">
    <h2 class="title">defineModel 宏演示</h2>
    
    <div class="demo-section">
      <h3>基础用法</h3>
      <div class="demo-content">
        <el-input v-model="inputValue" placeholder="输入一些文本" />
        <p class="value-display">父组件中的值: {{ inputValue }}</p>
        
        <!-- 使用自定义组件 -->
        <CustomInput v-model="inputValue" />
      </div>
    </div>
    
    <div class="demo-section">
      <h3>带修饰符的用法</h3>
      <div class="demo-content">
        <el-input v-model.trim="trimmedValue" placeholder="输入文本（自动去除首尾空格）" />
        <p class="value-display">去除空格后的值: "{{ trimmedValue }}"</p>
        
        <!-- 使用自定义组件带修饰符 -->
        <CustomInput v-model.trim="trimmedValue" />
      </div>
    </div>
    
    <div class="demo-section">
      <h3>自定义属性名</h3>
      <div class="demo-content">
        <CustomCounter v-model:count="counterValue" />
        <p class="value-display">计数器值: {{ counterValue }}</p>
      </div>
    </div>
    
    <div class="demo-section">
      <h3>多个v-model</h3>
      <div class="demo-content">
        <CustomForm 
          v-model:first-name="firstName" 
          v-model:last-name="lastName" 
          v-model:age="age" 
        />
        <div class="form-values">
          <p>名字: {{ firstName }}</p>
          <p>姓氏: {{ lastName }}</p>
          <p>年龄: {{ age }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CustomInput from '../components/CustomInput.vue'
import CustomCounter from '../components/CustomCounter.vue'
import CustomForm from '../components/CustomForm.vue'

// 基础用法
const inputValue = ref('')

// 带修饰符的用法
const trimmedValue = ref('')

// 自定义属性名
const counterValue = ref(0)

// 多个v-model
const firstName = ref('')
const lastName = ref('')
const age = ref(18)
</script>

<style scoped>
.v-model-demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fafafa;
}

.demo-section h3 {
  margin-top: 0;
  color: #409eff;
}

.demo-content {
  margin-top: 15px;
}

.value-display {
  margin: 15px 0;
  padding: 10px;
  background-color: #ecf5ff;
  border-radius: 4px;
  color: #409eff;
}

.form-values {
  margin-top: 15px;
  padding: 15px;
  background-color: #f0f9eb;
  border-radius: 4px;
}

.form-values p {
  margin: 5px 0;
  color: #67c23a;
}
</style>