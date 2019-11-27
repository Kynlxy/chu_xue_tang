<template>
  <el-container>
    <el-container>
      <el-header id="header" style="text-align: right; font-size: 12px">
        <span class="header-span">初学堂</span>
        <span>{{userInfo.name || userInfo.mobile}}</span>
        <el-dropdown>
          <i class="el-icon-setting el-icon--right"></i>
          <el-dropdown-menu slot="dropdown">
            <div>
              <el-dropdown-item><p @click="layout">退出</p></el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
    </el-container>
  </el-container>

</template>
<script type="text/ecmascript-6">
  import {util} from '../../common/util';
  export default {
    data() {
      return {
        userInfo: ''
      }
    },
    methods: {
      layout() {
        localStorage.setItem('token', '');
        util.$success('退出成功!');
        setTimeout(() => {
          this.$router.push({
            path: '/login'
          });
        }, 1000);
      }
    },
    mounted() {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less" type="text/less">
  #header {
    width: 100%;
    min-width: 1200px;
    height: 60px;
    padding: 5px 1%;
    background: url(../../../../../../work/zy_bq_system/src/assets/images/header-top.png) no-repeat;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    color: #fff;
    line-height: 45px;
    .header-span {
      margin-left: 10px;
      vertical-align: middle;
      font-size: 19px;
      letter-spacing: 3px;
      float: left;
    }
    .el-icon--right {
      color: #ffffff !important;
    }
  }
</style>
