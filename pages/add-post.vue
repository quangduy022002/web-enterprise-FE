<template>
  <v-layout fill-height align-center justify-center>
    <v-card
      outlined
      class="d-block justify-center align-center rounded-xl pa-8 main-card"
      elevation="8"
      shaped
      width="90%"
    >
      <v-row class="mb-4 mt-2">
        <v-col cols="6">
          <v-text-field v-model="form.name" outlined label="Title" />
          <ckeditor v-model="form.description" />
        </v-col>
        <v-col cols="6">
          <my-dnd
            height="80%"
            rounded="lg"
            accept="image/*"
            mode="hide"
            class="border-dashed primary--border d-flex align-center"
            :empty="false"
            @upload="uploadMedia"
          >
            <v-img
              contain
              :src="mediaUrlGuide"
              class="rounded-lg pa-1"
              max-height="260"
              content-class="d-flex justify-center align-center"
            >
              <div v-if="!mediaUrlGuide" class="text-center d-flex flex-column text-primary">
                <v-icon x-large color="primary" class="mb-3">
                  mdi-folder
                </v-icon>
                Upload image
              </div>
            </v-img>
          </my-dnd>
          <v-file-input
            v-model="filesPdf"
            chips
            multiple
            accept="application/pdf"
            truncate-length="30"
          />
        </v-col>
      </v-row>
      <v-layout class="justify-end ma-0">
        <v-btn x-large class="mr-4" @click="$router.go(-1)">
          Cancel
        </v-btn>
        <v-btn x-large color="primary" @click="submit()">
          Submit
        </v-btn>
      </v-layout>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        name: '',
        description: '',
        files: []
      },
      mediaUrlGuide: undefined,
      filesPdf: []
    }
  },
  async created () {
    if (this.$route.query.id) {
      const res = await this.$axios.get(`/submission/detail/${this.$route.query.id}`)
      this.form.name = res.data.name
      this.form.description = res.data.description
      this.form.files = res.data.files
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
      const pdfExtension = '.pdf'
      res.data.files.forEach((file) => {
        if (file.toLowerCase().includes(pdfExtension)) {
          this.filesPdf.push(file)
        }
        imageExtensions.forEach((extension) => {
          if (file.toLowerCase().includes(extension)) {
            this.mediaUrlGuide = file
          }
        })
      })
      this.filesPdf = this.filesPdf.map(async (file) => {
        const response = await this.$axios.get(file)
        const blob = await response.blob()
        const fileName = file.substring(file.lastIndexOf('/') + 1)
        const fileObject = new File([blob], fileName)
        return fileObject
      })
    }
  },
  methods: {
    uploadMedia (thumbnail) {
      this.mediaUrlGuide = URL.createObjectURL(thumbnail[0])
      this.form.files.push(thumbnail[0])
    },
    async submit () {
      try {
        this.form.files = [...this.form.files, ...this.filesPdf]
        const data = new FormData()
        this.form.files.forEach((file) => {
          data.append('files', file)
        })
        data.append('name', this.form.name)
        data.append('description', this.form.description)
        if (this.$route.query.id) {
          await this.$axios.patch(`/submission/update/${this.$route.query.id}`, data, {
            headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`
            }
          })
        } else {
          await this.$axios.post('/submission/create', data, {
            headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`
            }
          })
        }

        this.$router.push('/account')
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
  <style scoped>
    .main-card {
      border-color: black;
      box-shadow: 10px 10px black !important;
    }
  </style>
