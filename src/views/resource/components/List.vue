<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select
              v-model="form.categoryId"
              placeholder="请选择资源分类"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in resourceCategories"
                :key="item.id"
              ></el-option>
            </el-select>
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
      <div style="margin-bottom: 15px;">
        <el-button @click="isCreateOrEditResource = true">添加资源</el-button>
        <el-button @click="$router.push({
          name: 'resource-category'
        })">资源分类</el-button>
      </div>
      <el-table
        :data="resources"
        v-loading="isLoading"
        border
        style="width: 100%; margin-bottom:20px;">
        <el-table-column
          type="index"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
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
      :title="isEdit ? '编辑资源' : '创建资源'"
      :visible.sync="isCreateOrEditResource"
      width="30%">
      <el-form ref="resource" v-model="resource" label-position="right" label-width="70px">
        <el-form-item label="资源名称">
          <el-input v-model="resource.name"></el-input>
        </el-form-item>
        <el-form-item label="资源路径">
          <el-input v-model="resource.url"></el-input>
        </el-form-item>
        <el-form-item label="资源分类">
          <el-select
            v-model="resource.categoryId"
            placeholder="请选择资源分类"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in resourceCategories"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源描述">
          <el-input v-model="resource.description" :autosize="{ minRows: 4, maxRows: 8}" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCreateResource">取 消</el-button>
        <el-button type="primary" @click="handleCreateResource">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages, saveOrUpdate, deleteResource } from '@/services/resource'
import dayjs from 'dayjs'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [],
      form: {
        name: '',
        url: '',
        categoryId: '',
        current: 1,
        size: 5
      },
      isCreateOrEditResource: false,
      resource: {
        name: '',
        categoryId: '',
        url: '',
        description: ''
      },
      totalCount: 0,
      resourceCategories: [],
      isLoading: false,
      isEdit: false
    }
  },

  created () {
    this.loadResources()
    this.loadResourceCategories()
  },

  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },

    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.resources.forEach((item: any) => {
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

    handleEdit (row: any) {
      this.isEdit = true
      this.isCreateOrEditResource = true
      this.resource.name = row.name
      this.resource.categoryId = row.categoryId
      this.resource.url = row.url
      this.resource.description = row.description
    },
    async handleDelete (row: any) {
      const { data } = await deleteResource(row.id)
      console.log(data)
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
    async handleCreateResource () {
      const { data } = await saveOrUpdate(this.resource)
      if (data.code === '000000') {
        this.$message.success('添加资源成功')
        this.isCreateOrEditResource = false
        this.resetResource()
      }
    },
    handleCancelCreateResource () {
      this.resetResource()
      this.isCreateOrEditResource = false
    },
    resetResource () {
      this.resource.name = ''
      this.resource.categoryId = ''
      this.resource.url = ''
      this.resource.description = ''
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
