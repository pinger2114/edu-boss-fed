<template>
  <div class="create-advert">
    <create-or-edit-advert />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEditAdvert from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'CreateAdvert',
  components: {
    CreateOrEditAdvert
  }
})
</script>
<style lang="scss" scoped>
</style>
