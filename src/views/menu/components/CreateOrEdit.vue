<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单'}}</span>
      </div>
      <el-form
        :rules="rules"
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item prop="name" label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option label="无上级菜单" :value="-1"></el-option>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in parentMenuList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number type="textarea" :min="1" v-model="form.orderNum"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { createOrUpdateMenu, getEditMenuInfo } from '@/services/menu.ts'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'MenuCreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: '-1',
        name: 'cjp-1',
        href: '321',
        icon: '31231',
        orderNum: 0,
        description: '123123',
        shown: false
      },
      rules: {
        name: [
          { required: true, message: '请输入表单名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入表单路径', trigger: 'blur' }
        ]
      },
      parentMenuList: []
    }
  },

  created () {
    this.loadParentInfo()
  },

  methods: {
    async loadParentInfo () {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1)
      if (this.isEdit && data.code === '000000') {
        this.form = data.data.menuInfo
      }
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
      }
    },
    async onSubmit () {
      // 1.验证表单
      await (this.$refs.form as Form).validate()
      // 2.提交表单
      const { data } = await createOrUpdateMenu(this.form)
      if (data.code === '000000') {
        if (this.isEdit) {
          this.$message.success('编辑菜单成功')
        } else {
          this.$message.success('添加菜单成功')
        }
        this.$router.back()
      }
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
