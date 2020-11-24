<template>
  <div class="edit-course">
    <create-or-edit isEdit :course-id="courseId" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    CreateOrEdit
  }
})
</script>
<style lang="scss" scoped>
</style>
