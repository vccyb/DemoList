<template>
  <div class="custom-counter">
    <button @click="decrement" class="counter-btn">-</button>
    <span class="counter-value">{{ count }}</span>
    <button @click="increment" class="counter-btn">+</button>
  </div>
</template>

<script setup>
// 使用 defineModel 宏定义自定义属性名的 v-model
const count = defineModel('count', { default: 0 })

// 增加计数
const increment = () => {
  count.value++
}

// 减少计数
const decrement = () => {
  count.value--
}
</script>

<style scoped>
.custom-counter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.counter-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter-btn:hover {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.counter-value {
  min-width: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}
</style>