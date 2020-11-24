<template>
  <div class="create-or-edit">
    <el-card>
      <el-form ref="form" :model="advert" label-width="80px">
        <el-form-item label="广告名称">
          <el-input v-model="advert.name"></el-input>
        </el-form-item>
        <el-form-item label="广告位置">
          <el-select v-model="advert.spaceId" placeholder="请选择活动区域">
            <el-option
              v-for="item in spaces"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="advert.startTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-date-picker
            v-model="advert.endTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上线/下线">
          <el-radio-group v-model="advert.status">
            <el-radio :label="0">下线</el-radio>
            <el-radio :label="1">上线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告图片">
          <el-progress
            type="circle"
            :percentage="percentage"
            v-if="isUploading"
            :width="178"
            :status="percentage === 100 ? 'success' : undefined"
          />
          <el-upload
            v-else
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-upload="beforeAvatarUpload"
            :http-request="handleUpload"
            :show-file-list="false">
            <img v-if="advert.img" :src="advert.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">建议尺寸：230*300px，JPG、PNG格式，图片小于150K</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告链接">
          <el-input v-model="advert.link"></el-input>
        </el-form-item>
        <el-form-item label="广告备注">
          <el-input type="textarea" v-model="advert.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { uploadCourseImage } from '@/services/course'
import { getAllSpaces } from '@/services/advert-space'
import { saveOrUpdateAd, getAdById } from '@/services/advert'

export default Vue.extend({
  name: 'CreateOrEditAdvert',
  props: {
    id: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      advert: {
        name: '',
        spaceId: null,
        text: '',
        img: '',
        link: '',
        startTime: '',
        endTime: '',
        status: 0
      },
      spaces: [],
      percentage: 0,
      isUploading: false
    }
  },
  created () {
    this.loadSpaces()
    this.isEdit && this.loadAdById()
  },
  methods: {
    async loadAdById () {
      const { data } = await getAdById(this.id)
      this.advert = data.content
      console.log(data)
    },
    async onSubmit () {
      const { data } = await saveOrUpdateAd(this.advert)
      if (data.message === 'success') {
        this.$message.success('操作成功')
        this.$router.back()
      }
    },
    async loadSpaces () {
      const { data } = await getAllSpaces()
      this.spaces = data.content
    },
    async handleUpload (options: any) {
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await uploadCourseImage(fd, e => {
        this.percentage = Math.floor(e.loaded / e.total * 100)
      })
      this.advert.img = data.data.name
      this.isUploading = false
      this.percentage = 0
    },
    beforeAvatarUpload (file: any) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 20

      return true
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
::v-deep .el-upload__tip {
  background: #f3f4f5;
  width: 350px;
  padding-left: 20px;
  border-radius: 10px;
  border: #e7e8ea 1px solid;
}
</style>
