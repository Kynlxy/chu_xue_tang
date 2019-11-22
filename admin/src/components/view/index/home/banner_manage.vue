<template>
  <el-main class="main-content scheme">
    <navBar></navBar>
    <el-row class="row-radius">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="boxContent">
            <div class="box-header">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item class="box-item right">
                  <el-button size="mini" type="primary" @click=" addBannerShowIf = true">新增banner</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="table-wrap">
              <el-table
                :data="bannerData"
                stripe
                style="width: 100%;">
                <el-table-column align="center" prop="sort" label="banner排序（点击可修改）">
                  <template slot-scope="scope">
                    <span class="click-span" @click="showChangeSort(scope.row)">{{scope.row.sort}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="mobile" label="banner展示">
                  <template slot-scope="scope">
                    <img class="banner-img" :src="'/api/pic/getImg?id=' + scope.row.fid"  :preview="scope.$index" >
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="250">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status == 2" type="primary" size="mini"
                               @click="changeBannerStatus(scope.row, 1)">上架
                    </el-button>
                    <el-button v-if="scope.row.status == 1" type="warning" size="mini"
                               @click="changeBannerStatus(scope.row, 2)">下架
                    </el-button>
                    <el-button type="info" size="mini"
                               @click="deleteBanner(scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!-- S 分页 -->
          <div class="pagination-container">
            <el-pagination background @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                           :total="total" layout="prev, pager, next, jumper">
            </el-pagination>
          </div>
          <!-- E 分页 -->
        </div>
        <!--新增banner-->
        <el-dialog title="新增banner" :visible.sync="addBannerShowIf" v-if="addBannerShowIf" width="400px"
                   :before-close="handleClose">
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="图片上传" prop="imgFile" label-width="100px">
              <input type="file" id="imgFile" @change="imgUpload" accept="image/*" />
              <p>{{form.imgFile}}</p>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addBannerShowIf = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="submit" size="mini">确 定</el-button>
          </div>
        </el-dialog>
        <!--banner排序-->
        <el-dialog title="banner排序" :visible.sync="changeSortIf" v-if="changeSortIf" width="400px">
          <el-form :model="sortObj" ref="sortObj" :rules="rules">
            <el-form-item label="banner排序" prop="sort" label-width="100px">
              <el-input size="mini" class="small-input" v-model="sortObj.sort" placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="changeSortIf = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="submitSort" size="mini">确 定</el-button>
          </div>
        </el-dialog>
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
        total: 0,
        listQuery: {
          page: 1
        },
        addBannerShowIf: false,
        bannerData:[],
        rules: {
          imgFile: [{
            required: true,
            message: 'banner图必须上传',
            trigger: 'blur'
          }],
          sort: [{
            required: true,
            message: '请输入banner序号',
            trigger: 'blur'
          }]
        },
        form: {
          imgFile: '点击上传',
          sort: '',
          fid: null
        },
        changeSortIf: false,
        sortObj: {
          sort: ''
        }
      }
    },
    methods: {
      submitSort() {
          util.$ajax({
            url: '/api/class/changeBannerSort',
            type: 'post',
            data: {
              id: this.sortObj.id,
              sort: this.sortObj.sort
            }
          }, res => {
            this.changeSortIf = false;
            util.$success('操作成功');
            this.getList();
          });
      },
      /**
       * 点击展示排序弹框
       */
      showChangeSort(_row) {
        this.changeSortIf = true;
        this.sortObj.id = _row.id;
        this.sortObj.sort = _row.sort;
      },
      /**
       * 删除banner
       */
      deleteBanner(_row) {
        if( + _row.status === 1) {
            util.$alert('请先下架banner方可删除');
            return;
        }
        this.$confirm( `是否要删除这张banner` , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          util.$ajax({
            url: '/api/class/deleteBanner',
            type: 'post',
            data: {
              id: _row.id,
            }
          }, res => {
            util.$success('操作成功');
            this.listQuery.page = 1;
            this.getList();
          });
        }).catch(() => {

        });
      },
      /**
       * 改变banner状态
       */
      changeBannerStatus(_row , _status) {
        util.$ajax({
          url: '/api/class/changeBannerStatus',
          data: {
            id: _row.id,
            status: _status
          }
        }, res => {
          util.$success('添加成功!');
          this.listQuery.page = 1;
          this.getList();
        });
      },
      /**
       * 图片上传
       */
      imgUpload (e){
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
              that.form.imgFile = upLoadData.name;
              that.form.fid = res.fid;
            } else {
              util.error('上传失败!');
            }
          }
        });
      },
      handleClose() {
        this.form.imgFile = '点击上传';
        this.form = {
          fid: null
        }
        this.addBannerShowIf = false;
      },
      //上传banner
      submit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            util.$ajax({
              url: '/api/class/addBanner',
              data: {
                fid: this.form.fid
              }
            }, res => {
              util.$success('添加成功!');
              this.handleClose();
              this.listQuery.page = 1;
              this.getList();
            });
          } else {
            return false
          }
        });
      },
      getList() {
        util.$ajax({
          url: '/api/class/getBanner',
          data: {
              page: this.listQuery.page
          }
        }, res => {
            this.bannerData = res.data;
            this.$previewRefresh();
        });
      },
      handleCurrentChange(_val) {
        this.listQuery.page = _val;
        this.getList();
      },
    },

    mounted(){
      this.getList();
    },
    components: {
      navBar
    }
  }
</script>
<style scoped lang="less" rel="stylesheet/less" type="text/less">
  .scheme {
    .boxContent {
      background: #fff;
      width: 98%;
      margin: 10px auto;
      min-width: 900px;
      border-radius: 5px;
    }
    .box-header {
      height: 52px;
      width: 100%;
      background: rgba(242, 249, 255, 1);
      p {
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 52px;
        padding-left: 16px;
      }
    }
    .box-item {
      margin-left: 10px;
      margin-top: 5px;
    }
    .dataQuery .has-gutter tr th {
      background: rgba(242, 242, 242, 1);
    }
    .table-wrap {
      width: 98%;
      margin: 10px auto;
      min-height: 350px;
      padding: 10px 0;
    }
    .row-radius {
      border-radius: 6px;
    }
    .small-input {
      width: 200px;
    }
    .mini-input {
      width: 140px;
    }
    .tiny-input {
      width: 100px;
    }
    .search-icon {
      font-size: 16px;
      cursor: pointer;
      margin: 0 5px;
    }
    .set-content-div {
      position: relative;
      .left-absolute-div {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 200px;
        margin: auto;
        overflow: auto;
        border-right: 1px solid #eeeeee;
      }
      .right-div-content {
        padding-left: 230px;
        .common-line-div {
          margin: 20px auto;
          p {
            font-size: 14px;
            padding-bottom: 10px;
          }
          span {
            margin: 20px 20px 0 0;
          }
        }
      }
    }
    .big-p {
      font-size: 16px;
      font-weight: bold;
    }
    .tree-common-div {
      .tip-p {
        margin: 20px 0;
      }
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .tree-common-div:last-child {
      border-bottom: 0;
    }
    .source-div {
      margin: 15px 0;
    }
    .banner-img {
      width: 100px;
      height: 40px;
      cursor: pointer;
    }
    .click-span {
      cursor: pointer;
      color: #0e83cd;
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
  }
</style>
