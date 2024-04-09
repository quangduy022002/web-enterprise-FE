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
    '~/plugins/rules',
    '~plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  axios: {
    baseURL: 'http://localhost:8080',
    debug: false,
    proxyHeaders: false,
    credentials: false
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login/',
            method: 'post',
            propertyName: 'data.token'
          },
          user: {
            url: '/account/detail/information',
            method: 'get',
            propertyName: false
          },
          tokenRequired: true,
          logout: false
        }
      },
      watchLoggedIn: true,
      redirect: {
        login: '/login',
        logout: '/login',
        home: false
      },
      fullPathRedirect: true
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
          primary: '#004D85',
          accent: '#426FE2',
          secondary: '#FFFFFF',
          info: '#000000',
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
