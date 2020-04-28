<template>
  <div class="app-container">
    <h2 style="text-align:center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>
      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-cascader
          v-model="subjectValue"
          :options="subjectList"
          :props="subjectProp"
          @change="handleSubjecChange"
        ></el-cascader>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>
      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" ref="content" />
      </el-form-item>
      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-upload"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce";

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      saveBtnDisabled: false, //保存按钮是否禁用
      BASE_API: process.env.BASE_API,
      courseInfo: {
        title: "", //课程标题
        subjectId: "", //二级分类ID
        subjectParentId: "", //一级分类Id
        teacherId: "", //讲师ID
        lessonNum: 0, //总课时
        description: "", //课程简介
        cover: "/static/default.jpg", //课程封面图片路径(这里是oss里的默认图)
        price: 0 //课程价格
      },
      courseId: "",
      teacherList: [], //讲师集合
      subjectList: [], //一级分类（它的children属性 就是二级分类）
      subjectValue: [], //课程分类选中的值 包含一级分类和二级分类
      subjectProp: {
        value: "id",
        label: "title",
        children: "children",
        expandTrigger: "hover"
      }
    };
  },
  watch: {
    //监听
    $route(to, from) {
      //路由变化方式 当路由发生变化的时候执行
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        this.getInfo();
      } else {
        //清空
        this.courseInfo = {
          cover: "/static/default.jpg"
        };
        this.subjectValue = [];
        //清空编辑器
        this.$refs.content.setContent("");
      }
      //初始化所有讲师
      this.getTeacherList();
      //初始化课程分类
      this.getOneSubject();
    },
    //根据课程id 查询课程信息回显
    getInfo() {
      course.getCourseInfoById(this.courseId).then(res => {
        this.courseInfo = res.data.item;
        this.subjectValue.push(res.data.item.subjectParentId);
        this.subjectValue.push(res.data.item.subjectId);
      });
    },
    //查询所有一级分类
    getOneSubject() {
      subject.getAllSubject().then(res => {
        this.subjectList = res.data.list;
      });
    },
    //查询所有讲师
    getTeacherList() {
      course.getTeacherList().then(res => {
        this.teacherList = res.data.items;
      });
    },
    //添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo).then(res => {
        this.$message({
          type: "success",
          message: "添加课程信息成功"
        });

        //跳转到第二步
        this.$router.push({ path: "/course/chapter/" + res.data.courseId });
      });
    },
    //修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then(res => {
        //提示
        this.$message({
          type: "success",
          message: "修改课程信息成功!"
        });
        //跳转到第二步
        this.$router.push({ path: "/course/chapter/" + this.courseId });
      });
    },
    //保存课程信息 跳转下一步
    saveAndNext() {
      if (!this.courseInfo.id) {
        //添加
        this.addCourse();
      } else {
        this.updateCourse();
      }
    },
    //课程分类级联选择回调
    handleSubjecChange(value) {
      if (value.length > 0) {
        this.courseInfo.subjectParentId = value[0];
        this.courseInfo.subjectId = value[1];
      }
    },
    //封面上传成功
    handleCoverSuccess(res, file, fileList) {
      //console.log(res); // 上传响应
      //console.log(URL.createObjectURL(file.raw)); // base64编码
      this.courseInfo.cover = res.data.url;
    },
    //封面上传之前
    beforeCoverUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>


<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>