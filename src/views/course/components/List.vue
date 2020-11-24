<template>
  <div class="course-list">
    <el-card>
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="课程名称">
            <el-input v-model="form.courseName" placeholder="课程名称"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-button
            style="float: right;"
            type="primary"
            @click="$router.push({name: 'course-create'})"
          >添加课程</el-button>
        </el-form>
      </div>
      <el-table
        :data="courses"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          min-width="20">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value = "1"
              :inactive-value = "0"
              @change="changeCourseStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="140"
        >
          <template slot-scope="scope">
            <el-button @click="$router.push({
              name: 'course-edit',
              params: {
                courseId: scope.row.id
              }
            })" size="mini">编辑</el-button>
            <el-button
              size="mini"
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id,
                  courseName: scope.row.courseName
                }
              })"
            >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page.sync="form.currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getQueryCourses, changeState, saveOrUpdateCourse } from '@/services/course'

export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      form: {
        courseName: '',
        status: '',
        currentPage: 1,
        pageSize: 5
      },
      courses: [],
      totalCount: 0,
      isLoading: false
    }
  },
  created () {
    this.loadCourses()
  },

  methods: {
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.form)
      this.courses = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },

    onSubmit () {
      this.form.currentPage = 1
      this.loadCourses()
    },

    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val: number) {
      this.form.currentPage = val
      this.loadCourses()
    },
    async changeCourseStatus (course: any) {
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      console.log(data)
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
