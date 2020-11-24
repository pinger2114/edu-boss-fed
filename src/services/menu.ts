/**
 * 菜单相关接口
 */
import request from '@/utils/request.ts'

export const createOrUpdateMenu = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

export const getEditMenuInfo = (id: number | string = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

export const getMenuNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}

export const allocateRoleMenus = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/menu/getMenuNodeList',
    data
  })
}

export const getRoleMenus = (roleId: number | string) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId
    }
  })
}
