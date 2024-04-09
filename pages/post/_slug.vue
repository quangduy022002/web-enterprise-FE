<template>
  <v-container>
    <v-btn v-if="post?.status?.name !== 'Approved' && $auth.user.roles.name === 3" @click="approve()">
      Approve
    </v-btn>
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
      <v-divider />
      <v-card-text v-html="post.description" />
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      post: {},
      loading: false
    }
  },
  async fetch () {
    try {
      this.loading = true
      const res = await this.$axios.get(`/submission/detail/${this.$route.params.slug}`)
      this.post = res.data
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async approve () {
      await this.$axios.patch(`/submission/approve/${this.$route.params.slug}`)
    }
  }
}
</script>
