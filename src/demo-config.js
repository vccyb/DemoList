// 演示项目配置文件
export const demoCategories = [
  {
    id: "vue",
    name: "常用Vue原生的Demo",
    description: "基于Vue原生特性的演示",
  },
  {
    id: "js",
    name: "JS或原生的Demo",
    description: "JavaScript或原生技术的演示",
  },
  {
    id: "component",
    name: "业务组件的demo",
    description: "业务组件相关的演示",
  },
];

// 所有演示项目配置
export const demoItems = [
  {
    id: "table-export-pdf",
    name: "表格导出PDF功能",
    path: "/table-export-pdf",
    component: () => import("./components/TableComponent.vue"),
    category: "component",
    description: "演示如何将表格数据导出为PDF文件",
  },
  {
    id: "table-filter",
    name: "表格筛选功能",
    path: "/table-filter",
    component: () => import("./views/TableFilter.vue"),
    category: "component",
    description: "演示表格的筛选功能实现",
  },
  {
    id: "v-model-demo",
    name: "defineModel 宏演示",
    path: "/v-model-demo",
    component: () => import("./components/VModelDemo.vue"),
    category: "vue",
    description: "演示Vue 3.4+ defineModel宏的使用方法",
  },
  {
    id: "async-api-demo",
    name: "异步API与路由管理",
    path: "/async-api-demo",
    component: () => import("./views/AsyncApiDemo.vue"),
    category: "vue",
    description: "演示异步API调用、路由查询参数更新和响应式数据管理的最佳实践",
  },
];

// 首页路由（不显示在分类列表中）
export const homeRoute = {
  id: "home",
  name: "首页",
  path: "/",
  component: () => import("./views/HomePage.vue"),
};

// 生成路由配置
export const generateRoutes = () => {
  // 首页路由
  const routes = [homeRoute];

  // 添加所有演示项目的路由
  demoItems.forEach((item) => {
    routes.push({
      path: item.path,
      name: item.id,
      component: item.component,
    });
  });

  return routes;
};

// 生成导航菜单项
export const getMenuItems = () => {
  // 只包含需要在导航中显示的项目
  const menuItems = [homeRoute];

  // 添加所有演示项目到菜单
  demoItems.forEach((item) => {
    menuItems.push({
      name: item.name,
      path: item.path,
    });
  });

  return menuItems;
};

// 按分类组织演示项目
export const getDemoItemsByCategory = () => {
  const categorizedItems = {};

  // 初始化分类
  demoCategories.forEach((category) => {
    categorizedItems[category.id] = {
      ...category,
      items: [],
    };
  });

  // 将演示项目按分类组织
  demoItems.forEach((item) => {
    if (categorizedItems[item.category]) {
      categorizedItems[item.category].items.push(item);
    }
  });

  return categorizedItems;
};
