<template>
  <div class="space-list">
    <el-card>
      <div slot="header">
        <el-button @click="$router.push({
          name: 'advert-space-create'
        })">添加广告位</el-button>
      </div>
      <el-table
        :data="spaces"
        style="width: 100%">
        <el-table-column
          prop="spaceKey"
          label="spaceKey"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告位名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="$router.push({
              name: 'advert-space-edit',
              params: {
                id: scope.row.id
              }
            })" type="text">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllSpaces } from '@/services/advert-space'
import dayjs from 'dayjs'

export default Vue.extend({
  name: 'SpaceList',
  data () {
    return {
      spaces: []
    }
  },
  created () {
    this.loadSpaces()
  },
  methods: {
    async loadSpaces () {
      const { data } = await getAllSpaces()
      console.log(data)
      this.spaces = data.content
      this.spaces.forEach((item: any) => {
        item.createTime = dayjs(item.createTime).format('YYYY-MM-DD hh:mm')
        item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD hh:mm')
      })
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
