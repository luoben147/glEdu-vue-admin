<template>
  <div class="app-container">
    <el-button type="primary" @click="addDialogVisible=true">添加轮播图</el-button>
    <!-- banner列表数据-->
    <el-table :data="bannerList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="图片地址" prop="imageUrl"></el-table-column>
      <el-table-column label="链接地址" prop="linkUrl"></el-table-column>
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editBanner(scope.row.id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeBanner(scope.row.id)"
          >删除</el-button>
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

    <!--添加banner的对话框-->
    <el-dialog
      :title="this.bannerObj.id===-1? '添加用户':'修改用户'"
      :visible.sync="addDialogVisible"
      width="50%"
      @closed="addDialogClosed"
    >
      <!--内容主体区-->
      <el-form :model="bannerObj" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="bannerObj.title"></el-input>
        </el-form-item>
        <el-form-item label="轮播图">
          <el-upload
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :action="BASE_API+'/eduoss/fileoss'"
            class="banner-upload"
          >
            <img v-if="bannerObj.imageUrl" :src="bannerObj.imageUrl" class="bannerImg" />
            <i v-else class="el-icon-plus banner-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接地址" prop="linkUrl">
          <el-input v-model="bannerObj.linkUrl"></el-input>
        </el-form-item>
        <el-form-item label="讲师排序">
          <el-input-number v-model="bannerObj.sort" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>

      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBanner">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bannerApi from "@/api/cms/banner";

export default {
  data() {
    return {
      bannerObj: {
        id: -1,
        title: "",
        imageUrl: "",
        linkUrl: "",
        sort: ""
      },
      page: 1, //当前页
      limit: 10, //每页记录数
      bannerList: [], //接口返回的数据
      total: 0, //总记录数
      addDialogVisible: false, //控制添加用户对话框的显示与隐藏
      //添加表单验证规则对象
      addFormRules: {
        title: [
          //trigger 表示是什么事件触发
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~10字符之间",
            trigger: "blur"
          }
        ],
        imageUrl: [{ required: true, message: "请上传图片", trigger: "blur" }],
        linkUrl: [
          { required: true, message: "请填写链接地址", trigger: "blur" }
        ]
      },
      BASE_API: process.env.BASE_API
    };
  },
  created() {
    this.getBannerList();
  },
  methods: {
    getBannerList() {
      bannerApi.getPageList(this.page, this.limit).then(res => {
        this.bannerList = res.data.items;
        this.total = res.data.total;
      });
    },
    editBanner(id) {
      bannerApi.getById(id).then(res => {
        this.bannerObj = res.data.item;
        this.addDialogVisible = true;
      });
    },
    saveBanner() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //发起添加用户的网络请求
        if (this.bannerObj.id === -1) {
            bannerApi.save(this.bannerObj).then(res=>{
                 this.$message({
                    type: "success",
                    message: "添加成功!"
                 });
                 //隐藏添加用户的对话框
                this.addDialogVisible = false;
                //重新获取用户列表
                this.getBannerList();
            })
        } else {
          //修改
          bannerApi.updateById(this.bannerObj).then(res => {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              //隐藏添加用户的对话框
              this.addDialogVisible = false;
              //重新获取用户列表
              this.getBannerList();
            });
        }
      });
    },
    removeBanner(id) {
      this.$confirm("此操作将永久删除该轮播图, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        bannerApi.removeById(id).then(res => {
          //提示信息
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          //回到列表页面
          this.getBannerList();
        });
      }); //点击取消，执行catch方法
    },
    handleSizeChange(newSize) {
      this.limit = newSize;
      this.page = 1;
      this.getBannerList();
    },
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.getBannerList();
    },
    //封面上传成功
    handleSuccess(res, file, fileList) {
      //console.log(res); // 上传响应
      //console.log(URL.createObjectURL(file.raw)); // base64编码
      this.bannerObj.imageUrl = res.data.url;
    },
    //封面上传之前
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.resetAddFrom();
    },
    resetAddFrom() {
        this.bannerObj={
            id:-1,
            title:"",
            imageUrl:"",
            linkUrl:"",
            sort:0
        }
    }
  }
};
</script>
<style >
.banner-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.banner-uploader .el-upload:hover {
  border-color: #409eff;
}
.banner-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.bannerImg {
  width: 178px;
  height: 178px;
  display: block;
}
</style>