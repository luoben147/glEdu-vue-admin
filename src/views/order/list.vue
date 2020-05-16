<template>
  <div class="app-container">
    <!-- 订单列表数据-->
    <el-table :data="orderList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号" prop="orderNo"></el-table-column>
      <el-table-column label="订单价格" prop="totalFee" align="center" width="100px"></el-table-column>
      <el-table-column label="课程名称" prop="courseTitle"></el-table-column>
      <el-table-column label="讲师名称" prop="teacherName"></el-table-column>
      <el-table-column label="是否付款" prop="status" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==='1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="gmtCreate"></el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="show(scope.row.orderNo)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页区-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="padding: 30px 0; text-align: center;"
    ></el-pagination>
  </div>
</template>

<script>
import orderApi from "@/api/order/order";

export default {
  data() {
    return {
      page: 1, //当前页
      limit: 10, //每页记录数
      orderList: [], //接口返回的数据
      total: 0 //总记录数
    };
  },
  created(){
      this.getOrderList()
  },
  methods: {
    getOrderList() {
      orderApi.getPageList(this.page, this.limit).then(res => {
        this.orderList = res.data.items;
        this.total = res.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.limit = newSize;
      this.page = 1;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.getOrderList();
    }
  }
};
</script>