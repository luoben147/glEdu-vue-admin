import request from '@/utils/request'

const api_name = 'eduservice/chapter';

export default {

    //根据课程Id获取课程章节和小节数据列表
    getChapterVideo(courseId) {
        return request({
            url: `/${api_name}/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },
    //添加章节
    addChapter(chapter) {
        return request({
            url: `/${api_name}`,
            method: 'post',
            data: chapter
        })
    },
    //查询章节
    getById(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'get'
        })
    },
    //修改章节
    updateById(chapter) {
        return request({
            url: `${api_name}/${chapter.id}`,
            method: 'put',
            data: chapter
        })
    },
    //删除章节
    removeById(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'delete'
        })
    },
}
