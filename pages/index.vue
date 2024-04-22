<template>
  <v-card flat class="overflow-auto fill-height">
    <v-app-bar
      color="primary"
      elevate-on-scroll
      rounded="b-xl t-0"
      class="pa-2"
    >
      <v-btn to="/" icon class="ml-6">
        <v-img src="/logo.png" width="36" height="44" class="mb-3" />
      </v-btn>
      <v-spacer />
      <v-btn v-if="!$auth.loggedIn" color="#387ADF" large class="mb-2">
        Login
      </v-btn>
      <v-menu
        bottom
        offset-y
      >
        <template #activator="{ on, attrs }">
          <v-btn
            plain
            class="white--text mb-2"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon color="white">
              mdi-account
            </v-icon>
            {{ $auth.user.firstName + " " + $auth.user.lastName }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :to="item.to"
          >
            <v-list-item-title v-if="item.valid">
              <v-icon class="mr-2">
                {{ item.icon }}
              </v-icon>{{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-sheet>
      <div class="text-h2 ma-6">
        Featured Posts
      </div>
      <v-layout class="overflow-y-auto pa-4">
        <v-card v-for="post in posts.slice(0,4)" :key="post.id" class="mr-6" min-width="360" @click="toPost(post.id)">
          <v-layout fill-height class="pa-2">
            <v-img contain :src="post.files[0] ??'/image.png'" height="164" width="164" />
            <v-layout class="pa-2" column justify-space-between>
              <div>
                <div class="text-h2">
                  {{ post.name }}
                </div>
                <div class="text-caption">
                  {{ `by ${post.author.firstName}` }}
                </div>
                <div class="text-subtitle-1">
                  {{ simpleDescription(post.description) }}
                </div>
              </div>
            </v-layout>
          </v-layout>
        </v-card>
      </v-layout>
      <div class="text-h2 ma-6">
        New Posts
      </div>
      <v-row class="px-4">
        <v-col v-for="post in newPosts" :key="post.id" :cols="$vuetify.breakpoint.smAndDown ? 12 : 3">
          <v-card height="296px" width="" @click="toPost(post.id)">
            <v-layout justify-center align-center>
              <v-img contain :src="post.files[0] ??'/image.png'" height="164" width="164" />
            </v-layout>
            <div class="pa-4">
              <div class="text-h2">
                {{ post.name }}
              </div>
              <div class="text-caption">
                {{ `by ${post.author.firstName}` }}
              </div>
              <div class="text-subtitle-1">
                {{ simpleDescription(post.description) }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-layout justify-center class="mt-4">
        <v-btn v-if='newPosts.length > 4' @click="loadMore = !loadMore">
          {{ loadMore ? 'Show less' : 'Load More' }}
        </v-btn>
      </v-layout>
    </v-sheet>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      items: [{
        title: 'My Account',
        to: '/account',
        icon: 'mdi-account',
        valid: this.$auth.user.roles.name !== 5
      },
      {
        title: 'Logout',
        to: '/logout',
        icon: 'mdi-logout',
        valid: true
      }
      ],
      posts: [],
      loadMore: false
    }
  },
  async fetch () {
    const res = await this.$axios.get('/submission/approved-submissions-list')
    this.posts = res.data
  },
  computed: {
    newPosts () {
      const reversed = JSON.parse(JSON.stringify(this.posts)).reverse()
      return this.loadMore ? reversed : reversed.slice(0, 4)
    }
  },
  methods: {
    simpleDescription (value) {
      const string = value
      let textContent = string.replace(/<[^>]+>/g, '')
      const maxLength = 40
      if (textContent.length > maxLength) {
        textContent = textContent.substring(0, maxLength) + '...'
      }
      return textContent
    },
    toPost (id) {
      this.$router.push({ path: `/post/${id}`, query: { mode: 'view' } })
    }
  }
}
</script>
