<template>
  <div>
    <!--头部导航栏-->
    <headers></headers>
    <!--头部以下部分-->
    <div class="body-content_wrap">
      <!--侧边栏-->
      <sidebar/>
      <div class="body-content_center">
        <div class="top-tip-bar" >
          <!--核心内页展示模块-->
          <router-view>

          </router-view>
        </div>

      </div>
    </div>

  </div>

</template>
<script type="text/ecmascript-6">
  import headers from '../../common/header.vue';
  import sidebar from '../../common/sidebar.vue';
  export default{
    data(){
      return {
        navName: ''
      }
    },
    mounted(){
    },
    components: {
      headers: headers,
      sidebar
    }

  }
</script>

<style>
  .body-content_wrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 60px;
    min-width: 900px;
  }
  .body-content_center {
    position: relative;
    flex: 1;
    overflow: auto;
    height: 100%;
  }
</style>
