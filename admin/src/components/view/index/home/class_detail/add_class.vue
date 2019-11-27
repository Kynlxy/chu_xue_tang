<template>
  <el-main class="main-content scheme">
    <navBar></navBar>
    <el-row class="row-radius">
      <el-col :span="24">
        <div class="add-class-wrap">
          <el-form ref="form" :model="form" label-width="150px" :rules="rules">
            <el-form-item label="课程名称：" prop="name">
              <el-input class="mini-common-input" size="mini" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="授课老师：" prop="teacher_id">
              <el-select class="mini-common-input" size="mini" v-model="form.teacher_id" placeholder="请选择授课老师">
                <el-option
                  v-for="item in teacherList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.uid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程介绍：" prop="class_introduce">
              <el-input type="textarea" v-model="form.class_introduce"></el-input>
            </el-form-item>
            <el-form-item label="Banner上传：" prop="fid">
              <input type="file" id="imgFile" @change="imgUpload" accept="image/*"/>
              <p>{{imgFile}}</p>
            </el-form-item>
            <el-form-item label="视频上传：" prop="video_id">
              <input type="file" id="file" @change="fileChange"/>
              <p>{{uploadFile}}</p>
            </el-form-item>
            <el-form-item label="视频权限：" >
              <el-switch
                v-model="form.switchBoolean"
                active-text="公开"
                inactive-text="不公开">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button @click="goBack" size="mini">取消</el-button>
              <el-button type="primary" @click="onSubmit" size="mini">立即创建</el-button>
            </el-form-item>
          </el-form>
          <el-dialog
            title="上传中..."
            :visible.sync="uploadShowIf"
            width="50%">
            <el-progress :text-inside="true" :stroke-width="26" :percentage="uploadProgress"></el-progress>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>
