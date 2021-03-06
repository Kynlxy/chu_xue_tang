import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/view/login/login.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/error',
      name: 'error',
      component: resolve => require(["@/components/view/error/error"], resolve),
      //路由懒加载 优化初次打开加载所有组件导致白屏过久 但是 切换路由会有稍许卡顿
      meta: {
        auth: true // 这里设置，当前路由需要校验
      }
    },
    {
      path: '/index',
      name: 'index',
      component: resolve => require(["@/components/view/index/index"], resolve),
      //路由懒加载 优化初次打开加载所有组件导致白屏过久 但是 切换路由会有稍许卡顿
      meta: {
        auth: true // 这里设置，当前路由需要校验
      },

      children: [
        {
          path: '/index/classManage',
          name: 'classManage',
          component: resolve => require(["@/components/view/index/home/class_manage"], resolve),
          meta: {
            auth: true,                     // 这里设置，当前路由需要校验
            active: '1-1',                   //侧边栏active状态
            navName: ['课程管理', '课程管理']   //navbar文案展示
          }
        },{
          path: '/index/addClass',
          name: 'addClass',
          component: resolve => require(["@/components/view/index/home/class_detail/add_class"], resolve),
          meta: {
            auth: true,                     // 这里设置，当前路由需要校验
            active: '1-1',                   //侧边栏active状态
            navName: ['课程管理', '添加课程']   //navbar文案展示
          }
        }, {
          path: '/index/studentList',
          name: 'studentList',
          component: resolve => require(["@/components/view/index/home/student_list"], resolve),
          meta: {
            auth: true,                     // 这里设置，当前路由需要校验
            active: '2-1',                   //侧边栏active状态
            navName: ['人员管理', '学生列表']   //navbar文案展示
          }
        },{
          path: '/index/teacherList',
          name: 'teacherList',
          component: resolve => require(["@/components/view/index/home/teacher_list"], resolve),
          meta: {
            auth: true,                     // 这里设置，当前路由需要校验
            active: '2-2',                   //侧边栏active状态
            navName: ['人员管理', '教师列表']   //navbar文案展示
          }
        },{
          path: '/index/bannerManage',
          name: 'bannerManage',
          component: resolve => require(["@/components/view/index/home/banner_manage"], resolve),
          meta: {
            auth: true,                     // 这里设置，当前路由需要校验
            active: '3-1',                   //侧边栏active状态
            navName: ['banner管理', 'banner设置']   //navbar文案展示
          }
        },{
          path: '/index/newsList',
          name: 'newsList',
          component: resolve => require(["@/components/view/index/home/news_list"], resolve),
          meta: {
            auth: true,                     // 这里设置，当前路由需要校验
            active: '4-1',                   //侧边栏active状态
            navName: ['资讯相关', '资讯列表']   //navbar文案展示
          }
        },{
          path: '/index/newsEditor',
          name: 'newsEditor',
          component: resolve => require(["@/components/view/index/home/news_editor"], resolve),
          meta: {
            auth: true,                     // 这里设置，当前路由需要校验
            active: '4-1',                   //侧边栏active状态
            navName: ['资讯相关', '资讯管理']   //navbar文案展示
          }
        },{
          path: '/index/teacherClassManage',
          name: 'teacherClassManage',
          component: resolve => require(["@/components/view/index/teacher/teacher_class_manage"], resolve),
          meta: {
            auth: true,                     // 这里设置，当前路由需要校验
            active: '5-1',                   //侧边栏active状态
            navName: ['课程相关', '我的管理']   //navbar文案展示
          }
        }
      ]
    }
  ]
})
