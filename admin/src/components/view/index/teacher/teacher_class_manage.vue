<template>
  <el-main class="main-content scheme">
    <navBar></navBar>
    <el-row class="row-radius">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <div class="boxContent">
            <div class="box-header">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="课程名称:" class="box-item">
                  <el-input size="mini" class="small-input" v-model="searchData" placeholder="请输入">
                  </el-input>
                </el-form-item>
                <el-form-item class="box-item right">
                  <el-button size="mini" type="primary" @click="search">查询</el-button>
                  <router-link to="/index/addClass">
                    <el-button size="mini" type="primary">新增课程</el-button>
                  </router-link>
                </el-form-item>
              </el-form>
            </div>
            <div class="table-wrap">
              <el-table
                :data="mainData"
                stripe
                style="width: 100%;">
                <el-table-column style="background:rgba(242,242,242,1)" align="center" prop="class_name" label="课程名称">
                </el-table-column>
                <el-table-column align="center" prop="date" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="student_total" label="学生总数"></el-table-column>
                <el-table-column align="center" prop="watch_times" label="课程游览次数"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="250">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="peopleManage(scope.row)">学生管理</el-button>
                    <el-button type="danger" size="mini" @click="deleteClass(scope.row)">删除</el-button>
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
        <!--课程详情开始-->
        <el-dialog title="学生管理" :visible.sync="peopleShowIf" v-if="peopleShowIf" width="800px"
                   :before-close="handleClose">
          <el-form :model="peopleInfo" ref="peopleInfo" :rules="rules">
            <el-button style="margin-bottom: 20px" size="mini" type="primary" @click="openAddStudentDialog">新增学生
            </el-button>
            <el-table :data="studentData" border style="width: 100%">
              <el-table-column prop="name" label="学生姓名"></el-table-column>
              <el-table-column prop="mobile" label="学生手机号"></el-table-column>
              <el-table-column align="center" prop="address" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="lookHomeWork(scope.row)">作业</el-button>
                  <el-button type="danger" size="mini" @click="deleteStudent(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <!-- S 分页 -->
          <div class="pagination-container">
            <el-pagination background @current-change="studentChange" :current-page.sync="student.page"
                           :total="student.total" :page-size="5" layout="prev, pager, next, jumper">
            </el-pagination>
          </div>
          <!-- E 分页 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="peopleShowIf = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="lastSubmit" size="mini">确 定</el-button>
          </div>
        </el-dialog>
        <!--课程详情结束-->
        <!--新增上课的学生-->
        <el-dialog title="新增学生" :visible.sync="addStudentDialog" v-if="addStudentDialog" width="400px"
        >
          <el-form :model="addInfo" ref="addInfo" :rules="rules">
            <el-form-item label="学生姓名" prop="studentId" label-width="100px">
              <el-select size="mini" v-model="addInfo.studentId" placeholder="请选择">
                <el-option v-for="item in studentDataArr" :key="item.name" :label="item.name" :value="item.uid"
                           :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addStudentDialog = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="submit" size="mini">确 定</el-button>
          </div>
        </el-dialog>
        <!--新增上课学生结束-->
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
        clickClassId: null,     //缓存点击的课程的id
        clickClass: null ,
        addStudentDialog: false,
        studentDataArr: [],     //获取所有学生的数组
        addInfo: {
          studentId: '',

        },
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
        peopleShowIf: false,
        searchData: '',
        peopleInfo: {
          teacher_id: null
        },
        studentData: [],
        mainData: [],
        student: {
          total: 0,
          page: 1
        }
      }
    },
    methods: {
      //打开新增学生窗口
      openAddStudentDialog() {
        if ( + this.clickClass.is_open === 1) {
          util.$alert('公开课不需要添加学生');
          return;
        }
        this.getAllStudent();
        this.addStudentDialog = true;

      },
      studentChange() {
      },
      /**
       * 搜索课程
       */
      search() {
        this.listQuery.page = 1;
        this.getClassList(1);
      },
      handleClose() {
        this.peopleShowIf = false;
      },

      /**
       * 获取所有学生
       */
      getAllStudent() {
        util.$ajax({
          url: '/api/admin/student/getAllStudent',
          data: {
            status: 1
          }
        }, res => {
          this.studentDataArr = res.data;
          if (this.studentDataArr && +this.studentDataArr.length > 0
            && this.studentData && +this.studentData.length > 0) {
            this.studentDataArr.map(i => {
              this.studentData.map(h => {
                if (+i.uid === +h.uid) {
                  i.disabled = true;
                }
              });
            });
          }
        });
      },
      /**
       * 获取这个课程学习的学生
       */
      getStudentData (_id) {
        util.$ajax({
          url: '/api/admin/class/getClassStudent',
          data: {
            class_id: _id,
            page: this.student.page
          }
        }, res => {
          this.studentData = res.data;
          this.student.total = res.total;

        });
      },
      /**
       * 查看作业
       */
      lookHomeWork(_row) {

      },
      /**
       * 删除课程
       */
      deleteClass(_row) {
        const _class_id = _row.class_id;
        this.$confirm(`是否删除 '${_row.class_name}' 此课程?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          util.$ajax({
            url: '/api/admin/class/deleteClass',
            type: 'post',
            data: {
              class_id: _class_id
            }
          }, res => {
            util.$success('操作成功');
            this.listQuery.page = 1;
            this.getClassList();
          });
        }).catch(() => {

        });
      },
      /**
       * 展示课程详情
       */
      peopleManage(_row) {
        this.peopleInfo.teacher_id = _row.teacher_id;
        this.peopleShowIf = true;
        //缓存这个点击的课程的id
        this.clickClassId = _row.class_id;
        this.clickClass = _row;
        //获取这个课程学习的学生
        this.getStudentData(_row.class_id);

      },
      getClassList(_num) {
        util.$ajax({
          url: '/api/admin/class/getAllClass',
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
      /**
       * 删除这个课程的这个学生
       */
      deleteStudent(_item) {
        this.$confirm(`是否让' ${_item.name}' 同学放弃学习此课程?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          util.$ajax({
            url: '/api/admin/class/changeClassUserRelation',
            data: {
              student_id: _item.uid,
              type: 2,
              class_id: this.clickClassId
            }
          }, res => {
            util.$success('操作成功');
            this.student.page = 1;
            this.getStudentData(this.clickClassId);
          });
        }).catch(() => {

        });
      },
      lastSubmit() {
        this.peopleShowIf = false;
      },
      /**
       * 提交
       */
      submit() {
        this.$refs['addInfo'].validate(valid => {
          if (valid) {
            util.$ajax({
              url: '/api/admin/class/changeClassUserRelation',
              data: {
                student_id: this.addInfo.studentId,
                type: 1,
                class_id: this.clickClassId
              }
            }, res => {
              util.$success('操作成功');
              this.addInfo.studentId = '';
              this.addStudentDialog = false;
              this.student.page = 1;
              this.getStudentData(this.clickClassId);
            });
          } else {
            return false
          }
        });
      },
      handleCurrentChange(_val) {
        this.listQuery.page = _val;
        this.getClassList();
      },
      studentChange(_val) {
        this.student.page = _val;
        this.getStudentData(this.clickClassId);
      }
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

  .pagination-container {
    margin-top: 20px;
  }
</style>
