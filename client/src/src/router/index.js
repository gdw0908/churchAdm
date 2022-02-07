import {
  createRouter,
  createWebHistory
} from 'vue-router'
import AdminLogin from '../views/admin/AdminLogin.vue'
import Main from '../views/admin/Main.vue'
import AdminList from '../views/admin/AdminList.vue'
import AdminRegist from '../views/admin/AdminRegist.vue'
import AdminUpdate from '../views/admin/AdminUpdate.vue'
import QnaList from '../views/admin/QnaList.vue'
import QnaRegist from '../views/admin/QnaRegist.vue'
import NoticeList from '../views/admin/NoticeList.vue'
import NoticeRegist from '../views/admin/NoticeRegist.vue'

const routes = [
  {
    path: '/',
    name: 'adminLogin',
    component: AdminLogin
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
  {
    path: '/adminLogin',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/adminList',
    name: 'AdminList',
    component: AdminList
  },
  {
    path: '/adminRegist',
    name: 'AdminRegist',
    component: AdminRegist
  },
  {
    path: '/adminUpdate',
    name: 'AdminUpdate',
    component: AdminUpdate
  },
  {
    path: '/qnaList',
    name: 'qnaList',
    component: QnaList
  },
  {
    path: '/qnaRegist',
    name: 'qnaRegist',
    component: QnaRegist
  },
  {
    path: '/qnaUpdate',
    name: 'qnaUpdate',
    component: QnaRegist
  },
  {
    path: '/qnaReply',
    name: 'qnaReply',
    component: QnaRegist
  },
  {
    path: '/noticeList',
    name: 'noticeList',
    component: NoticeList
  },
  {
    path: '/noticeRegist',
    name: 'noticeRegist',
    component: NoticeRegist
  },
  {
    path: '/noticeUpdate',
    name: 'noticeUpdate',
    component: NoticeRegist
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router