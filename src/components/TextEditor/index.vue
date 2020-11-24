<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: String
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      const oldValue = this.value
      const editor = new E(this.$refs.editor as any)
      editor.config.onchange = (value: string) => {
        this.$emit('input', value)
      }
      editor.create()
      editor.txt.html(this.value)
      if (oldValue !== this.value) {
        editor.txt.html(this.value)
      }
      editor.config.customUploadImg = async function (resultFiles: any, insertImgFn: any) {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        insertImgFn(data.data.name)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
