<template>
  <div class="advert-list">
    <el-card>
      <div slot="header">
        <el-button @click="$router.push({
          name: 'advert-create'
        })">添加广告</el-button>
      </div>
      <el-table
        :data="adverts"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="spacePlace.name"
          label="广告位置">
        </el-table-column>
        <el-table-column
          label="广告图片">
          <template slot-scope="scope">
          <img style="height: 50px; width:50px;" :src="scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column
          min-width="180"
          label="时间">
          <template slot-scope="scope">
          <p>开始时间：{{ scope.row.startTimeFormatString }}</p>
          <p>结束时间：{{ scope.row.endTimeFormatString }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="上线/下线">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleChangeStatus(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push({
              name: 'advert-edit',
              params: {
                id: scope.row.id
              }
            })">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAdList, saveOrUpdate, updateStatus } from '@/services/advert'
import { getAllSpaces } from '@/services/advert-space'

export default Vue.extend({
  name: 'AdvertList',
  data () {
    return {
      adverts: []
    }
  },
  methods: {
    async loadAdverts () {
      const space = await getAllSpaces()
      const { data } = await getAdList()
      this.adverts = data.content
      // const a = space.data.content.find((el: any) => el.id === 1).name
      // console.log(a)
      this.adverts.forEach((item: any) => {
        item.spacePlace = space.data.content.find((el: any) => el.id === item.spaceId)
      })
    },
    async handleChangeStatus (row: any) {
      console.log(typeof (row.status))
      const { data } = await updateStatus({
        id: row.id,
        status: row.status
      })
      if (data.message === 'success') {
        this.$message.success('状态更改成功')
      }
    }
  },
  created () {
    this.loadAdverts()
  }
})
</script>
<style lang="scss" scoped>
</style>
