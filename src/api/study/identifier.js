import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/yyh";

// 查询安全标识列表
export function listIdentifier(classId) {
  return request({
    url: 'http://192.168.1.200:8090/study/identifier/list?classId='+classId,
    method: 'get'
  })
}

// 查询安全标识详细
export function getIdentifier(id) {
  return request({
    url: 'http://192.168.1.200:8090/study/identifier/' + parseStrEmpty(id),
    method: 'get'
  })
}


// 查询标识分类下拉树结构
export function idenClassTreeSelect() {
  return request({
    url: 'http://192.168.1.200:8090/study/identifierClass/tree',
    method: 'get'
  })
}

