import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/yyh";

// 查询安全标识列表
export function listIdentifier(query) {
  return request({
    url: 'http://192.168.1.200:8090/study/identifier/examList',
    method: 'get',
    params: query
  })
}

// 更新分数排名
export function updateTotalRank(data) {
  return request({
    url: 'http://192.168.1.200:8090/study/score',
    method: 'put',
    data: data
  })
}

// 查询标识选项
export function idenExamination(identifierId, yourOptions) {
  return request({
    url: 'http://192.168.1.200:8090/study/score/examination?identifierId='+identifierId+'&yourOptions='+yourOptions,
    method: 'get'
  })
}

// 获取正确答案
export function getAnswers(data) {
  return request({
    url: 'http://192.168.1.200:8090/study/identifier/getAnswers',
    method: 'post',
    params: data
  })
}

export function selectorList(query) {
  return request({
    url: 'http://192.168.1.200:8090/study/question/optionList',
    method: 'get',
    params: query
  })
}
