<template>
  <div class="async-api-demo p-6 max-w-6xl mx-auto flex flex-col gap-6">
    <el-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><Collection /></el-icon>
          <span class="text-xl font-bold">异步API与路由管理最佳实践</span>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="mb-4">本示例演示了以下常见场景的最佳实践：</p>
          <ol class="list-decimal pl-5 space-y-2">
            <li>调用接口1进行（异步）获取数据</li>
            <li>获取数据后将参数放到路由的query上</li>
            <li>修改切换相关的数据，会影响路由</li>
            <li>监听路由变化后异步调用接口2</li>
          </ol>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="font-bold text-blue-800 mb-2">最佳实践要点</h3>
          <ul class="space-y-1 text-sm">
            <li>• 使用 watch 监听路由变化</li>
            <li>• 合理分离 API 调用</li>
            <li>• 正确处理异步操作</li>
            <li>• 路由参数同步</li>
            <li>• 加载状态管理</li>
          </ul>
        </div>
      </div>
    </el-card>

    <el-row :gutter="24" class="mb-6">
      <!-- 左侧：控制面板 -->
      <el-col :span="12">
        <el-card class="h-full">
          <template #header>
            <div class="flex items-center">
              <el-icon class="mr-2"><Setting /></el-icon>
              <span class="font-bold">控制面板</span>
            </div>
          </template>

          <div class="space-y-5">
            <el-form label-width="80px">
              <el-form-item label="选择用户">
                <el-select
                  v-model="selectedUserId"
                  @change="handleUserChange"
                  placeholder="请选择用户"
                  class="w-full"
                >
                  <el-option
                    v-for="user in users"
                    :key="user.id"
                    :label="`${user.name} (ID: ${user.id})`"
                    :value="user.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="选择类别">
                <el-select
                  v-model="selectedCategory"
                  @change="handleCategoryChange"
                  placeholder="请选择类别"
                  class="w-full"
                >
                  <el-option label="全部类别" value="" />
                  <el-option
                    v-for="category in categories"
                    :key="category"
                    :label="category"
                    :value="category"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="搜索">
                <el-input
                  v-model="searchKeyword"
                  @input="handleSearchChange"
                  placeholder="输入关键词搜索..."
                  clearable
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>

            <div class="flex justify-end space-x-3">
              <el-button @click="resetFilters">
                <el-icon><Refresh /></el-icon>
                重置筛选
              </el-button>
              <el-button type="primary" @click="refreshData">
                <el-icon><RefreshRight /></el-icon>
                刷新数据
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：当前路由信息 -->
      <el-col :span="12">
        <el-card class="h-full">
          <template #header>
            <div class="flex items-center">
              <el-icon class="mr-2"><Link /></el-icon>
              <span class="font-bold">当前路由信息</span>
            </div>
          </template>

          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="完整路径">
              <el-text class="text-xs">{{ $route.fullPath }}</el-text>
            </el-descriptions-item>

            <el-descriptions-item label="查询参数">
              <pre
                class="text-xs bg-gray-50 p-2 rounded max-h-32 overflow-auto"
                >{{ JSON.stringify(routeQuery, null, 2) }}</pre
              >
            </el-descriptions-item>

            <el-descriptions-item label="路由名称">
              <el-tag>{{ $route.name }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据展示区域 -->
    <el-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <el-icon class="mr-2"><User /></el-icon>
            <span class="font-bold">用户详情</span>
          </div>
          <el-skeleton
            v-if="loading.user"
            :rows="3"
            animated
            style="width: 200px"
          />
        </div>
      </template>

      <div v-if="!loading.user && userDetail" class="flex flex-col">
        <div class="flex items-center mb-6">
          <el-avatar :size="64" icon="UserFilled" class="mr-4" />
          <div>
            <h3 class="text-lg font-medium">{{ userDetail.name }}</h3>
            <p class="text-gray-500">ID: {{ userDetail.id }}</p>
          </div>
        </div>

        <el-descriptions :column="2" size="small" border>
          <el-descriptions-item label="邮箱">
            <el-icon class="mr-1"><Message /></el-icon>
            {{ userDetail.email }}
          </el-descriptions-item>
          <el-descriptions-item label="电话">
            <el-icon class="mr-1"><Phone /></el-icon>
            {{ userDetail.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="城市">
            <el-icon class="mr-1"><Location /></el-icon>
            {{ userDetail.city }}
          </el-descriptions-item>
          <el-descriptions-item label="注册日期">
            <el-icon class="mr-1"><Calendar /></el-icon>
            {{ userDetail.registerDate }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div v-else-if="!loading.user" class="text-center py-10 text-gray-500">
        <el-empty description="请选择一个用户查看详情" :image-size="80" />
      </div>
    </el-card>

    <!-- 用户订单列表 -->
    <el-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <el-icon class="mr-2"><Document /></el-icon>
            <span class="font-bold">用户订单</span>
          </div>
          <div class="text-sm text-gray-500">共 {{ orders.length }} 条记录</div>
        </div>
      </template>

      <div v-if="loading.orders" class="py-10">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="orders.length > 0">
        <el-table :data="orders" stripe style="width: 100%" border>
          <el-table-column prop="id" label="订单号" width="120" />
          <el-table-column prop="product" label="商品" />
          <el-table-column prop="amount" label="金额" width="120">
            <template #default="scope">
              ¥{{ scope.row.amount.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getOrderStatusType(scope.row.status)">
                {{ getOrderStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="下单时间" width="120" />
        </el-table>
      </div>

      <div v-else>
        <el-empty description="暂无订单数据" :image-size="80" />
      </div>
    </el-card>

    <!-- 数据变化流说明 -->
    <el-card class="mt-6 border border-primary/20 shadow-lg">
      <template #header>
        <div class="flex items-center">
          <div class="bg-primary/10 p-2 rounded-lg mr-3">
            <el-icon class="text-primary text-xl"><DataLine /></el-icon>
          </div>
          <span class="text-xl font-bold text-gray-800">数据变化流说明</span>
        </div>
      </template>

      <div class="space-y-8">
        <!-- 场景一：路由参数变化 -->
        <div
          class="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200"
        >
          <div class="flex items-center mb-4">
            <div class="bg-blue-100 p-2 rounded-lg mr-3">
              <el-icon class="text-blue-600 text-lg"><Position /></el-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">
              场景一：路由参数变化
            </h3>
          </div>

          <div class="mb-5">
            <el-steps :active="5" finish-status="success" align-center>
              <el-step
                title="URL变化"
                description="用户直接修改地址栏或点击带参链接"
              />
              <el-step
                title="路由监听触发"
                description="watch监听到route.query变化"
              />
              <el-step
                title="同步组件状态"
                description="将路由参数同步到组件的响应式数据"
              />
              <el-step
                title="条件判断"
                description="判断是否需要重新加载用户详情"
              />
              <el-step
                title="数据加载"
                description="根据条件加载用户详情和订单数据"
              />
            </el-steps>
          </div>

          <div class="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 class="font-medium text-blue-800 mb-2 flex items-center">
              <el-icon class="mr-2"><Document /></el-icon>
              示例场景
            </h4>
            <div class="space-y-2">
              <p class="flex items-start">
                <span class="badge badge-primary badge-sm mr-2 mt-1">1</span>
                <span
                  >用户访问
                  <code class="bg-gray-200 px-2 py-1 rounded text-sm"
                    >/async-api-demo?userId=2&category=电子产品</code
                  ></span
                >
              </p>
              <p class="flex items-start">
                <span class="badge badge-primary badge-sm mr-2 mt-1">2</span>
                <span>系统自动加载ID为2的用户详情和该用户的电子产品订单</span>
              </p>
            </div>
          </div>

          <div class="bg-warning/10 rounded-lg p-4 border border-warning/20">
            <h4 class="font-medium text-warning-content mb-2 flex items-center">
              <el-icon class="mr-2"><Warning /></el-icon>
              为什么不会循环触发？
            </h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start">
                <el-icon class="text-warning mr-2 mt-0.5 flex-shrink-0"
                  ><Check
                /></el-icon>
                <span
                  >路由监听仅响应外部变化（用户手动修改URL、浏览器前进后退）</span
                >
              </li>
              <li class="flex items-start">
                <el-icon class="text-warning mr-2 mt-0.5 flex-shrink-0"
                  ><Check
                /></el-icon>
                <span
                  >组件内部更新路由使用<code class="bg-gray-200 px-1 rounded"
                    >router.replace</code
                  >而非<code class="bg-gray-200 px-1 rounded">router.push</code
                  >，避免添加历史记录</span
                >
              </li>
              <li class="flex items-start">
                <el-icon class="text-warning mr-2 mt-0.5 flex-shrink-0"
                  ><Check
                /></el-icon>
                <span>数据加载不会主动修改URL，保持单向数据流</span>
              </li>
              <li class="flex items-start">
                <el-icon class="text-warning mr-2 mt-0.5 flex-shrink-0"
                  ><Check
                /></el-icon>
                <span>通过条件判断避免不必要的重复加载</span>
              </li>
            </ul>
          </div>

          <div
            class="mt-4 collapse collapse-arrow bg-base-200 border border-base-300 rounded-lg"
          >
            <input type="checkbox" />
            <div class="collapse-title font-medium text-sm">
              <el-icon class="mr-2"><Document /></el-icon>
              查看代码示例说明
            </div>
            <div class="collapse-content">
              <pre
                class="bg-gray-800 text-gray-100 p-4 rounded text-xs overflow-auto"
              >
// 1. 路由监听器 - 只响应外部路由变化
watch(
  () => route.query,
  (newQuery) => {
    // 同步路由参数到组件状态，但不触发路由更新
    selectedUserId.value = newQuery.userId || ''
    selectedCategory.value = newQuery.category || ''
    searchKeyword.value = newQuery.keyword || ''
    
    // 条件加载数据，不修改路由
    if (selectedUserId.value) {
      loadUserDetail(selectedUserId.value)
      loadOrders(selectedUserId.value, selectedCategory.value, searchKeyword.value)
    }
  },
  { immediate: true }
)

// 2. 用户操作处理 - 主动更新路由
const handleUserChange = () => {
  // 更新路由参数（这是唯一主动修改路由的地方）
  updateRouteQuery({ 
    userId: selectedUserId.value,
    category: selectedCategory.value,
    keyword: searchKeyword.value
  })
  
  // 加载数据，但不修改路由
  loadUserDetail(selectedUserId.value)
  loadOrders(selectedUserId.value, selectedCategory.value, searchKeyword.value)
}

// 3. 路由更新函数 - 使用replace避免历史记录
const updateRouteQuery = (newQuery) => {
  const query = { ...route.query, ...newQuery }
  // 清理空值参数
  Object.keys(query).forEach(key => {
    if (query[key] === '' || query[key] === null || query[key] === undefined) {
      delete query[key]
    }
  })
  // 使用replace而不是push，避免添加历史记录
  router.replace({ query })
}
              </pre>
            </div>
          </div>
        </div>

        <el-divider class="my-2" />

        <!-- 场景二：查询条件变化 -->
        <div
          class="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200"
        >
          <div class="flex items-center mb-4">
            <div class="bg-green-100 p-2 rounded-lg mr-3">
              <el-icon class="text-green-600 text-lg"><Edit /></el-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">
              场景二：查询条件变化
            </h3>
          </div>

          <el-timeline class="mb-5">
            <el-timeline-item>
              <div class="flex items-center mb-1">
                <div class="bg-info/10 p-1 rounded mr-2">
                  <el-icon class="text-info"><User /></el-icon>
                </div>
                <p class="font-medium">用户操作</p>
              </div>
              <p class="text-gray-600 text-sm ml-7">
                在控制面板中更改用户、类别或搜索关键词
              </p>
            </el-timeline-item>
            <el-timeline-item>
              <div class="flex items-center mb-1">
                <div class="bg-info/10 p-1 rounded mr-2">
                  <el-icon class="text-info"><Link /></el-icon>
                </div>
                <p class="font-medium">更新路由</p>
              </div>
              <p class="text-gray-600 text-sm ml-7">
                调用updateRouteQuery更新URL参数
              </p>
            </el-timeline-item>
            <el-timeline-item>
              <div class="flex items-center mb-1">
                <div class="bg-info/10 p-1 rounded mr-2">
                  <el-icon class="text-info"><DataAnalysis /></el-icon>
                </div>
                <p class="font-medium">条件加载</p>
              </div>
              <p class="text-gray-600 text-sm ml-7">
                根据变更类型决定加载策略：<br />
                - 更改用户：重新加载用户详情和订单<br />
                - 更改类别/搜索：仅重新加载订单
              </p>
            </el-timeline-item>
            <el-timeline-item>
              <div class="flex items-center mb-1">
                <div class="bg-info/10 p-1 rounded mr-2">
                  <el-icon class="text-info"><Refresh /></el-icon>
                </div>
                <p class="font-medium">界面更新</p>
              </div>
              <p class="text-gray-600 text-sm ml-7">
                对应区域显示加载状态并更新数据
              </p>
            </el-timeline-item>
          </el-timeline>

          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-medium text-green-800 mb-2 flex items-center">
              <el-icon class="mr-2"><Document /></el-icon>
              示例场景
            </h4>
            <div class="space-y-2">
              <p class="flex items-start">
                <span class="badge badge-success badge-sm mr-2 mt-1">1</span>
                <span>用户选择"李四"(ID:2)，系统加载用户详情和订单</span>
              </p>
              <p class="flex items-start">
                <span class="badge badge-success badge-sm mr-2 mt-1">2</span>
                <span
                  >用户选择类别"电子产品"，系统仅重新加载该用户的电子产品订单</span
                >
              </p>
              <p class="flex items-start">
                <span class="badge badge-success badge-sm mr-2 mt-1">3</span>
                <span>用户输入搜索词"Iphone"，系统仅重新加载匹配的订单</span>
              </p>
            </div>
          </div>
        </div>

        <el-divider class="my-2" />

        <!-- 最佳实践总结 -->
        <div
          class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10"
        >
          <div class="flex items-center mb-4">
            <div class="bg-purple-100 p-2 rounded-lg mr-3">
              <el-icon class="text-purple-600 text-lg"><Guide /></el-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">最佳实践总结</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-warning/5 rounded-lg p-4 border border-warning/10">
              <h4 class="font-medium text-warning mb-3 flex items-center">
                <el-icon class="mr-2"><DataAnalysis /></el-icon>
                数据加载策略
              </h4>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <el-icon class="text-warning mr-2 mt-0.5"><Check /></el-icon>
                  <span>用户ID变更：重新加载用户详情+订单</span>
                </li>
                <li class="flex items-start">
                  <el-icon class="text-warning mr-2 mt-0.5"><Check /></el-icon>
                  <span>查询条件变更：仅重新加载订单</span>
                </li>
                <li class="flex items-start">
                  <el-icon class="text-warning mr-2 mt-0.5"><Check /></el-icon>
                  <span>路由参数同步：保持URL与状态一致</span>
                </li>
              </ul>
            </div>

            <div class="bg-info/5 rounded-lg p-4 border border-info/10">
              <h4 class="font-medium text-info mb-3 flex items-center">
                <el-icon class="mr-2"><MagicStick /></el-icon>
                性能优化
              </h4>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <el-icon class="text-info mr-2 mt-0.5"><Check /></el-icon>
                  <span>防抖处理：搜索输入延迟响应</span>
                </li>
                <li class="flex items-start">
                  <el-icon class="text-info mr-2 mt-0.5"><Check /></el-icon>
                  <span>独立加载：不同数据独立loading状态</span>
                </li>
                <li class="flex items-start">
                  <el-icon class="text-info mr-2 mt-0.5"><Check /></el-icon>
                  <span>条件渲染：无数据时显示空状态</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Collection,
  Setting,
  Link,
  User,
  Message,
  Phone,
  Location,
  Calendar,
  Document,
  Search,
  Refresh,
  RefreshRight,
  UserFilled,
  DataLine,
  Position,
  Edit,
  Guide,
  Warning,
  Check,
  DataAnalysis,
  MagicStick,
} from "@element-plus/icons-vue";

// Vue Router 实例
const route = useRoute();
const router = useRouter();

// 响应式数据
const users = ref([]);
const categories = ref(["电子产品", "服装", "家居", "图书", "运动"]);
const orders = ref([]);
const userDetail = ref(null);

// 筛选条件
const selectedUserId = ref("");
const selectedCategory = ref("");
const searchKeyword = ref("");

// 加载状态
const loading = reactive({
  users: false,
  user: false,
  orders: false,
});

// 计算属性：当前路由查询参数
const routeQuery = computed(() => route.query);

// 模拟API调用函数
const mockApi = {
  // 获取用户列表
  getUsers: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "1", name: "张三" },
          { id: "2", name: "李四" },
          { id: "3", name: "王五" },
          { id: "4", name: "赵六" },
          { id: "5", name: "钱七" },
        ]);
      }, 500);
    });
  },

  // 获取用户详情
  getUserDetail: (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userId) {
          resolve({
            id: userId,
            name:
              ["张三", "李四", "王五", "赵六", "钱七"][parseInt(userId) - 1] ||
              "未知用户",
            email: `user${userId}@example.com`,
            phone: `138${Math.floor(10000000 + Math.random() * 90000000)}`,
            city:
              ["北京", "上海", "广州", "深圳", "杭州"][parseInt(userId) - 1] ||
              "未知城市",
            registerDate: "2023-01-15",
          });
        } else {
          reject(new Error("用户ID不能为空"));
        }
      }, 800);
    });
  },

  // 获取用户订单
  getUserOrders: (userId, category = "", keyword = "") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟根据条件筛选订单
        const allOrders = [
          {
            id: "ORD001",
            product: "iPhone 15",
            amount: 6999,
            status: "completed",
            date: "2023-10-15",
          },
          {
            id: "ORD002",
            product: "MacBook Pro",
            amount: 12999,
            status: "shipping",
            date: "2023-10-20",
          },
          {
            id: "ORD003",
            product: "AirPods Pro",
            amount: 1999,
            status: "completed",
            date: "2023-10-25",
          },
          {
            id: "ORD004",
            product: "iPad Air",
            amount: 4599,
            status: "pending",
            date: "2023-11-01",
          },
          {
            id: "ORD005",
            product: "Apple Watch",
            amount: 2999,
            status: "completed",
            date: "2023-11-05",
          },
        ];

        let filteredOrders = allOrders;

        // 根据类别筛选
        if (category) {
          filteredOrders = filteredOrders.filter((order) =>
            order.product.includes(category)
          );
        }

        // 根据关键词筛选
        if (keyword) {
          filteredOrders = filteredOrders.filter(
            (order) =>
              order.id.includes(keyword) || order.product.includes(keyword)
          );
        }

        resolve(filteredOrders);
      }, 600);
    });
  },
};

