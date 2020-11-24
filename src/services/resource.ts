/**
 * 资源相关接口
 */
import request from '@/utils/request.ts'

export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

export const saveOrUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

export const deleteResource = (id: any) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}
