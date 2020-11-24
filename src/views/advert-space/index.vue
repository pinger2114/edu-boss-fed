<template>
  <div class="space-index">
    <space-list />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SpaceList from './components/List.vue'

export default Vue.extend({
  name: 'AdvertSpaceIndex',
  components: {
    SpaceList
  }
})
</script>

<style lang="scss" scoped></style>
