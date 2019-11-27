<template>
  <el-main class="main-content scheme">
    <navBar></navBar>
    <el-row class="row-radius">
      <el-col :span="24">
        <div class="add-class-wrap">
          <el-form ref="form" :model="form" label-width="150px" :rules="rules">
            <el-form-item label="资讯名字：" prop="title">
              <el-input class="mini-common-input" size="mini" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="资讯类型：" prop="newsType">
              <el-select size="mini" class="mini-common-input" v-model="form.newsType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.text"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资讯banner：" prop="fid"  v-if="form.newsType == 1">
              <input type="file" id="imgFile" @change="imgUpload" accept="image/*"/>
              <p>{{imgFile}}</p>
            </el-form-item>
          </el-form>
          <!--编辑器-->
          <div id="editor">
          </div>
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
        form: {
          fid: '',
          title: '',
          newsType: ''
        },
        options: [{}, {}, {}],
        rules: {
          title: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }],
          fid: [{
            required: true,
            message: 'banner必须上传',
            trigger: 'blur'
          }],
          newsType: [{
            required: true,
            message: '类型必须选择',
            trigger: 'blur'
          }]
        },
      }
    },
    methods: {
      /**
       * 创建课程
       */
      onSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (editor.getHTML().length === 0) {
              util.$error('请输入文章内容!');
              return;
            }
            util.$ajax({
              url: '/api/class/addNews',
              data: {
                fid: this.form.fid,
                title: this.form.title,
                type: this.form.newsType,
                content: editor.getHTML(),
              },
              type: 'post'
            }, res => {
              util.$success('添加成功！');
              setTimeout(() => {
                this.$router.push({
                  path: '/index/newsList'
                }, 1000);
              });
            });
          } else {
            return false
          }
        });
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
      getAllNewsType() {
        util.$ajax({
          url: '/api/class/getAllNewsType',
        }, res => {
          this.options = res.data;
        });
      },

    },
    mounted(){
      this.getAllNewsType();
      window.editor = new RichEditor("#editor", {
        width: '100%',
        height: 400,
        toolBg: "#eee",
        buttons: {
          heading: {
            title: "标题",
            icon: "\uf1dc"
          },
          code: {
            title: "引用",
            icon: "\uf10d"
          },
          bold: {
            title: "加粗",
            icon: "\uf032"
          },
          italic: {
            title: "斜体",
            icon: "\uf033"
          },
          underline: {
            title: "下划线",
            icon: "\uf0cd"
          },
          strikethrough: {
            title: "删除线",
            icon: "\uf0cc"
          },
          foreColor: {
            title: "字体颜色",
            icon: "\uf1fc"
          },
          backColor: {
            title: "背景色",
            icon: "\uf043"
          },
          justifyLeft: {
            title: "居左",
            icon: "\uf036"
          },
          justifyCenter: {
            title: "居中",
            icon: "\uf037"
          },
          justifyRight: {
            title: "居右",
            icon: "\uf038"
          },
          justifyFull: {
            title: "两端对齐",
            icon: "\uf039"
          },
          insertOrderedList: {
            title: "有序列表",
            icon: "\uf0cb"
          },
          insertUnorderedList: {
            title: "无序列表",
            icon: "\uf0ca"
          },
          indent: {
            title: "indent",
            icon: "\uf03c"
          },
          outdent: {
            title: "outdent",
            icon: "\uf03b"
          },
          createLink: {
            title: "链接",
            icon: "\uf0c1"
          },
          insertImage: {
            title: "插入图片",
            icon: "\uf03e"
          },
          save: {
            title: "保存",
            icon: "\uf0c7",
            click: function () {
              console.log(editor.getText());
            }
          }
        }
      });
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
