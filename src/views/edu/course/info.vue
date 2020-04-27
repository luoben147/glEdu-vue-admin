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
        <tinymce :height="300" v-model="courseInfo.description" />
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
      teacherList: [], //讲师集合
      subjectList: [], //一级分类（它的children属性 就是二级分类）
      subjectValue: [], //课程分类选中的值 包含一级分类和二级分类
      subjectProp: {
        value: "id",
        label: "title",
        children: "children",
        expandTrigger: 'hover'
      }
    };
  },
  created() {
    this.getTeacherList();
    this.getOneSubject();
  },
  methods: {
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
    //保存课程信息 跳转下一步
    saveAndNext() {
      course.addCourseInfo(this.courseInfo).then(res => {
        this.$message({
          type: "success",
          message: "添加课程信息成功"
        });

        //跳转到第二步
        this.$router.push({ path: "/course/chapter/" + res.data.courseId });
      });
    },
    //课程分类级联选择回调
    handleSubjecChange(value) {
      console.log(value);
      if(value.length>0){
        this.courseInfo.subjectParentId=value[0]
        this.courseInfo.subjectId=value[1]
      }
    },
    //封面上传成功
    handleCoverSuccess(res, file, fileList) {
      console.log(res); // 上传响应
      console.log(URL.createObjectURL(file.raw)); // base64编码
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