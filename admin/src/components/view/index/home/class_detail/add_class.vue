<template>
  <el-main class="main-content scheme">
    <navBar></navBar>
    <el-row class="row-radius">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="container">
            <div class="row">
              <div class="col-md-4">点击上传按钮</div>
              <div class="col-md-8">
                <div class="wrap btn btn-default">
                  <input type="file" id="file" @change="fileChange"/>
                  <p>上传文件</p>
                </div>
              </div>
            </div>
            <div class="row" id="process2" style="display: none">
              <div class="col-md-4">上传文件进度</div>
              <div class="col-md-8">
                <div class="progress">
                  <div id="uploadProcessStyle" class="progress-bar" style="width:0%"></div>
                  <p id="uploadProcessValue" class="value">0%</p>
                </div>
              </div>
            </div>
          </div>
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
        chunks: 0
      }
    },
    methods: {
      fileChange(e) {
        this.file = e.target.files[0];
        this.fileSize = this.file.size;
        this.responseChange(this.file);
      },
      // 0.响应点击
      async responseChange(file) {
        // 第一步：按照 修改时间+文件名称+最后修改时间-->MD5
        // 显示文件校验进度
        $("#process1").slideDown(200);
        // 开始校验
        let fileMd5Value = await this.md5File(file);
        // 第二步：校验文件的MD5
        let result = await this.checkFileMD5(file.name, fileMd5Value);
        // 如果文件已存在, 就秒传
        if (result.file) {
//        alert('文件已秒传');
          return;
        }
        // let exit = false
        // 显示文件上传进度
        $("#process2").slideDown(200);
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
          let url =  '/api/video/check/file?fileName=' + fileName + "&fileMd5Value=" + fileMd5Value;
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
            $("#uploadProcessStyle").css({
              width: radio + '%'
            });
            $("#uploadProcessValue").html(radio + '%');
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
          console.log(this.file.slice(start, end));
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
        let url = '/api/video/merge?md5=' + fileMd5Value + "&fileName=" + this.file.name + "&size=" + this.file.size
        $.getJSON(url, function (data) {
          console.log('上传成功');
        })
      }
    },

    mounted(){
    },
    components: {
      navBar
    }
  }
</script>




<style scoped lang="less" rel="stylesheet/less" type="text/less">
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

  #file {
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
