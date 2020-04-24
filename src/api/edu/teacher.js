import request from '@/utils/request'

const api_name='eduservice/teacher';

export default{
    //条件查询讲师列表
    getTeacherListPage(page,limit,queryInfo){
        return request({
            url:`/${api_name}/pageTeacherCondition`,
            method: 'post',
            params:{    //路径参数
                page,   
                limit
            },
            //请求体body 参数   把对象转换为json进行传递到接口
            data:  queryInfo   
        })
    },
    //删除讲师
    deleteTeacher(id){
        return request({
            url:`/${api_name}/${id}`,
            method: 'delete',
        })
    
    },
    //添加讲师
    addTeacher(teacher){
        return request({
            url:`/${api_name}`,
            method: 'post',
            data:teacher
        })
    },
    //根据id获取讲师信息
    getTeacher(id){
        return request({
            url:`/${api_name}/${id}`,
            method: 'get',
        })
    },
    //修改讲师
    updateTeacher(teacher){
        return request({
            url:`/${api_name}/${teacher.id}`,
            method: 'put',
            data:teacher
        })
    }
}