// 获取订单状态样式类型
const getOrderStatusType = (status) => {
  const statusTypes = {
    completed: "success",
    shipping: "primary",
    pending: "warning",
  };
  return statusTypes[status] || "info";
};

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const statusTexts = {
    completed: "已完成",
    shipping: "配送中",
    pending: "待处理",
  };
  return statusTexts[status] || status;
};

// 更新路由查询参数
const updateRouteQuery = (newQuery) => {
  const query = { ...route.query, ...newQuery };

  // 清理空值参数
  Object.keys(query).forEach((key) => {
    if (query[key] === "" || query[key] === null || query[key] === undefined) {
      delete query[key];
    }
  });

  router.replace({ query });
};

// 加载用户列表
const loadUsers = async () => {
  loading.users = true;
  try {
    users.value = await mockApi.getUsers();
  } catch (error) {
    console.error("加载用户列表失败:", error);
  } finally {
    loading.users = false;
  }
};

// 加载用户详情
const loadUserDetail = async (userId) => {
  if (!userId) {
    userDetail.value = null;
    return;
  }

  loading.user = true;
  try {
    userDetail.value = await mockApi.getUserDetail(userId);
  } catch (error) {
    console.error("加载用户详情失败:", error);
    userDetail.value = null;
  } finally {
    loading.user = false;
  }
};

