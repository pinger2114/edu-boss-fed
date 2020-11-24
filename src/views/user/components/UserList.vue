<template>
  <div class="user-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" label-width="80px">
           <el-form-item label="手机号">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              @change="dateChange"
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-button @click="resetForm" :disabled="isLoading">重置</el-button>
        <el-button @click="onSubmit" :disabled="isLoading" type="primary">查询</el-button>
      </div>
      <div class="text item">
        <el-table
          :data="users"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="用户ID"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="date"
            label="头像"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户名"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="注册时间"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            min-width="100">
            <template slot-scope="scope">
              <div class="cell">
                <i title="正常" class="status" :class="scope.row.status === 'DISABLE' ? 'status-danger' : 'status-success'"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            min-width="180">
            <template slot-scope="scope1">
              <el-button type="text" size="mini">禁用</el-button>
              <el-button type="text" @click="handleSelectRole(scope1.row)" size="mini">分配角色</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :disabled="isLoading"
          :current-page.sync="form.currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible"
        width="30%">
          <el-select v-model="roleIdList" multiple placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleAllocRole()">确 定</el-button>
          </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'
import dayjs from 'dayjs'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      form: {
        phone: '',
        currentPage: 1,
        pageSize: 5,
        startCreateTime: null,
        endCreateTime: null
      },
      value1: [],
      users: [],
      isLoading: false,
      totalCount: 0,
      dialogVisible: false,
      roleIdList: [],
      roles: [],
      currentUser: null
    }
  },

  created () {
    this.loadUsers()
  },

  methods: {
    async handleSelectRole (role: any) {
      this.currentUser = role
      this.dialogVisible = true
      const { data } = await getAllRoles()
      this.roles = data.data
      const { data: { data: userRoles } } = await getUserRoles((this.currentUser as any).id)
      console.log(userRoles)
      this.roleIdList = userRoles.map((item: any) => item.id)
    },

    dateChange () {
      if (this.value1) {
        this.form.startCreateTime = this.value1[0]
        this.form.endCreateTime = this.value1[1]
      } else {
        this.form.startCreateTime = null
        this.form.endCreateTime = null
      }
    },

    onSubmit () {
      this.form.currentPage = 1
      this.loadUsers()
    },

    resetForm () {
      (this.$refs.form as Form).resetFields()
      this.form.currentPage = 1
      this.loadUsers()
    },

    async loadUsers () {
      this.isLoading = true
      const { data } = await getUserPages(this.form)
      this.users = data.data.records
      this.users.forEach((item: any) => {
        item.createTime = dayjs(item.createTime).format('YYYY-MM-DD hh:mm')
      })
      this.isLoading = false
      this.totalCount = data.data.total
    },

    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1
      this.loadUsers()
    },
    handleCurrentChange (val: number) {
      this.form.currentPage = val
      this.loadUsers()
    },

    async handleAllocRole () {
      const { data } = await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('分配成功')
        this.dialogVisible = false
      }
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
