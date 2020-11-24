<template>
  <div>
    <el-form ref="form" label-position="right" label-width="120px" v-model="role" >
      <el-form-item label="角色名称：">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码：">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 8}"
          v-model="role.description"
        ></el-input>
      </el-form-item>
      <el-button :disabled="isSubmitting" @click="$emit('cancel')">取 消</el-button>
      <el-button :disabled="isSubmitting" type="primary" @click="onSubmit">确 定</el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrEditRole, getRole } from '@/services/role'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'RoleCreateOrEdit',
  props: {
    roleId: {
      type: Number
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (this.isEdit) {
      console.log('这是编辑')
      this.loadRoleInfo()
    }
  },
  data () {
    return {
      role: {
        id: '',
        code: '',
        name: '',
        description: ''
      },
      isSubmitting: false
    }
  },

  methods: {
    async onSubmit () {
      this.isSubmitting = true
      const { data } = await createOrEditRole(this.role)
      if (data.code === '000000') {
        (this.$refs.form as Form).resetFields()
        if (!this.isEdit) {
          this.$message.success('添加角色成功')
        } else {
          this.$message.success('编辑角色成功')
        }
        this.$emit('success')
      }
      this.isSubmitting = false
    },

    async loadRoleInfo () {
      const { data } = await getRole(this.roleId)
      this.role = data.data
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
