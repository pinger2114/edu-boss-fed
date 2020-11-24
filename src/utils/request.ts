import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

let isRefreshing = false // 控制一次只有一个请求刷新 token
let requests: any[] = [] // 储存请求
// 相应拦截器
request.interceptors.response.use(function (response) { // 请求成功并且返回状态码为2XX 会进入这里处理
  // 如果是自定义错误，错误处理写到这里
  return response
}, function (error) { // 请求失败且状态码超出2XX都会进入这里
  // http 错误状态码，错误处理就写到这里
  if (error.response) { // 请求发出去后收到响应但是状态码超出2XX
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误！')
    } else if (status === 401) {
      // token 无效 （没有提供 token、token 是无效的、 token 过期了）
      // 如果有 refresh_token ，则尝试使用 refresh_token 重新获取 token
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true
        refreshToken().then(res => {
          if (!res.data.success) {
            throw Error('刷新 Token 失败')
          }

          // 刷新 token 成功
          store.commit('setUser', res.data.content)
          requests.forEach(cb => cb())
          requests = []
          return request(error.config)
        }).catch(() => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false // 重置刷新状态
        })
      }

      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员！')
    } else if (status === 404) {
      Message.error('访问的资源不存在！')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去后没有收到响应
  } else { // 在设置请求时触发了一些错误
  }
  // 将请求失败后的对象抛出给上一个调用者
  return Promise.reject(error)
})

export default request
