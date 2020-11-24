<template>
  <div class="space-edit">
    <create-or-edit :id="id" isEdit />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'SpaceEdit',
  props: {
    id: {
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
