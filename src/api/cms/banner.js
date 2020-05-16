import request from '@/utils/request'

const api_name = '/educms/bannerAdmin'

export default {

    getPageList(page, limit) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get'
        })
    },
    getById(id) {
        return request({
            url: `${api_name}/get/${id}`,
            method: 'get'
        })
    },

    save(banner) {
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data: banner
        })
    },

    updateById(banner) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data: banner
        })
    },
    removeById(id) {
        return request({
            url: `${api_name}/remove/${id}`,
            method: 'delete'
        })
    }
}
