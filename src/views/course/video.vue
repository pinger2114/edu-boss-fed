<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        <span>课程：XXX</span>
        <br/>
        <span>阶段：XXX</span>
        <br/>
        <span>课时：XXX</span>
      </div>
      <el-form>
        <el-form-item label="视频上传">
          <input ref="video-file" type="file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input ref="image-file" type="file">
        </el-form-item>
        <el-form-item>
          <el-button @click="hadleUpload" type="primary">开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p>视频上传中{{ uploadPercent }}%</p>
          <p
            v-if="isUploadSuccess"
          >视频转码{{ isTransCodeSuccess ? '完成' : '正在处理，请稍候' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAliyunImagUploadAddressAdnAuth,
  getAliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  getAliyunTransCodePercent
} from '@/services/aliyun-upload'

export default Vue.extend({
  name: 'CourseVideo',
  data () {
    return {
      uploader: null,
      imageURL: '',
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTransCodeSuccess: false
    }
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
        userId: '122',
        // 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
        region: '',
        // 分片大小默认1M，不能小于100K
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {
          console.log('onUploadstarted', uploadInfo)
          // 1.通过后端获取文件上传凭证
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            const { data } = await getAliyunImagUploadAddressAdnAuth()
            uploadAddressAndAuth = data.data
            this.imageURL = data.data.imageURL
          } else {
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }

          // 2.调用 uploader.setUploadAuthAndAddress(uploadInfo,uploadAuth, uploadAddress, videoId) 设置上传凭证
          ;(this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo: any) {
          console.log('onUploadSucceed', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          console.log('onUploadFailed', uploadInfo)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (
          uploadInfo: any,
          totalSize: any,
          loadedPercent: any
        ) => {
          console.log('onUploadProgress', uploadInfo)
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo: any) {
          console.log('onUploadTokenExpired', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          this.isUploadSuccess = true
          // 发送转码请求
          console.log(this.$route.query.lessonId, this.imageURL, (this.video as any).files[0].name, this.videoId)
          const { data } = await aliyunTransCode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageURL,
            fileName: (this.video as any).files[0].name,
            fileId: this.videoId
          })
          console.log('发送转码请求', data)

          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId)
            console.log(data.data)
            if (data.data === 100) {
              window.clearInterval(timer)
              this.isTransCodeSuccess = true
              console.log('转码成功')
            }
          }, 3000)
        }
      })
    },
    hadleUpload () {
      this.isTransCodeSuccess = false
      this.isUploadSuccess = false
      this.uploadPercent = 0
      const videoFile = (this.video as any).files[0]
      const imageFile = (this.image as any).files[0]
      const uploader = this.uploader as any

      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')

      uploader.startUpload()

      console.log(videoFile, imageFile)
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
