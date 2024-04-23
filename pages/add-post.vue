<template>
  <v-layout fill-height align-center justify-center>
    <dialog-term ref="dialogTerm" @click="$refs.dialogTerm.dialog = false" />
    <v-card
      outlined
      class="d-block justify-center align-center rounded-xl pa-8 main-card"
      elevation="8"
      shaped
      width="90%"
    >
      <v-row class="mb-4 mt-2">
        <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 6">
          <v-text-field v-model="form.name" outlined label="Title" />
          <ckeditor v-model="form.description" />
        </v-col>
        <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 6">
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
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            truncate-length="30"
          />
        </v-col>
      </v-row>
      <div class="d-flex align-center" style="gap: 2px">
        <v-checkbox
          v-model="checkbox"
          :on-icon="'mdi-checkbox-marked-outline'"
          :off-icon="'mdi-checkbox-blank-outline'"
          color="#0C1153"
        />
        <p class="mb-0">
          I agree to the <a style="color: blue;" @click="handleOpen">Term of service</a> and <a style="color: blue;" @click="handleOpen">Private policy</a>.
        </p>
      </div>
      <v-layout class="justify-end ma-0">
        <v-btn large class="mr-4 text-none py-0" outlined :loading="loading" @click="$router.go(-1)">
          Cancel
        </v-btn>
        <v-btn
          large
          color="primary"
          depressed
          class="text-none"
          :disabled="!checkbox"
          :loading="loading"
          @click="submit()"
        >
          Submit
        </v-btn>
      </v-layout>
    </v-card>
  </v-layout>
</template>

<script>
import { Alert } from '~/store/alerts'
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
      filesPdf: [],
      checkbox: false,
      loading: false
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
    handleOpen (event) {
      event.stopPropagation()
      this.$refs.dialogTerm.dialog = true
    },
    async submit () {
      this.loading = true
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
        this.loading = false
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: 'Successful'
        }))
        this.$router.push('/account')
      } catch (err) {
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'error',
          message: err?.response?.data?.message
        }))
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
