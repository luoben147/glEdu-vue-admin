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
    }
}
