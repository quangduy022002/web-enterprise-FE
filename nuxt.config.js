import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - web-enterprise-FE',
    title: 'web-enterprise-FE',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/rules'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  axios: {
    baseURL: 'localhost:8080/',
    proxy: true,
    headers: {
      accept: 'application/json',
      common: {
        'Content-Type': 'application/json'
      }
      // Add other common headers if needed
    }
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'accounts/token/',
            method: 'post',
            propertyName: 'access',
          },
          user: {
            url: 'accounts/me/',
            method: 'get',
            propertyName: 'users'
          },
          tokenRequired: true,
          logout: false
        }
      },
      watchLoggedIn: true,
      redirect: {
        login: '/login',
        logout: '/',
        callback: '/login',
        home: '/'
      }
    }
  },
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    font: {
      family: 'Inter'
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#E4DDB9',
          accent: '#426FE2',
          secondary: '#E4DDB9',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: '#E14444',
          success: colors.green.accent3
        },
        dark: {
          primary: '#E4DDB9',
          accent: colors.grey.darken3,
          secondary: '#E4DDB9',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
