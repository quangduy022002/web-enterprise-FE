<template>
  <v-card
    :min-height="minHeight"
    :height="$attrs.height"
    :class="$attrs.class"
    :width="$attrs.width"
    :rounded="$attrs.rounded"
    :img="$attrs.img"
    :disabled="$attrs.disabled"
    @drop.prevent="onDrop"
    @dragover.prevent="drag('over')"
    @dragenter.prevent="drag('enter')"
    @dragleave.prevent="drag('leave')"
    @click.stop="browse(mode)"
  >
    <v-overlay :value="dragover" color="secondary" absolute style="pointer-events: none;" />

    <v-card-text class="d-flex flex-column pa-0">
      <v-layout column>
        <v-layout v-if="!uploadFiles.length">
          <v-layout v-show="empty" column grow align-center class="py-5">
            <v-icon size="60">
              mdi-cloud-download-outline
            </v-icon>
            {{ title }}
          </v-layout>

          <v-layout v-show="!empty">
            <slot />
          </v-layout>
        </v-layout>

        <v-layout v-else column>
          <v-list v-show="empty">
            <v-list-item v-for="(file, index) in uploadFiles" :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  {{ file.name }}
                  <small class="ml-3 text--secondary">{{ $file.size(file.size) }} bytes</small>
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click.stop="removeFile(file.name)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-layout v-show="!empty">
            <slot />
          </v-layout>
        </v-layout>

        <v-layout v-show="uploadFiles.length && empty" shrink justify-end class="pa-3">
          <v-btn color="secondary" small :disabled="uploadFiles.length < 1" @click="upload">
            <v-icon id="upload-button">
              mdi-upload
            </v-icon>

            Upload your file
          </v-btn>
        </v-layout>
      </v-layout>
    </v-card-text>

    <v-divider v-if="mode === 'tile'" />

    <v-card-actions v-show="mode === 'tile'">
      <input-file ref="selectFiles" :multiple="multiple" :accept="accept" @change="selectFiles">
        Input file
      </input-file>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'MyDnd',
  props: {
    mode: {
      type: String,
      default: 'tile'
    },
    empty: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: undefined
    },
    minHeight: {
      type: [String, Number],
      default: '154'
    },
    accept: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      dragover: false,
      uploadFiles: []
    }
  },
  methods: {
    drag (mode) {
      this.dragover = mode !== 'leave'
    },
    browse (mode) {
      if (mode === 'hide') { this.$refs.selectFiles.browse() }
    },
    addFiles (files) {
      // Check if multiple file upload is allowed, otherwise use 1st and upload it directly
      if (!this.multiple && files.length > 0) {
        this.uploadFiles.push(files[0])
        this.upload()
      } else {
        for (const file of files) {
          this.uploadFiles.push(file)
        }

        this.upload()
      }
    },
    selectFiles (files) {
      this.addFiles(files)
    },
    onDrop (e) {
      e.preventDefault()
      this.dragover = false
      this.addFiles(e.dataTransfer.files)
    },
    removeFile (fileName) {
      const index = this.uploadFiles.findIndex(file => file.name === fileName)

      if (index >= 0) {
        this.uploadFiles.splice(index, 1)
      }
    },
    upload () {
      this.$emit('upload', this.uploadFiles)
      this.uploadFiles = []
    }
  }
}
</script>
