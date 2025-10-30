<template>
  <div class="table-filter-container p-6">
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-2xl font-bold mb-6 text-primary">表格列筛选功能演示</h2>
      
      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" width="80" fixed />
        
        <!-- 名称列 - 输入框筛选 -->
        <el-table-column prop="name" label="名称" width="180">
          <template #header>
            <div class="column-header">
              <span>名称</span>
              <el-popover
                :visible="showNameFilter"
                placement="bottom"
                :width="200"
                trigger="click"
                @click-outside="showNameFilter = false"
              >
                <template #reference>
                  <el-icon 
                    class="filter-icon" 
                    :class="{ 'active': nameFilter }"
                    @click.stop="showNameFilter = !showNameFilter"
                  >
                    <ArrowDown />
                  </el-icon>
                </template>
                <div class="filter-popover">
                  <el-input
                    v-model="filterParams.name"
                    placeholder="请输入名称"
                    size="small"
                    clearable
                  />
                  <div class="filter-actions">
                    <el-button size="small" @click="showNameFilter = false">取消</el-button>
                    <el-button type="primary" size="small" @click="applyNameFilter">确定</el-button>
                  </div>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>

        <!-- 分类列 - 枚举值筛选 -->
        <el-table-column prop="category" label="分类" width="120">
          <template #header>
            <div class="column-header">
              <span>分类</span>
              <el-popover
                :visible="showCategoryFilter"
                placement="bottom"
                :width="200"
                trigger="click"
                @click-outside="showCategoryFilter = false"
              >
                <template #reference>
                  <el-icon
                    class="filter-icon"
                    :class="{ 'active': categoryFilter }"
                    @click.stop="showCategoryFilter = !showCategoryFilter"
                  >
                    <ArrowDown />
                  </el-icon>
                </template>
                <div class="filter-popover">
                  <el-select
                    v-model="filterParams.category"
                    placeholder="请选择分类"
                    size="small"
                    clearable
                    class="w-full"
                  >
                    <el-option
                      v-for="item in categoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <div class="filter-actions">
                    <el-button size="small" @click="showCategoryFilter = false">取消</el-button>
                    <el-button type="primary" size="small" @click="applyCategoryFilter">确定</el-button>
                  </div>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>

        <!-- 状态列 - 枚举值筛选 -->
        <el-table-column prop="status" label="状态" width="100">
          <template #header>
            <el-popover
              ref="statusPopoverRef"
              v-model:visible="showStatusFilter"
              placement="bottom"
              :width="200"
              trigger="click"
              :popper-options="{ modifiers: [{ name: 'eventListeners', options: { scroll: false } }] }"
            >
              <template #reference>
                <div class="filter-header">
                  <span>状态</span>
                  <el-icon class="filter-icon" :class="{ 'active': statusFilter }">
                    <ArrowDown />
                  </el-icon>
                </div>
              </template>
              <div class="filter-popover" @mousedown.stop @click.stop>
                <el-select
                  v-model="filterParams.status"
                  placeholder="请选择状态"
                  size="small"
                  clearable
                  class="w-full"
                  @mousedown.stop
                  @click.stop
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    @mousedown.stop
                    @click.stop
                  />
                </el-select>
                <div class="filter-actions">
                  <el-button size="small" @click="resetStatusFilter">重置</el-button>
                  <el-button type="primary" size="small" @click="applyStatusFilter">确定</el-button>
                </div>
              </div>
            </el-popover>
          </template>
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 创建时间列 - 时间范围筛选 -->
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template #header>
            <el-popover
              placement="bottom"
              :width="280"
              trigger="click"
              @show="showDateFilter = true"
              @hide="showDateFilter = false"
            >
              <template #reference>
                <div class="filter-header">
                  <span>创建时间</span>
                  <el-icon class="filter-icon" :class="{ 'active': dateFilter }">
                    <ArrowDown />
                  </el-icon>
                </div>
              </template>
              <div class="filter-popover">
                <el-date-picker
                  v-model="filterParams.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small"
                  style="width: 100%"
                />
                <div class="filter-actions">
                  <el-button size="small" @click="resetDateFilter">重置</el-button>
                  <el-button type="primary" size="small" @click="applyDateFilter">确定</el-button>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link type="success" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页区域 -->
      <div class="pagination-section mt-6 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 加载状态
const loading = ref(false)

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref([])

// popover引用
const categoryPopoverRef = ref()
const statusPopoverRef = ref()

// 筛选参数
const filterParams = reactive({
  name: '',
  category: '',
  status: '',
  dateRange: []
})

// 选项数据
const categoryOptions = ref([
  { label: '技术', value: '技术' },
  { label: '产品', value: '产品' },
  { label: '设计', value: '设计' },
  { label: '市场', value: '市场' },
  { label: '运营', value: '运营' }
])

