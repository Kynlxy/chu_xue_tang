<template>
  <el-container>
    <el-container>
      <el-header id="header" style="text-align: right; font-size: 12px">
        <span class="header-span">初学堂</span>
        <span>用户名占位</span>
        <el-dropdown>
          <i class="el-icon-setting el-icon--right"></i>
          <el-dropdown-menu slot="dropdown">
            <div>
              <el-dropdown-item><p>退出</p></el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
    </el-container>
  </el-container>

</template>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {}
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
