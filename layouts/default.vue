<template>
  <v-app>
    <v-snackbar v-if="messages.length" v-model="snackbar" :timeout="3000">
      <v-alert
        :value="messages.at(-1).value"
        :type="messages.at(-1).type"
        :icon="`mdi-${messages.at(-1).icon || 'alert'}`"
        elevation="5"
        class="ma-0"
      >
        {{ messages.at(-1).message }}
      </v-alert>

      <template #action>
        <v-btn icon>
          <v-icon @click="(snackbar = false)">
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <!-- <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <!-- <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar> -->
    <v-main>
      <Nuxt />
    </v-main>
  <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      snackbar: false,
      snackbarTime: 0
    }
  },
  computed: {
    ...mapFields('alerts', ['messages'])
  },
  watch: {
    messages () {
      if (this.messages.length > 0 && this.messages.at(-1).created.getTime() > this.snackbarTime) {
        this.snackbar = true
        this.snackbarTime = this.messages.at(-1).created.getTime()
      }
    }
  },
  mounted () {
    if (!this.$auth.loggedIn && !this.$route.path.includes('/login')) {
      this.$router.push('/login')
    }
  }
}
</script>
