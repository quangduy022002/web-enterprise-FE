<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card v-if="!loading" flat>
    <v-img
      :src="post?.files[0]"
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
    <v-layout v-for="(file, index) in post.files.slice(1)" :key="index" align-center class="mt-2 ml-4 mb-2">
      <v-icon class="mr-2">
        mdi-file-pdf-box
      </v-icon>
      <a :href="file" target="_blank">
        <p class="ma-0">{{ formatNameFile(file) }}</p>
      </a>
    </v-layout>
    <v-card-text v-html="post.description" />
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
  </v-card>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      form: {
        content: '',
        submissionId: this.$route.params.slug
      }
    }
  },
  computed: {
    viewMode () {
      return this.$route.query?.mode ?? ''
    }
  },
  methods: {
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
