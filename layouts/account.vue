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
    <navbar-account />
    <v-main>
      <v-container fluid fill-height>
        <Nuxt />
      </v-container>
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
    if (!this.$auth.loggedIn) {
      this.$router.push('/login')
    }
  }
}
</script>
