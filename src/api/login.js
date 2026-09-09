import request from '@/utils/request'

// 登录方法
export function login(data) {
  return request({
    url: 'http://192.168.1.200:8090/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: 'http://192.168.1.200:8090/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: 'http://192.168.1.200:8090/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: 'http://192.168.1.200:8090/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: 'http://192.168.1.200:8090/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 获取背景图
export function getBackUrl() {
  return request({
    url: 'http://192.168.1.200:8090/study/identifier/getBackUrl'
  })
}


//获取二维码信息
export function getQrCode() {
  return request({
    url: 'http://192.168.1.200:8090/loginQrCode',
    headers: {
      isToken: false
    },
    method: 'get',
  })
}

export function getLoginStatus(query) {
  return request({
    url: 'http://192.168.1.200:8090/getLoginStatus',
    headers: {
      isToken: false
    },
    method: 'get',
    params: query
  })
}


// 游客登录方法
export function touristLogin() {
  return request({
    url: 'http://192.168.1.200:8090/touristLogin',
    headers: {
      isToken: false
    },
    method: 'post'
  })
}


//激活
export function projectActive(data) {
  return request({
    url: 'http://192.168.1.200:8090/projectActive',
    headers: {
      isToken: false
    },
    method: 'post',
    params: data
  })
}

//更新用户成绩(用户退出程序时调用此接口)
export function updateResult(data) {
  return request({
    url: 'http://192.168.1.200:8090/smart/userResult/updateResult',
    method: 'post',
    data
  })
}

export function userResult(data) {
  return request({
    url: 'http://192.168.1.200:8090/smart/userResult',
    method: 'post',
    data
  })
}

// 设备连接心跳(每5秒调用一次)
export function deviceHeartBeat(data) {
  return request({
    url: 'http://192.168.1.200:8090/api/devicePlatform/deviceHeartBeat',
    method: 'post',
    params: data
  })
}
