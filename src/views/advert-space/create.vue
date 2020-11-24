<template>
  <div class="space-create">
    <create-or-edit />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'SpaceCreate',
  components: {
    CreateOrEdit
  }
})
</script>
<style lang="scss" scoped>
</style>
