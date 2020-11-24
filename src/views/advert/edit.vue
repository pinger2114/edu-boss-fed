<template>
  <div class="edit-advert">
    <create-or-edit-advert isEdit :id="id"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEditAdvert from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'AdvertEdit',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    CreateOrEditAdvert
  }
})
</script>
<style lang="scss" scoped>
</style>
