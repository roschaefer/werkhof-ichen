import axios from 'axios'

const axiosConfig = {}
if (process.env.NODE_ENV === 'development') {
  axiosConfig.proxy = true
  axiosConfig.prefix = '/api'
}

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const clientUrl = process.env.VERCEL_URL || process.env.URL || 'http://localhost:3000'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: ['@mdi/font/css/materialdesignicons.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['~plugins/formatDate.js'],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/vuetify', '@nuxtjs/netlify-files'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
  ],

  pwa: {
    meta: {
      lang: 'de',
    },
  },

  /* sitemap */
  sitemap: {
    hostname: clientUrl,
    gzip: true,
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: axiosConfig,

  proxy: {
    '/uploads/': {
      target: apiUrl,
    },
    '/api/': {
      target: apiUrl,
      pathRewrite: { '^/api/': '' },
    },
  },

  /** loading: false, **/

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
    theme: {
      themes: {
        light: {
          primary: '#000000',
          accent: '#709726',
          secondary: '#ECE1CB',
          success: '#709726',
          info: '#2a434c',
          warning: '#E0124D',
          error: '#E0124D',

          ichen_beige: '#ece1cb',
          ichen_yellow: '#e5bc80',
          ichen_green: '#709726',
          ichen_blue: '#2a434c',
          ichen_red: '#e0124d',
          ichen_brown: '#48413d',
        },
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: ['mapbox-gl-controls/lib/styles'],
  },

  generate: {
    routes() {
      return axios
        .get(`${apiUrl}/veranstaltungs`, {
          params: {
            _sort: 'Datum:ASC',
            Datum_gte: new Date(),
          },
        })
        .then((res) => {
          return res.data.map((veranstaltung) => {
            return '/veranstaltung/' + veranstaltung.id
          })
        })
    },
  },
}
