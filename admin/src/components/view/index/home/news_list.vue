<template>
  <el-main class="main-content scheme">
    <navBar></navBar>
    <el-row class="row-radius">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="boxContent">
            <div class="box-header">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="新闻名称:" class="box-item">
                  <el-input size="mini" class="small-input" v-model="searchData" placeholder="请输入">
                  </el-input>
                </el-form-item>
                <el-form-item class="box-item right">
                  <el-button size="mini" type="primary" @click="search">查询</el-button>
                  <router-link to="/index/newsEditor">
                    <el-button size="mini" type="primary">新增资讯</el-button>
                  </router-link>
                </el-form-item>
              </el-form>
            </div>
            <div class="table-wrap">
              <el-table
                :data="mainData"
                stripe
                style="width: 100%;">
                <el-table-column style="background:rgba(242,242,242,1)" align="center" prop="title" label="资讯名称">
                </el-table-column>
                <el-table-column align="center" prop="mobile" label="banner展示">
                  <template slot-scope="scope">

                    <img v-if="scope.row.fid" class="banner-img" :src="'/api/pic/getImg?id=' + scope.row.fid"  >
                    <span v-else>
                      暂无图片
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="watch_times" label="资讯浏览数"></el-table-column>
                <el-table-column align="center" prop="date" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="changeNews(scope.row)">修改资讯</el-button>
                    <el-button type="danger" size="mini" @click="deleteNews(scope.row)">删除</el-button>
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
        rules: {
          class_name: [{
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
          studentId: [{
            required: true,
            message: '学生名称不能为空',
            trigger: 'blur'
          }]
        },
        searchData: '',

        mainData: [],

      }
    },
    methods: {
      /**
       * 修改新闻
       */
      changeNews(_row) {

      },
      /**
       * 删除新闻
       */
      deleteNews(_row) {

      },
      /**
       * 搜索课程
       */
      search() {
        this.listQuery.page = 1;
        this.getNewsList(1);
      },
      getNewsList(_num) {
        util.$ajax({
          url: '/api/class/getNewsList',
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
        this.getNewsList();
      },

    },

    mounted(){
      this.getNewsList();
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
  .banner-img {
    width: 100px;
    height: 40px;
  }

  .pagination-container {
    margin-top: 20px;
  }
</style>
