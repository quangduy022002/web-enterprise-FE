<template>
  <v-layout fill-height align-center justify-center>
    <v-card
      v-if="!sendEmail"
      outlined
      width="40%"
      class="d-block justify-center align-center rounded-xl pa-8 main-card"
      elevation="8"
      shaped
    >
      <v-layout column justify-center align-center class="mb-4">
        <v-card outlined rounded="pill" class="card-icon">
          <v-icon size="136" color="error">
            mdi-exclamation-thick
          </v-icon>
        </v-card>
        <h1 class="text-center primary--text">
          Forgot your password?
        </h1>
        <h4 class="text-center pa-3">
          That a tragic! Please, enter your email and there will be a mail for you to reset password.
        </h4>
      </v-layout>

      <v-card-text>
        <v-form v-model="valid" @submit.prevent="sendCode">
          <p class="font-weight-black primary--text ml-1">
            Email Address
          </p>
          <v-text-field
            v-model="form.email"
            class="rounded-xl"
            color="black"
            prepend-inner-icon="mdi-email-outline"
            outlined
            placeholder="e.g. GCS@fpt.edu.vn"
            :rules="[$rules.required, $rules.email]"
          />
          <v-layout column justify-center align-center class="mt-4">
            <v-btn
              width="90%"
              type="submit"
              :disabled="!valid"
              large
              color="primary"
              depressed
              class="text-none text-h6 pa-5 mb-4 rounded-xl"
            >
              Continue
              <v-icon right>
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
    <PinCode v-if="sendEmail" :email="form.email" />
  </v-layout>
</template>

<script>
import { Alert } from '~/store/alerts'
export default {
  name: 'ForgotPassword',
  data () {
    return {
      sendEmail: false,
      valid: false,
      form: {
        email: undefined
      },
      showPassword: false,
      emailRules: [
        v => !!v || 'Required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      }
    }
  },
  methods: {
    async sendCode () {
      try {
        await this.$axios.post('api/auth/send-code', this.form)
        this.sendEmail = true
      } catch (err) {
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'error',
          message: err?.response?.data?.message
        }))
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

.card-icon {
  border-width: medium;
  border-color: #E4DDB9;
}
</style>
