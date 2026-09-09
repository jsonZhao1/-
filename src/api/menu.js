import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: 'http://192.168.1.200:8090/getRouters',
    method: 'get'
  })
}
