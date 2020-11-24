<template>
  <div class="section">
    <el-card>
      <div slot="header">
        课程名称
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="allowdrop"
        @node-drop="handleSort"
      >
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions">
            <el-button @click.stop="handleEditSection(data)">编辑</el-button>
            <el-button type="primary">添加课时</el-button>
            <el-select class="select-status" v-model="data.status" @click="handleSelectionStatusChange(data)" placeholder="请选择">
              <el-option label="已隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已更新" :value="2"></el-option>
            </el-select>
          </span>
          <span v-else class="actions">
            <el-button>编辑</el-button>
            <el-button type="success" @click="$router.push({
              name: 'course-video',
              params: courseId,
              query: {
                sectionId: node.parent.id,
                lessonId: data.id
              }
            })">上传视频</el-button>
            <el-select class="select-status" v-model="data.status" @click="handleSelectionStatusChange(data)" placeholder="请选择">
              <el-option label="已隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已更新" :value="2"></el-option>
            </el-select>
          </span>
        </div>
      </el-tree>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="isEditing"
      width="30%">
      <el-form :model="section">
        <el-form-item label="课程名称">
          <el-input v-model="courseName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="章节名称">
          <el-input v-model="section.sectionName"></el-input>
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input v-model="section.description"></el-input>
        </el-form-item>
        <el-form-item label="课程排序">
          <el-input v-model="section.orderNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditing = false">取 消</el-button>
        <el-button type="primary" @click="onCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/course-section'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [Number, String],
      required: true
    },
    courseName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      },
      isEditing: false,
      section: {
        id: 0,
        courseId: 0,
        courseName: this.courseName,
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      }
    }
  },
  created () {
    this.loadSections()
  },
  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    },
    handleEditSection (data: any) {
      this.isEditing = true
      this.section.id = data.id
      this.section.sectionName = data.sectionName
      this.section.status = data.status
      this.section.description = data.description
      this.section.orderNum = data.orderNum
      this.section.courseName = this.courseName
      this.section.courseId = (this.courseId as any)
    },
    async onCommit () {
      const { data } = await saveOrUpdateSection(this.section)
      this.isEditing = false
      this.loadSections()
    },
    async handleSelectionStatusChange (data1: any) {
      this.section.id = data1.id
      this.section.sectionName = data1.sectionName
      this.section.status = data1.status
      this.section.description = data1.description
      this.section.orderNum = data1.orderNum
      this.section.courseName = this.courseName
      this.section.courseId = (this.courseId as any)
      const { data } = await saveOrUpdateSection(this.section)
      this.loadSections()
    },
    allowdrop (draggingNode: any, dropNode: any, type: any) {
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },
    async handleSort (dragNode: any, dropNode: any, type: any, event: any) {
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.lessonDTOS) {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (error) {
        console.log(error)
        this.$message.error('排序失败')
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.inner {
  flex: 1;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep .el-tree-node__content {
  height: auto;
}
.select-status {
  padding-left: 5px;
  width: 100px;
}
</style>
