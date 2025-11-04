<template>
  <div class="custom-form">
    <div class="form-row">
      <label>名字:</label>
      <input 
        :value="firstName" 
        @input="handleFirstNameChange" 
        placeholder="输入名字"
        class="form-input"
      />
    </div>
    
    <div class="form-row">
      <label>姓氏:</label>
      <input 
        :value="lastName" 
        @input="handleLastNameChange" 
        placeholder="输入姓氏"
        class="form-input"
      />
    </div>
    
    <div class="form-row">
      <label>年龄:</label>
      <input 
        :value="age" 
        @input="handleAgeChange" 
        type="number" 
        placeholder="输入年龄"
        class="form-input"
      />
    </div>
  </div>
</template>

<script setup>
// 使用 defineModel 宏定义多个 v-model
const firstName = defineModel('firstName', { default: '' })
const lastName = defineModel('lastName', { default: '' })
const age = defineModel('age', { default: 18 })

// 处理名字变化
const handleFirstNameChange = (event) => {
  firstName.value = event.target.value
}

// 处理姓氏变化
const handleLastNameChange = (event) => {
  lastName.value = event.target.value
}

// 处理年龄变化
const handleAgeChange = (event) => {
  age.value = parseInt(event.target.value) || 0
}
</script>

<style scoped>
.custom-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-row label {
  width: 60px;
  font-weight: 500;
}

.form-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #409eff;
}
</style>