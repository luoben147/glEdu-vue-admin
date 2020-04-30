import request from '@/utils/request'

const api_name='eduservice/course';

export default{
    //条件查询讲师列表
    addCourseInfo(courseInfo){
        return request({
            url:`/${api_name}/addCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //查询所有讲师
    getTeacherList(){
        return request({
            url:`/eduservice/teacher/findAll`,
            method: 'get'
        })
    },
    //根据课程id查询课程基本信息
    getCourseInfoById(id){
        return request({
            url:`/${api_name}/getCourseInfo/${id}`,
            method: 'get'
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfo){
        return request({
            url:`/${api_name}/updateCourseInfo/${courseInfo.id}`,
            method: 'put',
            data: courseInfo
        })
    },
    //根据ID获取课程发布信息
    getCoursePublishInfoById(id){
        return request({
            url:`/${api_name}/coursePublishInfo/${id}`,
            method: 'get',
        })
    },
    //发布课程
    publishCourse(id){
        return request({
            url:`/${api_name}/publishCourse/${id}`,
            method: 'put',
        })
    },
    //查询所有课程
    pageQuery(page,limit,courseQuery){
        return request({
            url:`/${api_name}/${page}/${limit}`,
            method: 'get',
            params:courseQuery
        })
    },
    //删除课程
    removeCourseById(id){
        return request({
            url:`/${api_name}/${id}`,
            method: 'delete'
        })
    }
}
