<template>
  <el-menu class="el-menu-vertical-demo" id="sidebar" background-color="#292C33" text-color="#ffffff"
           :collapse="isCollapse"
           :default-active='active' :unique-opened="opened">
    <el-submenu v-for="(item,index) in sideBarArr" :key="item.index" :index="item.index">
      <template slot="title">
        <i :class="item.className"></i><span>{{item.text}}</span>
      </template>
      <router-link v-for="items in item.children" :key="items.url" :to="items.url">
        <el-menu-item :index="items.index"><i :class="items.className"></i><span>{{items.text}}</span></el-menu-item>
      </router-link>
    </el-submenu>
    <el-menu-item index="999" class="last-btn" @click="isCollapse = !isCollapse">
      <i :class="!isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right' "></i>
      <span slot="title">{{!isCollapse ? '收缩侧边栏' : '展开侧边栏'}}</span>
    </el-menu-item>
  </el-menu>
</template>
<script type="text/ecmascript-6">
  export default{
    data(){
      return {
        isCollapse: false,
        active: sessionStorage.getItem("active"),
        opened: true,
        sideBarArr: []
      }
    },
    methods: {
      getSidebar() {
        let _userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (+_userInfo.type === 3) {
          this.sideBarArr = [{
            text: '课程相关',
            className: 'el-icon-s-tools',
            index: '1',
            children: [
              {text: '课程管理', url: '/index/classManage', index: '1-1', className: 'el-icon-edit'}
            ]
          }, {
            text: '人员管理',
            className: 'el-icon-s-custom',
            index: '2',
            children: [
              {text: '学生列表', url: '/index/studentList', index: '2-1', className: 'el-icon-user'},
              {text: '教师列表', url: '/index/teacherList', index: '2-2', className: 'el-icon-user-solid'}
            ]
          }, {
            text: 'banner管理',
            className: 'el-icon-camera',
            index: '3',
            children: [
              {text: 'banner设置', url: '/index/bannerManage', index: '3-1', className: 'el-icon-picture'},
            ]
          }, {
            text: '资讯相关',
            className: 'el-icon-document',
            index: '4',
            children: [
              {text: '资讯列表', url: '/index/newsList', index: '4-1', className: 'el-icon-news'},
              {text: '资讯管理', url: '/index/newsEditor', index: '4-2', className: 'el-icon-edit-outline'}
            ]
          }];
        } else {
          this.sideBarArr = [{
            text: '课程相关',
            className: 'el-icon-s-tools',
            index: '5',
            children: [
              {text: '我的课程', url: '/index/teacherClassManage', index: '5-1', className: 'el-icon-edit'}
            ]
          }];
        }
      },
    },
    mounted(){
      this.getSidebar();
    }
  }
</script>
<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
