<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-container>
    <v-layout class="mb-2">
      <v-btn icon fab @click="$router.go(-1)">
        <v-icon large>
          mdi-arrow-left-circle
        </v-icon>
      </v-btn>
      <v-spacer />
      <v-btn v-if="post?.status?.name !== 'Denied' && $auth.user.roles.name === 3 && viewMode !== 'view'" color="error" class="mr-2" @click="deny()">
        Deny
      </v-btn>
      <v-btn v-if="post?.status?.name !== 'Approved' && $auth.user.roles.name === 3 && viewMode !== 'view'" color="success" class="mr-2" @click="approve()">
        Approve
      </v-btn>
      <v-btn v-if="post?.status?.name === 'Approved' && ($auth.user.roles.name === 1 || $auth.user.roles.name === 2) && viewMode !== 'view'" :color="post.publish ? '' : 'success'" @click="publish()">
        {{ post.publish ? 'Unpublish' : 'Publish' }}
      </v-btn>
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
      <v-layout v-if="viewMode === 'view'" justify-end align-end>
        <div class="mr-4">
          <v-icon>mdi-chat</v-icon>{{ `${post.feedbacks.length} Comments` }}
        </div>
        <div @click="handleLike()">
          <v-icon :color="post.likes.includes($auth.user.id) ? 'red' : ''">
            mdi-heart
          </v-icon>{{ `${post.likes.length} Likes` }}
        </div>
      </v-layout>
      <v-layout class="text-caption" justify-space-between>
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
      <div v-if="viewMode !== 'view' && post.period.finalClosureDate >= currentDay && ($auth.user.roles.id === 3 || $auth.user.roles.id === 4)">
        <div class="text-h2">
          Comments
        </div>
        <v-divider />
        <v-form @submit.prevent="addComment()">
          <v-layout class="my-2" align-center>
            <div class="mr-2">
              <v-img :src="$auth.user.avatar ?? '/avatar.png'" width="40" height="40" class=" rounded-circle" />
            </div>

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
          <div class="mr-2">
            <v-img :src="comment.author?.avatar ?? '/avatar.png'" width="40" height="40" class=" rounded-circle" />
          </div>
          <v-layout column>
            <div class="font-weight-bold">
              {{ comment.author.firstName + " " + comment.author.lastName }}
            </div>
            <v-layout v-if="editComment.length && editComment === comment.id">
              <v-text-field
                v-model="comment.content"
                outlined
                dense
                hide-details
                placeholder="Write your comment here"
              />
              <v-btn icon class="mr-2" @click="editItem(comment)">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-layout>
            <div v-else>
              {{ comment.content }}
            </div>
          </v-layout>
          <v-menu
            v-if="!editComment.length && comment.author.id === $auth.user.id"
            bottom
            :close-on-click="true"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                fab
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

            <v-list class="d-block">
              <v-list-item @click="editMode(comment.id)">
                <v-list-item-title>
                  <v-icon
                    class="mr-2"
                  >
                    mdi-pencil
                  </v-icon>Edit
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteItem(comment)">
                <v-list-item-title>
                  <v-icon

                    class="mr-2"
                  >
                    mdi-delete
                  </v-icon>Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-layout>
      </div>
      <div v-else-if="viewMode === 'view'">
        <div class="text-h2">
          Feedback
        </div>
        <v-divider />
        <v-form @submit.prevent="addFeedback()">
          <v-layout class="my-2" align-center>
            <div class="mr-2">
              <v-img :src="$auth.user?.avatar ?? '/avatar.png'" width="40" height="40" class=" rounded-circle" />
            </div>

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
          <div class="mr-2">
            <v-img :src="feedback.author?.avatar ?? '/avatar.png'" width="40" height="40" class=" rounded-circle" />
          </div>
          <v-layout column>
            <div class="font-weight-bold">
              {{ feedback.author.firstName + " " + feedback.author.lastName }}
            </div>
            <v-layout v-if="editComment.length && editComment === feedback.id">
              <v-text-field
                v-model="feedback.content"
                outlined
                dense
                hide-details
                placeholder="Write your comment here"
              />
              <v-btn icon class="mr-2" @click="editItem(feedback)">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-layout>
            <div v-else>
              {{ feedback.content }}
            </div>
          </v-layout>
          <v-menu
            v-if="!editComment.length && feedback.author.id === $auth.user.id"
            bottom
            :close-on-click="true"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                fab
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

            <v-list class="d-block">
              <v-list-item @click="editMode(feedback.id)">
                <v-list-item-title>
                  <v-icon
                    class="mr-2"
                  >
                    mdi-pencil
                  </v-icon>Edit
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteItem(feedback)">
                <v-list-item-title>
                  <v-icon

                    class="mr-2"
                  >
                    mdi-delete
                  </v-icon>Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-layout>
      </div>
    </v-card>
  </v-container>
</template>
<script>
import moment from 'moment'
import { Alert } from '~/store/alerts'
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
      filesPdf: [],
      editComment: '',
      currentDay: moment().format('YYYY-MM-DD')
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
      const res = await this.$axios.patch(`/submission/denied/${this.$route.params.slug}`)
      this.post = res.data
      this.$store.commit('alerts/add', new Alert(this, {
        type: 'success',
        icon: 'check',
        message: 'Successful'
      }))
    },
    async approve () {
      const res = await this.$axios.patch(`/submission/approve/${this.$route.params.slug}`)
      this.post = res.data
      this.$store.commit('alerts/add', new Alert(this, {
        type: 'success',
        icon: 'check',
        message: 'Successful'
      }))
    },
    async publish () {
      await this.$axios.patch(`/submission/publish/${this.post.id}`, {
        publish: !this.post.publish
      })
      this.post.publish = !this.post.publish

      this.$store.commit('alerts/add', new Alert(this, {
        type: 'success',
        icon: 'check',
        message: 'Successful'
      }))
    },
    async addComment () {
      const res = await this.$axios.post('/comment/create', this.form)
      this.form.content = ''
      this.post.comments.push(res.data)
    },
    async addFeedback () {
      const res = await this.$axios.post('/feedback/create', this.form)
      this.form.content = ''
      this.post.feedbacks.push(res.data)
    },
    async handleLike () {
      let res
      if (this.post.likes.includes(this.$auth.user.id)) {
        res = await this.$axios.patch(`/submission/unlike/${this.post.id}`)
      } else {
        res = await this.$axios.patch(`/submission/like/${this.post.id}`)
      }
      this.post.likes = res.data.likes
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
    },
    editMode (id) {
      this.editComment = id
    },
    async editItem (item) {
      try {
        if (this.viewMode !== 'view') {
          await this.$axios.patch(`/comment/update/${item.id}`, { content: item.content })
        } else {
          await this.$axios.patch(`/feedback/update/${item.id}`, { content: item.content })
        }
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: 'Successful'
        }))
      } catch (err) {
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'error',
          message: err?.response?.data?.message
        }))
      } finally {
        this.editComment = ''
      }
    },
    async deleteItem (item) {
      try {
        if (this.viewMode !== 'view') {
          await this.$axios.delete(`/comment/remove/${item.id}`)
          const index = this.post.comments.indexOf(item)
          this.post.comments.splice(index, 1)
        } else {
          await this.$axios.delete(`/feedback/remove/${item.id}`)
          const index = this.post.feedbacks.indexOf(item)
          this.post.feedbacks.splice(index, 1)
        }
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: 'Successful'
        }))
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
