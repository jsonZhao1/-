import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'http://192.168.1.200:8090/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
