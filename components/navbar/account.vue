<template>
  <v-navigation-drawer
  :mini-variant="mini"
  fixed
  height="100%"
  touchless
  app
  permanent
  hide-overlay
  :width="$vuetify.breakpoint.smAndDown ? '100%' : ''"
  color="primary"
  >
    <v-layout column fill-height>
      
      <div class="text-h2 ml-4 mt-4 white--text d-flex" @click.stop="mini = !mini">
        <v-icon class="mr-4" color="white">
          mdi-text
        </v-icon>
        <div v-if="!mini">Dashboard</div>
      </div>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to">
          <v-list-item-icon>
            <v-icon color="white">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>

          <v-list-item-title class="white--text">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-spacer />
      <v-list>
        <v-list-item v-for="item in itemsBottom" :key="item.title" :to="item.to" class="white--text">
          <v-list-item-icon>
            <v-icon color="white">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>

          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavBarAccount',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    mini: true,
    items: [
      {
        icon: 'mdi-home',
        title: 'Home',
        to: '/'
      },
      {
        icon: 'mdi-account-group',
        title: 'Dashboard',
        to: '/account'
      },
      {
        icon: 'mdi-cog',
        title: 'Personal Setting',
        to: '/account/setting'
      }
    ],
    itemsBottom: [
      {
        title: 'Logout',
        icon: 'mdi-logout',
        to: '/logout'
      }
    ]
  }),
  computed: {
  },
  created () {
    if (this.$auth.user.roles.name === 1) {
      this.items.splice(2, 0, {
        icon: 'mdi-account',
        title: 'User',
        to: '/account/user'
      })
    }
  },
  methods: {
    createProject () {

    }
  }
}
</script>
