import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/yyh";

// 查询考试分数列表
export function listScore(query) {
  return request({
    url: 'http://192.168.1.200:8090/study/score/list',
    method: 'get',
    params: query
  })
}
