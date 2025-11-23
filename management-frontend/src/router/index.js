import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '工作台' }
      },
      {
        path: 'appointment',
        name: 'Appointment',
        component: () => import('../views/appointment/index.vue'),
        meta: { title: '预约管理' }
      },
      {
        path: 'patients',
        name: 'Patients',
        component: () => import('../views/patients/index.vue'),
        meta: { title: '患者管理' }
      },
      {
        path: 'staff',
        name: 'Staff',
        component: () => import('../views/staff/index.vue'),
        meta: { title: '人员管理' }
      },
      {
        path: 'chairs',
        name: 'Chairs',
        component: () => import('../views/chairs/index.vue'),
        meta: { title: '牙椅管理' }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('../views/statistics/index.vue'),
        meta: { title: '统计分析' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router