/**
 * 资源类别相关接口
 */
import request from '@/utils/request.ts'

export const getResourceCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

export const getAllCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

export const saveOrderUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}

export const deleteCategory = (id: any) => {
  return request({
    method: 'POST',
    url: `/boss/resource/category/${id}`
  })
}
