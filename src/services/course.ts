/**
 * 课程相关接口
 */
import request from '@/utils/request.ts'

export const getQueryCourses = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

export const changeState = (params: any) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

export const saveOrUpdateCourse = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

export const uploadCourseImage = (data: any, onUploadProgress?: (progressEvent: any) => void) => {
  // 该接口要求的请求数据类型是：multipart/form-data
  // 所以要提交 FormData 数据对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    onUploadProgress
  })
}

export const getCourseById = (courseId: number | string) => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
