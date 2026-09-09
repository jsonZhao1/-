import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://192.168.1.200:8090/login',
    method: 'post',
    data
  })
}
export function getBackUrl() {
  return request({
    url: '192.168.1.200:8090/study/identifier/getBackUrl'
  })
}
export function getInfo(token) {
  return request({
    url: '192.168.1.200:8090/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '192.168.1.200:8090/vue-admin-template/user/logout',
    method: 'post'
  })
}
