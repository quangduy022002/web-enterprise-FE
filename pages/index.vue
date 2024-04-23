<template>
  <v-card flat class="fill-height">
    <v-app-bar
      id="header"
      color="primary"
      elevate-on-scroll
      rounded="b-xl t-0"
      class="pa-2"
      style="
        position: absolute;
        width: 100%;
        height: 70px;
        top: 0;
        transition: height 0.3s, box-shadow 0.3s;
      "
    >
      <v-btn to="/" icon class="ml-6">
        <v-img src="/logo.png" width="36" height="44" class="mb-3" />
      </v-btn>
      <v-spacer />
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
            <p class="mb-0 text-none">
              {{ $auth.user.firstName + " " + $auth.user.lastName }}
            </p>
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
    <v-sheet id="content">
      <v-layout class="my-6 mx-auto" style="width: 90%" align-center>
        <div class="text-h2 ml-3">
          Featured Posts
        </div>
        <v-spacer />
        <v-select
          v-model="faculty"
          :items="faculties"
          item-text="name"
          solo
          outlined
          dense
          flat
          style="max-width:200px;"
          class="white--text"
          hide-details
          placeholder="Faculty"
          prepend-inner-icon="mdi-filter-outline"
        />
      </v-layout>
      <v-carousel
        v-if="posts.length"
        v-model="model"
        hide-delimiter-background
        show-arrows-on-hover
        height="80vh"
      >
        <v-carousel-item
          v-for="post in posts.slice(0,4)"
          :key="post.id"
        >
          <v-card
            tile
            width="100%"
            height="80vh"
          >
            <v-img style="position: absolute; filter: brightness(50%); object-fit: cover;" height="100%" :src="getImageLink(post)" width="100%" />
            <v-layout style="position: relative; z-index: 10;" column fill-height class="pa-8" justify-end>
              <div class="text-h1 white--text">
                {{ post.name }}
              </div>
              <div class="text-h4 white--text">
                {{ `by ${post.author.firstName}` }}
              </div>
            </v-layout>
          </v-card>
        </v-carousel-item>
      </v-carousel>
      <div v-if="posts.length" class="text-h2 my-6 mx-auto" style="width: 90%">
        <p class="mb-0 text-h2 ml-3">
          New Posts
        </p>
      </div>
      <v-row v-if="posts.length" class=" mx-auto" style="width: 90%">
        <v-col v-for="post in newPosts" :key="post.id" :cols="$vuetify.breakpoint.smAndDown ? 12 : 4">
          <v-card class="pa-5 rounded-lg" elevation height="500" color="#eeeeee" @click="toPost(post.id)">
            <v-card-text>
              <div class="d-flex" style="gap: 10px">
                <v-avatar size="50">
                  <img alt="" :src="post.author?.avatar ?? '/avatar.png'">
                </v-avatar>
                <div>
                  <p class="text-subtitle-1 mb-0 font-weight-black">
                    {{ post.author.firstName + " " + post.author.lastName }}
                  </p>
                  <p class="text-subtitle-2 mb-0">
                    {{ compareTime(post.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="my-3">
                <!-- <v-img height="250" class="rounded-lg" src="https://source.unsplash.com/random/100x100/?5"  /> -->
                <v-img :src="getImageLink(post)" height="250" class="rounded-lg" />
                <h2 class="my-2 text-subtitle-1 font-weight-bold">
                  {{ post.name }}
                </h2>
                <p class="text-subtitle-2 mt-n1" style="height: 54px;" v-html="truncateDescription(post.description)" />
              </div>
              <div class="d-flex justify-end">
                <v-icon color="red">
                  mdi-heart
                </v-icon>
                <span class="ml-1">{{ post.likes.length }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-layout justify-center class="my-4">
        <v-btn v-if="newPosts.length >= 4" color="primary" class="text-none" depressed @click="loadMore = !loadMore">
          {{ loadMore ? 'Show less' : 'Load More' }}
        </v-btn>
      </v-layout>
    </v-sheet>
  </v-card>
</template>
<script>
import { compareTime } from '../utils/compareTime'
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
      data: [],
      loadMore: false,
      faculties: [],
      faculty: undefined,
      model: 0
    }
  },
  async fetch () {
    const res = await this.$axios.get('api/submission/approved-submissions-list')
    this.data = res.data
    const resFac = await this.$axios.get('api/faculty/get-all')
    this.faculties = resFac.data
  },
  computed: {
    newPosts () {
      const reversed = JSON.parse(JSON.stringify(this.posts)).reverse()
      return this.loadMore ? reversed : reversed.slice(0, 4)
    },
    posts () {
      let posts = this.data
      if (this.faculty) {
        posts = posts.filter(post => post.author.faculty.name === this.faculty)
      }
      return posts
    }
  },
  mounted () {
    const config = document.getElementById('header')
    const content = document.getElementById('content')
    content.style.paddingBottom = '64px'
    content.style.paddingTop = '64px'
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY

      if (scrollY > 0) {
        config.style.boxShadow = '0 0 50px 0 rgb(0 0 0 / 10%)'
        config.style.transition = 'all 0.3s'
        config.style.zIndex = '99'
        config.style.position = 'sticky'
        config.style.width = '100%'
        config.style.height = '70px'
        content.style.paddingBottom = '0'
        content.style.paddingTop = '0'
      } else {
        config.style.transition = 'all 0.3s'
        config.style.position = 'absolute'
        config.style.boxShadow = 'none'
        config.style.width = '100%'
        config.style.height = '70px'
        content.style.paddingBottom = '64px'
        content.style.paddingTop = '64px'
      }
    })
  },
  methods: {
    truncateDescription (description) {
      return description.length >= 60 ? description.substring(0, 60) + '...' : description
    },
    getImageLink (post) {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
      let image = ''
      post.files.forEach((file) => {
        imageExtensions.forEach((extension) => {
          if (file.toLowerCase().includes(extension)) {
            image = file
          }
        })
      })
      return image || '/image.png'
    },
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
    },
    compareTime
  }
}
</script>
