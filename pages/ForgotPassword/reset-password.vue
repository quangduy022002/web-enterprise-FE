<template>
  <v-layout fill-height align-center justify-center>
    <v-card
      v-if="!success"
      outlined
      width="40%"
      class="d-block justify-center align-center rounded-xl pa-8 main-card"
      elevation="8"
      shaped
    >
      <v-layout column justify-center align-center class="mb-4">
        <v-img src="/logo.png" width="132" height="119" class="mb-4" />
        <h1 class="text-center primary--text">
          Reset Password
        </h1>
      </v-layout>

      <v-card-text>
        <v-form v-model="valid" @submit.prevent="sendCode">
          <p class="font-weight-black primary--text ml-1">
            New password
          </p>
          <v-text-field
            v-model="form.password"
            class="rounded-xl"
            color="black"
            prepend-inner-icon="mdi-lock"
            outlined
            placeholder="Enter your new password"
            :rules="[$rules.required]"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
          />
          <p class="font-weight-black primary--text ml-1">
            Confirm Password
          </p>
          <v-text-field
            v-model="form.rePassword"
            class="rounded-xl"
            color="black"

            prepend-inner-icon="mdi-lock"
            outlined
            placeholder="Confirm your new password"
            :rules="[$rules.required, rulesRetypePassword]"
            :append-icon="showRetypedPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showRetypedPassword ? 'text' : 'password'"
            @click:append="showRetypedPassword = !showRetypedPassword"
          />
          <v-layout column justify-center align-center class="mt-4">
            <v-btn
              width="90%"
              type="submit"
              :disabled="!valid || loading"
              large
              color="primary"
              depressed
              class="text-none text-h6 pa-5 mb-4 rounded-xl"
            >
              Continue
              <v-icon
                right
              >
                mdi-arrow-right
              </v-icon>
            </v-btn>
            <p class="black--text">
              Return to
              <nuxt-link to="/login">
                <a>
                  Sign In
                </a>
              </nuxt-link>
            </p>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
    <Success v-if="success" />
  </v-layout>
</template>

<script>
import { Alert } from '~/store/alerts'
export default {
  name: 'ForgotPassword',
  data () {
    return {
      success: false,
      sendEmail: false,
      valid: false,
      form: {
        password: '',
        rePassword: ''
      },
      loading: false,
      showPassword: false,
      showRetypedPassword: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      }
    }
  },
  computed: {
    rulesRetypePassword () {
      return (value) => {
        return value === this.form.password || 'Password not the same'
      }
    }
  },
  methods: {
    async sendCode () {
      try {
        await this.$axios.post('/auth/reset-password', this.form)
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: 'Success reset'
        }))
        this.success = true
      } catch (err) {

      }
    }
  }
}
</script>
    <style scoped>
      .main-card {
        border-color: black;
        box-shadow: 10px 10px #1E437B !important;
      }
      .card-icon{
        border-width: medium;
        border-color: #E4DDB9;
      }
    </style>