<script type="text/ecmascript-6">
  import navBar from '../../../../common/navBar.vue';
  import {util} from '../../../../../common/util';
  export default{
    data(){
      return {
        chunkSize: 15 * 1024 * 1024,
        fileSize: 0,
        file: null,
        hasUploaded: 0,
        chunks: 0,
        uploadShowIf: false,
        uploadProgress: 0,
        uploadFile: '上传视频',
        imgFile: '上传Banner图',
        teacherList: [],
        form: {
          name: '',
          teacher_id: '',
          class_introduce: '',
          video_id: null,
          fid: null,
          switchBoolean: false
        },
        rules: {
          name: [{
            required: true,
            message: '课程名称不能为空',
            trigger: 'blur'
          }],
          teacher_id: [{
            required: true,
            message: '授课老师不能为空',
            trigger: 'blur'
          }],
          class_introduce: [{
            required: true,
            message: '课程介绍不能为空',
            trigger: 'blur'
          }],
          video_id: [{
            required: true,
            message: '视频不能为空',
            trigger: 'blur'
          }],
          fid: [{
            required: true,
            message: 'banner不能为空',
            trigger: 'blur'
          }]

        },
      }
    },
    methods: {
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
      fileChange(e) {
        this.file = e.target.files[0];
        this.fileSize = this.file.size;
        this.responseChange(this.file);
      },
      // 0.响应点击
      async responseChange(file) {
        // 第一步：按照 修改时间+文件名称+最后修改时间-->MD5
        this.uploadShowIf = true;
        // 开始校验
        let fileMd5Value = await this.md5File(file);
        // 第二步：校验文件的MD5
        let result = await this.checkFileMD5(file.name, fileMd5Value);
        // 如果文件已存在, 就秒传
        if (result.file) {
          this.uploadShowIf = false;
          util.$success('视频上传成功');
          this.uploadFile = result.file.name.split('/')[result.file.name.split('/').length - 1];
          this.form.video_id = result.file.id;
          return;
        }
        // let exit = false
        // 第三步：检查并上传MD5
        await this.checkAndUploadChunk(fileMd5Value, result.chunkList);
        // 第四步: 通知服务器所有分片已上传完成
        this.notifyServer(fileMd5Value);
      },
      // 1.修改时间+文件名称+最后修改时间-->MD5
      md5File(file) {
        return new Promise((resolve, reject) => {
          var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            //chunkSize = 2097152, // Read in chunks of 2MB
            chunkSize = Math.ceil(file.size / 100),
            //chunks = Math.ceil(file.size / chunkSize),
            chunks = 100,
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

          fileReader.onload = function (e) {
            spark.append(e.target.result); // Append array buffer
            currentChunk++;

            if (currentChunk < chunks) {
              loadNext();
            } else {
              let result = spark.end();
              resolve(result);
            }
          };
          function loadNext() {
            var start = Math.ceil(currentChunk * chunkSize);
            var end = ((start + chunkSize) >= file.size) ? file.size : Math.min(file.size, start + chunkSize);

            fileReader.readAsArrayBuffer(blobSlice.call(file, Math.ceil(start), Math.ceil(end)));
            $("#checkProcessStyle").css({
              width: (currentChunk + 1) + '%'
            })
            $("#checkProcessValue").html((currentChunk + 1) + '%');
          }

          loadNext();
        })
      },
      // 2.校验文件的MD5
      checkFileMD5(fileName, fileMd5Value) {
        return new Promise((resolve, reject) => {
          let url = '/api/video/check/file?fileName=' + fileName + "&fileMd5Value=" + fileMd5Value;
          $.getJSON(url, function (data) {
            resolve(data);
          })
        })
      },
      // 3.上传chunk
      async  checkAndUploadChunk(fileMd5Value, chunkList) {
        this.chunks = Math.ceil(this.fileSize / this.chunkSize);
        this.hasUploaded = chunkList.length;
        for (let i = 0; i < this.chunks; i++) {
          let exit = chunkList.indexOf(i + "") > -1;
          // 如果已经存在, 则不用再上传当前块
          if (!exit) {
            let index = await this.upload(i, fileMd5Value, this.chunks);
            this.hasUploaded++;
            let radio = Math.floor((this.hasUploaded / this.chunks) * 100);
            this.uploadProgress = radio;
          }
        }
      },

      // 3-2. 上传chunk
      upload(i, fileMd5Value, chunks) {
        return new Promise((resolve, reject) => {
          //构造一个表单，FormData是HTML5新增的
          let start = Math.ceil(i * this.chunkSize);
          let end = (i + 1) * this.chunkSize >= this.file.size ? this.file.size : Math.min(this.file.size, start + this.chunkSize);
          let form = new FormData();
          form.append("data", this.file.slice(start, end)) //file对象的slice方法用于切出文件的一部分
          form.append("total", chunks); //总片数
          form.append("index", i) //当前是第几片
          form.append("fileMd5Value", fileMd5Value);
          $.ajax({
            url: "/api/video/upload",
            type: "POST",
            data: form, //刚刚构建的form数据对象
            async: true, //异步
            processData: false, //很重要，告诉jquery不要对form进行处理
            contentType: false, //很重要，指定为false才能形成正确的Content-Type
            success: function (data) {
              resolve(data.desc);
            }
          })
        })

      },
      // 第四步: 通知服务器所有分片已上传完成
      notifyServer(fileMd5Value) {
        let that = this;
        let url = '/api/video/merge?md5=' + fileMd5Value + "&fileName=" + this.file.name + "&size=" + this.file.size
        $.getJSON(url, function (data) {
          that.uploadFile = that.file.name;
          that.uploadShowIf = false;
          that.form.video_id = data.id;
          util.$success('上传成功！');
        })
      },
      goBack() {
        history.go(-1);
      },
      /**
       * 按钮最后提交
       */
      onSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            util.$ajax({
              url: '/api/admin/class/addClass',
              type: 'post',
              data: this.form
            }, res => {
                util.$success('课程新增成功!');
                setTimeout( () => {
                  this.$router.push({
                    path: '/index/classManage'
                  });
                });
            });
          } else {
            return false
          }
        });
      },
      getTeacherList() {
        util.$ajax({
          url: '/api/admin/teacher/getAllTeacher',
          data: {
            status: 1
          }
        }, res => {
          this.teacherList = res.data;
        });
      },
    },

    mounted(){
      this.getTeacherList();
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
