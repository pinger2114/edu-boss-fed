<template>
  <div class="login">
    <!--
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      el-form-item 绑定 prop 属性
    -->
    <el-form
      class="login-form"
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item prop="phone" label="手机号">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
        class="login-btn"
        type="primary"
        @click="onSubmit"
        :loading='isLoginLoading'
      >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/services/user.ts'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度需在6到18位之间', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 1.校验表单
        await (this.$refs.form as Form).validate()
        // 2.验证通过 => 提交表单
        this.isLoginLoading = true

        const { data } = await login(this.form)
        // const { data } = await request({
        //   method: 'POST',
        //   url: '/front/user/login',
        //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //   data: qs.stringify(this.form)
        // })

        // 3.处理请求结果
        // 失败：给出提示
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          // 1、记录登录状态并存储到 Vuex 中
          this.$store.commit('setUser', data.content)
          // 2、在访问需要登录后才能看到的页面时，判断有没有登录状态（路由拦截器）
          // 成功：跳转到首页
          this.$router.push(this.$route.query.redirect as string || '/course')
          // this.$router.push({
          //   name: 'home'
          // })
          this.$message.success('登录成功')
        }
      } catch (err) {
        console.log('登录失败', err)
      }

      // 结束登录按钮的 loading
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-form {
    width: 300px;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
