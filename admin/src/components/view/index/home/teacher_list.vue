<template>
  <el-main class="main-content scheme">
    <navBar></navBar>
    <el-row class="row-radius">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="boxContent">
            <div class="box-header">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="教师名称:" class="box-item">
                  <el-input size="mini" class="small-input" v-model="searchData" placeholder="请输入">
                  </el-input>
                </el-form-item>
                <el-form-item class="box-item right">
                  <el-button size="mini" type="primary" @click="search">查询</el-button>
                  <el-button size="mini" type="primary">新增教师</el-button>
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
                  label="教师姓名"
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
                  label="拥有课程数">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="date"
                  label="加入时间">
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
            <el-pagination background @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :total="total" layout="prev, pager, next, jumper">
            </el-pagination>
          </div>
          <!-- E 分页 -->
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
        total: 0,
        listQuery: {
          page: 1
        },
        searchData: '',
        mainData: []
      }
    },
    methods: {
      /**
       * 搜索课程
       */
      search() {
        this.listQuery.page = 1;
        this.getClassList(1);
      },
      getClassList(_num) {
        util.$ajax({
          url: '/api/admin/teacher/getAllTeacher',
          data: {
            searchData: this.searchData,
            page: this.listQuery.page
          }
        }, res => {
          if (_num && + _num === 1) {
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
        this.getClassList();
      },
    },

    mounted(){
      this.getClassList();
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
