<template>
  <v-navigation-drawer
    color="primary"
    fixed
    app
    permanent
  >
    <v-layout column fill-height>
      <div class="text-h1 ml-4 mt-4 white--text">
        Dashboard
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
