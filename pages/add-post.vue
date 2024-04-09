<template>
  <v-layout fill-height align-center justify-center>
    <v-card
      outlined
      width="90%"
      class="d-block justify-center align-center rounded-xl pa-8 main-card"
      elevation="8"
      shaped
      height="90%"
    >
      <v-row style="height: 85% !important;" class="mb-4 mt-2">
        <v-col cols="6">
          <v-text-field v-model="form.name" outlined label="Title" />
          <ckeditor v-model="form.description" />
        </v-col>
        <v-col cols="6">
          <my-dnd
            height="100%"
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
        </v-col>
      </v-row>
      <v-row class="justify-end ma-0">
        <v-btn x-large color="primary" @click="submit()">
          Submit
        </v-btn>
      </v-row>
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
        files: ''
      },
      files: '',
      mediaUrlGuide: undefined
    }
  },
  methods: {
    uploadMedia (thumbnail) {
      this.mediaUrlGuide = URL.createObjectURL(thumbnail[0])
      this.form.files = thumbnail
    },
    async submit () {
      try {
        const data = new FormData()
        data.append('files', this.form.files[0])
        data.append('name', this.form.name)
        data.append('description', this.form.description)
        await this.$axios.post('/submission/create', data, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`
          }
        })
        this.$router.push('/account')
      } catch (err) {
        console.err(err)
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
