<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      hidden
      @change="selectFiles"
    >

    <v-btn v-if="!uploading" icon @click="browse">
      <v-icon>
        mdi-file
      </v-icon>
    </v-btn>

    <v-progress-circular v-else indeterminate color="secondary" size="20" class="mx-2" />
  </div>
</template>

<script>
export default {
  name: 'RelyInputFile',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: undefined
    },
    uploading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectFiles (e) {
      this.$emit('change', e.target.files)
      e.target.value = null
    },
    browse () {
      this.$refs.fileInput.click()
    }
  }
}
</script>
