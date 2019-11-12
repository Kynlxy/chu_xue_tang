<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 20px 0;" v-if="navName && navName.length > 0">
        <el-breadcrumb-item v-for="(item,index) in navName" :key="item + index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script type="text/ecmascript-6">
    export default{
        data(){
            return {
                navName: ''
            }
        },
        mounted(){
            var _navName =  sessionStorage.getItem("navName") || '';
            this.navName = _navName.split(',');

        }

    }
</script>