// 加载订单数据
const loadOrders = async (userId, category, keyword) => {
  if (!userId) {
    orders.value = [];
    return;
  }

  loading.orders = true;
  try {
    orders.value = await mockApi.getUserOrders(userId, category, keyword);
  } catch (error) {
    console.error("加载订单数据失败:", error);
    orders.value = [];
  } finally {
    loading.orders = false;
  }
};

// 处理用户变更
const handleUserChange = () => {
  // 更新路由参数
  updateRouteQuery({
    userId: selectedUserId.value,
    category: selectedCategory.value,
    keyword: searchKeyword.value,
  });

  // 加载相关数据
  loadUserDetail(selectedUserId.value);
  loadOrders(selectedUserId.value, selectedCategory.value, searchKeyword.value);
};

// 处理类别变更
const handleCategoryChange = () => {
  // 更新路由参数
  updateRouteQuery({
    userId: selectedUserId.value,
    category: selectedCategory.value,
    keyword: searchKeyword.value,
  });

  // 仅重新加载订单数据，不重新加载用户信息
  loadOrders(selectedUserId.value, selectedCategory.value, searchKeyword.value);
};

// 处理搜索变更（防抖处理）
let searchTimer = null;
const handleSearchChange = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    // 更新路由参数
    updateRouteQuery({
      userId: selectedUserId.value,
      category: selectedCategory.value,
      keyword: searchKeyword.value,
    });

    // 仅重新加载订单数据，不重新加载用户信息
    loadOrders(
      selectedUserId.value,
      selectedCategory.value,
      searchKeyword.value
    );
  }, 300);
};

