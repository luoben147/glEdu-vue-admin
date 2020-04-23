<template>
  <div>
    <el-card>
      <!-- 查询条件区 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="teacherQuery.name" placeholder="讲师名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
            <el-option label="高级讲师" :value="1"></el-option>
            <el-option label="首席讲师" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="teacherQuery.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="teacherQuery.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
          <el-button type="default" @click="resetData()">清空</el-button>
        </el-form-item>
      </el-form>

      <!--列表区  -->
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="姓名" width="80"></el-table-column>
        <el-table-column label="头衔" width="80">
          <template slot-scope="scope">{{scope.row.level === 1 ? '高级讲师':'首席讲师' }}</template>
        </el-table-column>
        <el-table-column prop="intro" label="简介"></el-table-column>
        <el-table-column prop="gmtCreate" label="添加时间" width="160"></el-table-column>
        <el-table-column prop="sort" label="排序" width="60"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/teacher/edit/'+scope.row.id">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            </router-link>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="padding: 30px 0; text-align: center;"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import teacher from "@/api/edu/teacher";

export default {
  data() {
    return {
      page: 1, //当前页
      limit: 10, //每页记录数
      teacherQuery: {}, //查询条件对象
      list: [], //接口返回的数据
      total: 0 //总记录数
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      teacher
        .getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then(res => {
          //console.log(res);
          this.list = res.data.rows;
          this.total = res.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //监听 limit 改变的事件
    handleSizeChange(newSize) {
      //console.log(`每页 ${newSize} 条`);
      this.limit = newSize;
      this.page = 1;
      this.getList();
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(`当前页: ${newPage}`);
      this.page = newPage;
      this.getList();
    },
    resetData() {
      //清空的方法
      //表单输入项数据清空
      this.teacherQuery = {};
      //查询所有讲师数据
      this.getList();
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除讲师记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        teacher.deleteTeacher(id).then(res => {
          //提示信息
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          //回到列表页面
          this.getList();
        });
      }); //点击取消，执行catch方法
    }
  }
};
</script>

<style scoped>
</style>