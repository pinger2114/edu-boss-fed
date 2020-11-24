/**
 * 课程章节相关接口
 */
import request from '@/utils/request.ts'

// /boss/course/section/getSectionAndLesson
export const getSectionAndLesson = (courseId: number | string) => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// /boss/course/section/saveOrUpdateSection
export const saveOrUpdateSection = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}
