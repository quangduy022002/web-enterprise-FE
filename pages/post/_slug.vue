<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-container>
    <v-layout justify-space-between class="mb-2">
      <v-btn icon fab @click="$router.go(-1)">
        <v-icon large>
          mdi-arrow-left-circle
        </v-icon>
      </v-btn>
      <v-spacer />
      <v-layout>
        <v-btn v-if="post?.status?.name !== 'Approved' && $auth.user.roles.name !== 4 && viewMode !== 'view'" color="error" class="mr-4" @click="approve()">
          Deny
        </v-btn>
        <v-btn v-if="post?.status?.name !== 'Approved' && $auth.user.roles.name !== 4 && viewMode !== 'view'" color="success" @click="approve()">
          Approve
        </v-btn>
      </v-layout>
    </v-layout>
    <v-card v-if="!loading" flat>
      <v-img
        :src="image"
        contain
        class="white--text align-end mb-4"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="500px"
      >
        <v-card-title class="text-h1">
          {{ post.name }}
        </v-card-title>
      </v-img>
      <v-layout class="text-caption px-4" justify-space-between>
        <div>{{ formatDate(post.createdAt) }}</div>
        <div>{{ `by ${post.author.firstName}` }}</div>
      </v-layout>
      <v-divider />
      <v-layout v-for="(file, index) in filesPdf" :key="index" align-center class="mt-2 ml-4 mb-2">
        <v-icon class="mr-2">
          mdi-file-pdf-box
        </v-icon>
        <a :href="file" target="_blank">
          <p class="ma-0">{{ formatNameFile(file) }}</p>
        </a>
      </v-layout>
      <v-card-text v-html="post.description" />
      <div v-if="viewMode !== 'view'">
        <div class="text-h2">
          Comments
        </div>
        <v-divider />
        <v-form @submit.prevent="addComment()">
          <v-layout class="my-2" align-center>
            <v-btn icon class="mr-2">
              <v-img src="/avatar.png" width="40" height="40" />
            </v-btn>

            <v-text-field
              v-model="form.content"
              outlined
              rounded
              dense
              hide-details
              placeholder="Write your comment here"
            />
            <v-btn icon class="mr-2" type="submit">
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </v-layout>
        </v-form>
        <v-divider v-if="post.comments.length" />
        <v-layout v-for="comment in post.comments" :key="comment.id" class="my-2" align-center>
          <v-btn icon class="mr-2">
            <v-img src="/avatar.png" width="40" height="40" />
          </v-btn>
          <v-layout column>
            <div class="font-weight-bold">
              {{ comment.author.firstName + " " + comment.author.lastName }}
            </div>
            <div>{{ comment.content }}</div>
          </v-layout>
        </v-layout>
      </div>
      <div v-else>
        <div class="text-h2">
          Feedback
        </div>
        <v-divider />
        <v-form @submit.prevent="addFeedback()">
          <v-layout class="my-2" align-center>
            <v-btn icon class="mr-2">
              <v-img src="/avatar.png" width="40" height="40" />
            </v-btn>

            <v-text-field
              v-model="form.content"
              outlined
              rounded
              dense
              hide-details
              placeholder="Write your comment here"
            />
            <v-btn icon class="mr-2" type="submit">
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </v-layout>
        </v-form>
        <v-divider v-if="post.feedbacks.length" />
        <v-layout v-for="feedback in post.feedbacks" :key="feedback.id" class="my-2" align-center>
          <v-btn icon class="mr-2">
            <v-img src="/avatar.png" width="40" height="40" />
          </v-btn>
          <v-layout column>
            <div class="font-weight-bold">
              {{ feedback.author.firstName + " " + feedback.author.lastName }}
            </div>
            <div>{{ feedback.content }}</div>
          </v-layout>
        </v-layout>
      </div>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      post: {},
      loading: false,
      form: {
        content: '',
        submissionId: this.$route.params.slug
      },
      image: '',
      filesPdf: []
    }
  },
  async fetch () {
    try {
      this.loading = true
      const res = await this.$axios.get(`/submission/detail/${this.$route.params.slug}`)
      this.post = res.data
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
      const acceptedExtensions = ['.pdf', '.doc', '.docx']
      this.post.files.forEach((file) => {
        acceptedExtensions.forEach((extension) => {
          if (file.toLowerCase().includes(extension)) {
            this.filesPdf.push(file)
          }
        })
        imageExtensions.forEach((extension) => {
          if (file.toLowerCase().includes(extension)) {
            this.image = file
          }
        })
      })
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false
    }
  },
  computed: {
    viewMode () {
      return this.$route.query?.mode ?? ''
    }
  },
  methods: {
    async deny () {
      await this.$axios.patch(`/submission/denied/${this.$route.params.slug}`)
    },
    async approve () {
      await this.$axios.patch(`/submission/approve/${this.$route.params.slug}`)
    },
    async addComment () {
      const res = await this.$axios.post('/comment/create', this.form)
      this.post.comments.push(res.data)
    },
    async addFeedback () {
      const res = await this.$axios.post('/feedback/create', this.form)
      this.post.feedbacks.push(res.data)
    },
    formatDate (value) {
      const dateString = value
      const date = new Date(dateString)
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
      const formattedDate = date.toLocaleDateString('en-GB', options)
      return formattedDate// Output: 09/04/2024
    },
    formatNameFile (file) {
      const fileNameWithParams = file.split('?')[0]
      return fileNameWithParams.substring(fileNameWithParams.lastIndexOf('/') + 1)
    }
  }
}
</script>
