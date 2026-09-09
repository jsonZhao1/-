import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/yyh";

// 查询安全标识分类列表
export function listIdentifierClass(query) {
  return request({
    url: 'http://192.168.1.200:8090/study/identifierClass/list?enableFlag=1',
    method: 'get',
    params: query
  })
}

// 查询安全标识分类详细
export function getIdentifierClass(id) {
  return request({
    url: 'http://192.168.1.200:8090/study/identifierClass/' + parseStrEmpty(id),
    method: 'get'
  })
}

// 新增安全标识分类
export function addIdentifierClass(data) {
  return request({
    url: 'http://192.168.1.200:8090/study/identifierClass',
    method: 'post',
    data: data
  })
}

// 修改安全标识分类
export function updateIdentifierClass(data) {
  return request({
    url: 'http://192.168.1.200:8090/study/identifierClass',
    method: 'put',
    data: data
  })
}

// 删除安全标识分类
export function delIdentifierClass(id) {
  return request({
    url: 'http://192.168.1.200:8090/study/identifierClass/' + id,
    method: 'delete'
  })
}

// 更新标识分类启用状态
// export function updateIdentifierEnable(id, enableFlag)
