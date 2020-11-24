/**
 * 广告相关接口
 */
import request from '@/utils/request.ts'

export const getAdList = () => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdList'
  })
}

export const saveOrUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/front/ad/saveOrUpdate',
    data
  })
}

export const updateStatus = (params: any) => {
  return request({
    method: 'GET',
    url: '/front/ad/updateStatus',
    params
  })
}

export const getAdById = (id: any) => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdById',
    params: {
      id
    }
  })
}

export const saveOrUpdateAd = (data: any) => {
  return request({
    method: 'POST',
    url: '/front/ad/saveOrUpdate',
    data
  })
}
