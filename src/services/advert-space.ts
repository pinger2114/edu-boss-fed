/**
 * 广告位相关接口
 */
import request from '@/utils/request.ts'

export const getAllSpaces = () => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getAllSpaces'
  })
}

export const saveOrUpdateSpace = (data: any) => {
  return request({
    method: 'POST',
    url: '/front/ad/space/saveOrUpdate',
    data
  })
}

export const getSpaceById = (id: any) => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getSpaceById',
    params: {
      id
    }
  })
}