const statusOptions = ref([
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '审核中', value: 'pending' }
])

// 筛选状态
const showNameFilter = ref(false)
const showCategoryFilter = ref(false)
const showStatusFilter = ref(false)
const showDateFilter = ref(false)

// 计算属性 - 判断是否有筛选条件
const nameFilter = computed(() => filterParams.name !== '')
const categoryFilter = computed(() => filterParams.category !== '')
const statusFilter = computed(() => filterParams.status !== '')
const dateFilter = computed(() => filterParams.dateRange && filterParams.dateRange.length > 0)

// 模拟数据
const generateMockData = (page = 1, pageSize = 10) => {
  const data = []
  const categories = ['技术', '产品', '设计', '市场', '运营']
  const statuses = ['active', 'inactive', 'pending']
  const startIndex = (page - 1) * pageSize + 1
  
  for (let i = startIndex; i <= startIndex + pageSize - 1; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    
    data.push({
      id: i,
      name: `测试项目${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      status: status,
      createTime: date.toLocaleDateString('zh-CN'),
      updateTime: new Date().toLocaleDateString('zh-CN'),
      description: `这是项目${i}的详细描述信息，包含了项目的基本情况和特点。`
    })
  }
  
  return data
}

// 获取状态对应的标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning'
  }
  return statusMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    active: '启用',
    inactive: '禁用',
    pending: '审核中'
  }
  return statusMap[status] || status
}

// 加载表格数据
const loadTableData = () => {
  loading.value = true
  
  // 模拟API请求延迟
  setTimeout(() => {
    tableData.value = generateMockData(pagination.currentPage, pagination.pageSize)
    // 模拟总条数
    pagination.total = 100
    loading.value = false
  }, 500)
}

// 后端筛选方法
const fetchDataFromBackend = async () => {
  loading.value = true
  try {
    // 模拟后端API调用
    // 实际项目中这里应该是真实的API调用，如：
    // const response = await api.get('/table-data', {
    //   params: {
    //     page: pagination.currentPage,
    //     pageSize: pagination.pageSize,
    //     name: filterParams.name,
    //     category: filterParams.category,
    //     status: filterParams.status,
    //     startDate: filterParams.dateRange?.[0],
    //     endDate: filterParams.dateRange?.[1]
    //   }
    // })

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟后端筛选逻辑
    let filteredData = generateMockData()

    // 根据筛选条件过滤数据
    if (filterParams.name) {
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(filterParams.name.toLowerCase())
      )
    }

    if (filterParams.category) {
      filteredData = filteredData.filter(item => item.category === filterParams.category)
    }

    if (filterParams.status) {
      filteredData = filteredData.filter(item => item.status === filterParams.status)
    }

    if (filterParams.dateRange && filterParams.dateRange.length === 2) {
      const startDate = new Date(filterParams.dateRange[0])
      const endDate = new Date(filterParams.dateRange[1])
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.createTime)
        return itemDate >= startDate && itemDate <= endDate
      })
    }

    tableData.value = filteredData
    pagination.total = filteredData.length
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 名称筛选
const applyNameFilter = () => {
  showNameFilter.value = false
  fetchDataFromBackend()
}

const resetNameFilter = () => {
  filterParams.name = ''
  showNameFilter.value = false
  fetchDataFromBackend()
}

// 分类筛选
const applyCategoryFilter = () => {
  showCategoryFilter.value = false
  fetchDataFromBackend()
}

const resetCategoryFilter = () => {
  filterParams.category = ''
  showCategoryFilter.value = false
  fetchDataFromBackend()
}

// 状态筛选
const applyStatusFilter = () => {
  showStatusFilter.value = false
  fetchDataFromBackend()
}

const resetStatusFilter = () => {
  filterParams.status = ''
  showStatusFilter.value = false
  fetchDataFromBackend()
}

// 时间筛选
const applyDateFilter = () => {
  showDateFilter.value = false
  fetchDataFromBackend()
}

const resetDateFilter = () => {
  filterParams.dateRange = []
  showDateFilter.value = false
  fetchDataFromBackend()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  loadTableData()
}

// 当前页码改变
const handleCurrentChange = (current) => {
  pagination.currentPage = current
  loadTableData()
}

// 初始化
onMounted(() => {
  fetchDataFromBackend()
})
</script>

<style scoped>
.table-filter-container {
  min-height: calc(100vh - 120px);
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
}

.filter-header:hover {
  color: #409eff;
}

.filter-icon {
  font-size: 12px;
  transition: transform 0.3s;
}

.filter-icon.active {
  transform: rotate(180deg);
  color: #409eff;
}

.filter-popover {
  padding: 12px;
}

.filter-popover .el-input,
.filter-popover .el-select,
.filter-popover .el-date-picker {
  margin-bottom: 12px;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.pagination-section {
  margin-top: 20px;
}
</style>