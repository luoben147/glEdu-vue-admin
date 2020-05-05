<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button type="text" @click="dialogChapterFormVisible=true">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button style type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form
        :model="chapterForm"
        :rules="chapterFormRules"
        ref="chapterFormRef"
        label-width="120px"
      >
        <el-form-item label="章节标题" prop="title">
          <el-input v-model="chapterForm.title" />
        </el-form-item>
        <el-form-item label="章节排序" prop="sort">
          <el-input-number v-model="chapterForm.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="videoForm" :rules="videoFormRules" ref="videoFormRef" label-width="120px">
        <el-form-item label="课时标题" prop="title">
          <el-input v-model="videoForm.title" />
        </el-form-item>
        <el-form-item label="课时排序" prop="sort">
          <el-input-number v-model="videoForm.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费" prop="isFree">
          <el-radio-group v-model="videoForm.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadALiyVideo'"
            :limit="1"  
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";

export default {
  data() {
    return {
      saveBtnDisabled: false, //下一步按钮是否禁用
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogChapterFormVisible: false, //章节弹框
      dialogVideoFormVisible: false, //小节弹框
      courseId: "", //课程id
      chapterId: "", // 课时所在的章节id
      chapterList: [],
      chapterForm: {
        //封装章节数据
        title: "",
        sort: 0
      },
      videoForm: {
        // 课时对象
        title: "",
        sort: 0,
        isFree: false,
        videoSourceId: "",
        videoOriginalName:""  //视频名称
      },
      chapterFormRules: {
        //章节验证规则对象
        title: [{ required: true, message: "请填写章节标题", trigger: "blur" }],
        sort: [{ required: true, message: "请填写章节排序", trigger: "blur" }]
      },
      videoFormRules: {
        //课时验证规则
        title: [{ required: true, message: "请填写课时标题", trigger: "blur" }],
        sort: [{ required: true, message: "请填写课时排序", trigger: "blur" }],
        isFree: [{ required: true, message: "请选择是否收费", trigger: "blur" }]
      },
      fileList:[],//上传文件列表
      BASE_API:process.env.BASE_API //接口地址   
    };
  },
  created() {
    //获取路由中的courseId
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getChapterVideo();
    }
  },
  methods: {
    //上传视频成功
    handleVodUploadSuccess(response, file, fileList){
      this.videoForm.videoSourceId = response.data.videoId
      this.videoForm.videoOriginalName=file.name
    },
    //文件超出个数限制时的钩子
    handleUploadExceed(files, fileList){
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    //文件列表移除文件时的钩子
    handleVodRemove(file, fileList){
        //调用后台接口删除视频
        video.removeAliyVod(this.videoForm.videoSourceId).then(res=>{
            this.$message({
              type: 'success',
              message: res.message
            })
            //文件列表清空
            this.fileList=[]  
            this.videoForm.videoSourceId=""
            this.videoForm.videoOriginalName = ''
        })
    },
    //删除文件之前的钩子 ，若返回 false 或者返回 Promise 且被 reject，则停止删除
    beforeVodRemove(file, fileList){
       return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //==============================小节相关================================
    //添加小节弹框
    openVideo(chapterId) {
      this.helpSaveVideo();
      this.dialogVideoFormVisible = true;
      //设置章节Id
      this.chapterId = chapterId;
    },
    saveOrUpdateVideo() {
      this.$refs.videoFormRef.validate(valid => {
        if (!valid) return;

        this.saveVideoBtnDisabled = true;
        if (!this.videoForm.id) {
          this.saveDataVideo();
        } else {
          this.updateDataVideo();
        }
      });
    },
    //新增课时
    saveDataVideo() {
      //设置课程Id
      this.videoForm.courseId = this.courseId;
      //设置章节Id
      this.videoForm.chapterId = this.chapterId;
      video.addVideo(this.videoForm).then(response => {
        this.$message({
          type: "success",
          message: "保存课时成功!"
        });
        this.helpSaveVideo();
      });
    },
    //小节的编辑按钮
    editVideo(videoId) {
      this.dialogVideoFormVisible = true;
      video.getById(videoId).then(response => {
        this.videoForm = response.data.item;
        this.fileList = [{'name': this.videoForm.videoOriginalName}]
      });
    },
    //修改课时提交
    updateDataVideo() {
      video.updateById(this.videoForm).then(response => {
        this.$message({
          type: "success",
          message: "修改课时成功!"
        });
        this.helpSaveVideo();
      });
    },
    //小节删除按钮
    removeVideo(videoId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return video.removeById(videoId);
        })
        .then(() => {
          this.getChapterVideo(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除课时成功!"
          });
        },err =>{
          console.log('err',err);
        });
    },
    //重置小节From
    helpSaveVideo() {
      this.dialogVideoFormVisible = false // 如果保存成功则关闭对话框
      this.getChapterVideo() // 刷新列表
      this.videoForm = {
        title: "",
        sort: 0,
        isFree: false,
        videoSourceId: "",
        videoOriginalName : ""
      };
      this.fileList=[]
      this.saveVideoBtnDisabled = false
    },
    //==============================章节相关================================
    //编辑章节按钮
    editChapter(chapterId) {
      this.dialogChapterFormVisible = true;
      chapter.getById(chapterId).then(response => {
        this.chapterForm = response.data.item;
      });
    },
    //删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return chapter.removeById(chapterId);
        })
        .then(() => {
          this.getChapterVideo(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
    },
    //保存章节
    saveOrUpdate() {
      this.$refs.chapterFormRef.validate(valid => {
        if (!valid) return;

        this.saveBtnDisabled = true;
        if (!this.chapterForm.id) {
          this.saveData();
        } else {
          this.updateData();
        }
      });
    },
    //提交新增
    saveData() {
      this.chapterForm.courseId = this.courseId;
      chapter.addChapter(this.chapterForm).then(res => {
        this.$message({
          type: "success",
          message: "添加章节成功!"
        });
        this.helpSave();
      });
    },
    //提交更新
    updateData() {
      chapter.updateById(this.chapterForm).then(response => {
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.helpSave();
      });
    },
    //重置表单
    helpSave() {
      this.dialogChapterFormVisible = false; // 如果保存成功则关闭对话框
      this.getChapterVideo(); // 刷新列表
      this.chapterForm = {
        title: "",
        sort: 0
      };
      // this.chapterForm.title = ""; // 重置章节标题
      // this.chapterForm.sort = 0; // 重置章节排序
      this.saveBtnDisabled = false;
    },
    //根据课程ID查询章节和小节
    getChapterVideo() {
      chapter.getChapterVideo(this.courseId).then(res => {
        this.chapterList = res.data.items;
      });
    },
    previous() {
      this.$router.push({ path: "/course/info/" + this.courseId });
    },
    next() {
      this.$router.push({ path: "/course/publish/" + this.courseId });
    }
  }
};
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>