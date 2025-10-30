import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import TableExportPDF from '../components/TableComponent.vue'
import TableFilter from '../views/TableFilter.vue'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/table-export-pdf',
    name: 'TableExportPDF',
    component: TableExportPDF
  },
  {
    path: '/table-filter',
    name: 'TableFilter',
    component: TableFilter
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router