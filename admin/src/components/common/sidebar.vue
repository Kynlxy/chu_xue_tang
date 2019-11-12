<template>
    <el-menu class="el-menu-vertical-demo" id="sidebar" background-color="#292C33" text-color="#ffffff"  :collapse="isCollapse"
             :default-active='active'  :unique-opened="opened">
        <el-submenu v-for="(item,index) in sideBarArr" :key="item.index" :index="item.index" >
            <template slot="title">
                <i :class="item.className"></i><span>{{item.text}}</span>
            </template>
            <router-link v-for="items in item.children" :key="items.url" :to="items.url" >
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
            return{
                isCollapse: false,
                active : sessionStorage.getItem("active"),
                opened: true,
                sideBarArr: [{
                    text: '课程相关',
                    className: 'el-icon-s-tools',
                    index: '1',
                    children: [
                        {text: '课程管理', url: '/index/classManage' , index: '1-1', className: 'el-icon-edit'}
                    ]
                },{
                    text: '人员管理',
                    className: 'el-icon-document-copy',
                    index: '2',
                    children: [
                        {text: '学生列表', url: '/index/studentList' , index: '2-1', className: 'el-icon-news'},
                        {text: '教师列表', url: '/index/teacherList' , index: '2-2', className: 'el-icon-printer'}
                    ]
                },{
                    text: '标签同步',
                    className: 'el-icon-share',
                    index: '3',
                    children: [
                        {text: '同步方案', url: '/index/synchronizationScheme' , index: '3-1' , className: 'el-icon-date'},
                        {text: '同步任务监控', url: '/index/synchronizationPlan' , index: '3-2', className: 'el-icon-view'}
                    ]
                },{
                    text: '智能标签',
                    className: 'el-icon-document',
                    index: '4',
                    children: [
                        {text: '智能搜索', url: '/index/intelligentSearch' , index: '4-1', className: 'el-icon-zoom-in'},
                        {text: '标签圈群', url: '/index/labelCircleGroup' , index: '4-2', className: 'el-icon-edit-outline'}
                    ]
                }]
            }
        },
        mounted(){

        }
    }
</script>
<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>
