import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null')
  },
  mutations: {
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 把用户登录信息存储在本地存储中，刷新页面后不会导致登录状态丢失
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
