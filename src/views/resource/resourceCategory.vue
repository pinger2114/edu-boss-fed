<template>
  <div class="resource-category">
    <el-card>
      <div slot="header">
        <el-button @click="isCreateOrEditcategory = true">添加</el-button>
      </div>
      <el-table
        :data="categories"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEditCategory(scope.row)" type="text">编辑</el-button>
            <el-button @click="deleteCategory(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="isEdit ? '编辑类别' : '创建类别'"
      :visible.sync="isCreateOrEditcategory"
      width="30%">
      <el-form ref="category" v-model="category" label-position="right" label-width="70px">
        <el-form-item label="类别名称">
          <el-input v-model="category.name"></el-input>
        </el-form-item>
        <el-form-item label="类别排序">
          <el-input v-model="category.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCreateCategory">取 消</el-button>
        <el-button type="primary" @click="handleCreateOrEditCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllCategories, saveOrderUpdate, deleteCategory } from '@/services/resource-category'
import dayjs from 'dayjs'

export default Vue.extend({
  name: 'ResourceCategory',
  data () {
    return {
      categories: [],
      isCreateOrEditcategory: false,
      category: {
        id: null,
        name: '',
        sort: ''
      },
      isEdit: false
    }
  },
  created () {
    this.loadCategories()
  },
  methods: {
    async loadCategories () {
      const { data } = await getAllCategories()
      this.categories = data.data
      this.categories.forEach((item: any) => {
        item.createdTime = dayjs(item.createdTime).format('YYYY-MM-DD')
      })
    },
    async handleCreateOrEditCategory () {
      this.isCreateOrEditcategory = true
      const { data } = await saveOrderUpdate({
        id: this.category.id,
        name: this.category.name,
        sort: this.category.sort
      })
      if (data.code === '000000') {
        this.$message.success('操作成功')
        this.isCreateOrEditcategory = false
        this.resetCategory()
        this.loadCategories()
      }
    },
    resetCategory () {
      this.category = {
        id: null,
        name: '',
        sort: ''
      }
    },
    handleEditCategory (row: any) {
      this.isEdit = true
      this.isCreateOrEditcategory = true
      this.category.id = row.id
      this.category.name = row.name
      this.category.sort = row.sort
    },
    async deleteCategory (row: any) {
      const { data } = await deleteCategory(row.id)
      if (data.code === '000000') {
        this.$message.success('操作成功')
      }
    },
    handleCancelCreateCategory () {
      this.resetCategory()
      this.isCreateOrEditcategory = false
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
