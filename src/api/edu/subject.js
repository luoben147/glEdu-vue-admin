import request from '@/utils/request'

const api_name='eduservice/subject';

export default{
    //条件查询讲师列表
    getAllSubject(){
        return request({
            url:`/${api_name}/getAllSubject`,
            method: 'get',
        })
    },
   
}
