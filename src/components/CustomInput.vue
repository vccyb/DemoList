<template>
  <div class="custom-input">
    <label v-if="label">{{ label }}</label>
    <input 
      :value="modelValue" 
      @input="handleInput" 
      :placeholder="placeholder"
      class="input-field"
    />
  </div>
</template>

<script setup>
// 使用 defineModel 宏定义 v-model
const modelValue = defineModel()

// 定义 props
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

// 处理输入事件
const handleInput = (event) => {
  // 更新 modelValue
  modelValue.value = event.target.value
}
</script>

<style scoped>
.custom-input {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
}

.input-field {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #409eff;
}
</style>