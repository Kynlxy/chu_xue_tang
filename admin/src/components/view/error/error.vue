<template>
  <div class="error">
    <div class="head-error"></div>
    <div class="txt-bg">
      <div class="txt-box">
        <p>对不起，您请求的页面不存在、或已被删除、或暂时不可用</p>
        <p class="padding-box">请点击以下链接继续浏览网页</p>
        <p class="padding-box click" @click="goBack">》返回</p>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    data(){
      return {}
    },
    methods: {
      goBack() {
        this.$router.push({path: '/index/classManage'})
      }
    }

  }
</script>

<style scoped lang="less" rel="stylesheet/less" type="text/less">
  .error {
    position: absolute;
    padding-top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    background: #494949;
    .head-error {
      width: 580px;
      height: 234px;
      margin: 0 auto 0 auto;
      background: url(../../../assets/images/head404.png) no-repeat;
    }
    .txt-bg {
      width: 499px;
      height: 169px;
      margin: 10px auto 0 auto;
      background: url(../../../assets/images/txtbg404.png) no-repeat;
    }
    .txt-bg .txt-box {
      width: 390px;
      position: relative;
      top: 30px;
      left: 60px;
      color: #eee;
      font-size: 14px;
    }
    .txt-bg .txt-box p {
      margin: 5px 0;
      line-height: 18px;
    }
    .txt-bg .txt-box .padding-box {
      padding-top: 15px;
    }
    .txt-bg .txt-box p a {
      color: #eee;
      text-decoration: none;
    }
    .txt-bg .txt-box p a:hover {
      color: #FC9D1D;
      text-decoration: underline;
    }
    .click {
      cursor: pointer;
    }
  }

</style>

