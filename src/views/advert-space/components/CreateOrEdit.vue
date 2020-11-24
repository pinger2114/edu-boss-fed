<template>
  <div class="create-or-edit">
    <el-card>
      <el-form ref="form" v-model="space" label-width="100px">
        <el-form-item label="广告位名称">
          <el-input v-model="space.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onCommit" type="primary">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateSpace, getSpaceById } from '@/services/advert-space'

export default Vue.extend({
  name: 'CreateOrEditSpace',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      space: {
        name: ''
      }
    }
  },
  created () {
    this.isEdit && this.loadSpace()
  },
  methods: {
    async loadSpace () {
      const { data } = await getSpaceById(this.id)
      this.space = data.content
    },
    async onCommit () {
      const { data } = await saveOrUpdateSpace({
        name: this.space.name
      })
      if (data.message === 'success') {
        this.$message.success('操作成功')
        this.$router.back()
      }
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