// 重置筛选条件
const resetFilters = () => {
  selectedUserId.value = "";
  selectedCategory.value = "";
  searchKeyword.value = "";

  // 更新路由参数
  updateRouteQuery({});

  // 清空数据
  userDetail.value = null;
  orders.value = [];
};

// 刷新数据
const refreshData = () => {
  if (selectedUserId.value) {
    loadUserDetail(selectedUserId.value);
    loadOrders(
      selectedUserId.value,
      selectedCategory.value,
      searchKeyword.value
    );
  }
};

// 监听路由变化
watch(
  () => route.query,
  (newQuery) => {
    // 同步筛选条件到组件状态
    const oldUserId = selectedUserId.value;
    selectedUserId.value = newQuery.userId || "";
    selectedCategory.value = newQuery.category || "";
    searchKeyword.value = newQuery.keyword || "";

    // 只有当用户ID发生变化时才重新加载用户详情
    if (selectedUserId.value && selectedUserId.value !== oldUserId) {
      loadUserDetail(selectedUserId.value);
    }

    // 根据路由参数加载订单数据（即使用户ID未变化）
    if (selectedUserId.value) {
      loadOrders(
        selectedUserId.value,
        selectedCategory.value,
        searchKeyword.value
      );
    } else {
      orders.value = [];
    }
  },
  { immediate: true }
);

// 组件挂载时加载初始数据
onMounted(async () => {
  await loadUsers();

  // 如果路由中有用户ID，则设置为默认选中
  if (route.query.userId) {
    selectedUserId.value = route.query.userId;
  }
});
</script>

<style scoped>
.async-api-demo {
  min-height: calc(100vh - 120px);
}

:deep(.el-card) {
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-card__header) {
  background-color: #f8fafc;
  font-weight: bold;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 12px 12px 0 0 !important;
}

:deep(.el-descriptions__label) {
  width: 120px !important;
}

:deep(.el-step__title) {
  font-size: 14px !important;
}

:deep(.el-step__description) {
  font-size: 12px !important;
}

:deep(.el-timeline-item__node--normal) {
  left: -1px !important;
}

:deep(.el-divider--horizontal) {
  margin: 1rem 0 !important;
}

/* Daisy UI 样式增强 */
.collapse-arrow .collapse-title {
  padding: 0.75rem 1rem;
}

.collapse-arrow .collapse-content {
  padding: 0.5rem 1rem 1rem 1rem;
}

.badge {
  font-weight: 500;
}
</style>
