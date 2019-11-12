<template>
  <el-main class="main-content scheme">
    <navBar></navBar>
    <el-row class="row-radius">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="boxContent">
            <div class="box-header">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="学生名称:" class="box-item">
                  <el-input size="mini" class="small-input" v-model="searchData" placeholder="请输入">
                  </el-input>
                </el-form-item>
                <el-form-item class="box-item right">
                  <el-button size="mini" type="primary" @click="search">查询</el-button>
                  <el-button size="mini" type="primary" @click=" addStudentDialog = true">新增学生</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="table-wrap">
              <el-table
                :data="mainData"
                stripe
                style="width: 100%;">
                <el-table-column
                  style="background:rgba(242,242,242,1)"
                  align="center"
                  prop="name"
                  label="学生姓名"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="mobile"
                  label="手机号">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="class_total"
                  label="所报课程总数">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="date"
                  label="入学时间">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="address"
                  label="操作"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini">查看详情</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
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
      </el-col>
    </el-row>
    <el-dialog title="新增学生" :visible.sync="addStudentDialog" v-if="addStudentDialog" width="400px"
               :before-close="handleClose">
      <el-form :model="addInfo" ref="addInfo" :rules="rules">
        <el-form-item label="学生姓名" prop="name" label-width="100px">
          <el-input v-model="addInfo.name" size="mini" placeholder="请输入学生姓名"></el-input>
        </el-form-item>
        <el-form-item label="学生手机号" prop="mobile" label-width="100px">
          <el-input v-model="addInfo.mobile" size="mini" placeholder="请输入学生手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStudentDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>
<script type="text/ecmascript-6">
  import navBar from '../../../common/navBar.vue';
  import {util} from '../../../../common/util';
  export default{
    data(){
      let validMobile = (rule, value, callback) => {
        if (value && value.length != 11) {
          callback();
        } else {
          let reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$|19[0-9]{9}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号'));
          } else {
            callback();
          }
        }
      };
      return {
        total: 0,
        listQuery: {
          page: 1
        },
        searchData: '',
        mainData: [],
        addInfo: {
          mobile: '',
          name: ''
        },
        addStudentDialog: false,
        rules: {
          name: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            validator: validMobile,
            trigger: 'blur'
          }]
        },
      }
    },
    methods: {
      handleClose() {
        this.addInfo = {
          mobile: '',
          name: ''
        };
        this.addStudentDialog = false;
      },
      submit() {
        this.$refs['addInfo'].validate(valid => {
          if (valid) {
            util.$ajax({
              url: '/api/admin/student/addStudent',
              data: {
                mobile: this.addInfo.mobile,
                name: this.addInfo.name,
                time: util.forMatterMinute(new Date())

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
      /**
       * 搜索课程
       */
      search() {
        this.listQuery.page = 1;
        this.getList(1);
      },
      getList(_num) {
        util.$ajax({
          url: '/api/admin/student/getAllStudent',
          data: {
            searchData: this.searchData,
            page: this.listQuery.page
          }
        }, res => {
          if (_num && +_num === 1) {
            util.$success('搜索成功');
          }
          if (res.data && res.data.length > 0) {
            res.data.map(i => {
              i.date = util.forMatterDate(i.create_time);
            });
          }
          this.mainData = res.data;
          this.total = res.total;
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
  }
</style>
