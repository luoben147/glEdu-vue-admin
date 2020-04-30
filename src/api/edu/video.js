import request from '@/utils/request'

const api_name = 'eduservice/video';

export default {
   
    //添加小节
    addVideo(video) {
        return request({
            url: `/${api_name}/saveVideoInfo`,
            method: 'post',
            data: video
        })
    },
    //查询小节
    getById(id) {
        return request({
            url: `${api_name}/videoInfo/${id}`,
            method: 'get'
        })
    },
    //修改小节
    updateById(video) {
        return request({
            url: `${api_name}/updateVideoInfo/${video.id}`,
            method: 'put',
            data: video
        })
    },
    //删除小节
    removeById(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'delete'
        })
    },
    //删除视频
    removeAliyVod(id){
        return request({
            url: `/eduvod/video/${id}`,
            method: 'delete'
        })
    }
}
