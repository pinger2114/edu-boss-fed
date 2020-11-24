<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
          <el-form-item prop="name" label="输入搜索">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="isLoading"
            >查询</el-button>
            <el-button
              :disabled="isLoading"
              @click="resetForm()"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="clearfix">
        <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
          <el-form-item>
            <el-button size="small" @click="createRole">添加角色</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="roles"
        v-loading="isLoading"
        border
        style="width: 100%; margin-bottom:20px;">
        <el-table-column
          type="index"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({
                name:'alloc-menu',
                params: {
                  roleId: scope.row.id
                }
              })"
            >分配菜单</el-button>
            <el-button type="text">分配资源</el-button>
            <br/>
            <el-button
              type="text"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
              :disabled="isDeleting"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="30%">
      <create-or-edit
        v-if="dialogVisible"
        :is-edit = "isEdit"
        :role-id = 'roleId'
        @success="onSuccess"
        @cancel="onCancel"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRolePages, deleteRole } from '@/services/role'
import dayjs from 'dayjs'
import { Form } from 'element-ui'
import createOrEdit from './CreateOrEdit.vue'

export default Vue.extend({
  name: 'RoleList',
  components: {
    createOrEdit
  },
  data () {
    return {
      roles: [],
      form: {
        name: '',
        url: '',
        categoryId: '',
        current: 1,
        size: 5
      },
      totalCount: 0,
      isLoading: false,
      dialogVisible: false,
      isDeleting: false,
      roleId: null,
      isEdit: false
    }
  },

  created () {
    this.loadResources()
  },

  methods: {
    async loadResources () {
      this.isLoading = true
      const { data } = await getRolePages(this.form)
      this.roles = data.data.records
      this.roles.forEach((item: any) => {
        item.createdTime = dayjs(item.createdTime).format('YYYY-MM-DD hh:mm')
      })
      this.totalCount = data.data.total
      this.isLoading = false
    },

    resetForm () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    },

    onSubmit () {
      this.form.current = 1

      this.loadResources()
    },

    handleEdit (item: any) {
      this.isEdit = true
      this.roleId = item.id
      this.dialogVisible = true
    },
    async handleDelete (item: any) {
      this.isDeleting = true
      try {
        const { data } = await deleteRole(item.id)
        if (data.code === '000000') {
          this.$message.success('删除成功！')
          this.loadResources()
        }
      } catch (error) {
        this.$message.error('删除失败！')
      }
      this.isDeleting = false
    },

    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val: number) {
      this.form.current = val
      this.loadResources()
    },
    createRole () {
      this.isEdit = false
      this.dialogVisible = true
    },

    onSuccess () {
      this.dialogVisible = false
      this.loadResources()
    },

    onCancel () {
      this.dialogVisible = false
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
