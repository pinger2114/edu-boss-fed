/**
 * 角色相关接口
 */
import request from '@/utils/request.ts'

export const getRolePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

export const createOrEditRole = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

export const deleteRole = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

export const getRole = (id: number) => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

export const allocateUserRoles = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

export const getUserRoles = (userId: number | string) => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
