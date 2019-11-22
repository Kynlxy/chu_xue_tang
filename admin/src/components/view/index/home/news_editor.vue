<template>
  <el-main class="main-content scheme">
    <navBar></navBar>
    <el-row class="row-radius">
      <el-col :span="24">
        <div class="add-class-wrap">
          <el-form ref="form" :model="form" label-width="150px" :rules="rules">
            <el-form-item label="新闻标题：" prop="name">
              <el-input class="mini-common-input" size="mini" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="新闻banner：" prop="fid">
              <input type="file" id="imgFile" @change="imgUpload" accept="image/*"/>
              <p>{{imgFile}}</p>
            </el-form-item>
          </el-form>

          <div style="text-align: center;margin: 20px">
            <el-button @click="goBack" size="mini">取消</el-button>
            <el-button type="primary" @click="onSubmit" size="mini">立即创建</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>
<script type="text/ecmascript-6">
  import navBar from '../../../common/navBar.vue';
  import {util} from '../../../../common/util';
  export default{
    data(){
      return {
        imgFile: '上传Banner图',
        teacherList: [],
        form: {},
        rules: {
          name: [{
            required: true,
            message: '新闻名称不能为空',
            trigger: 'blur'
          }]
        },
      }
    },
    methods: {
      onSubmit() {
      },
      imgUpload(e) {
        const upLoadData = e.target.files[0];
        const _formData = new FormData();
        let that = this;
        _formData.append('file', upLoadData);
        $.ajax({
          url: '/api/pic/uploadImg',
          data: _formData,
          type: 'post',
          cache: false,
          contentType: false,
          processData: false,
          headers: {'token': localStorage.getItem('token')},
          success (res) {
            if (+res.code === 1) {
              util.$success('上传成功!');
              that.imgFile = upLoadData.name;
              that.form.fid = res.fid;
            } else {
              util.error('上传失败!');
            }
          }
        });
      },

      goBack() {
        history.go(-1);
      },

    },
    editor() {
      return this.$refs.myQuillEditor.quill
    },
    mounted(){
      var ue = UE.getEditor('container');
    },
    components: {
      navBar
    }
  }
</script>


<style scoped lang="less" rel="stylesheet/less" type="text/less">
  .add-class-wrap {
    padding: 20px;
    background: #ffffff;
  }

  .mini-common-input {
    width: 300px;
  }

  .wrap {
    width: 100px;
    height: 40px;
    background-color: red;
    text-align: center
  }

  .wrap p {

    width: 100%;
    height: 100%;
    line-height: 2;
    text-align: center;
  }

  #imgFile, #file {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 40px;
    display: block;
    opacity: 0;
  }

  .progress {
    position: relative;
  }

  .progress-bar {
    transition: width .3s ease
  }

  .progress .value {
    position: absolute;
    color: #FF9800;
    left: 50%;
  }

  .container {
    width: 500px;
  }

  .row {
    border-bottom: 1px solid gray;
    padding: 10px;
  }

  .hidden {
    display: none;
  }
</style>
