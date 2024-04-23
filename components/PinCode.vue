<template>
  <v-card outlined width="40%" class="d-block justify-center align-center rounded-xl pa-8 main-card" elevation="8" shaped>
    <v-layout column justify-center align-center class="mb-4">
      <v-img src="/logo.png" width="132" height="119" class="mb-4" />
      <h1 class="text-center primary--text">
        Verify your email address
      </h1>
      <h4 class="text-center pa-3">
        Please enter the one-time verification code sent to
      </h4>
    </v-layout>

    <v-card-text>
      <v-form v-model="valid" @submit.prevent="sendCode()">
        <p class="font-weight-black text-center">
          {{ email }}
        </p>
        <p class="font-weight-black primary--text ml-1">
          Enter Verification Code:
        </p>
        <v-text-field
          v-model="form.code"
          class="rounded-xl"
          color="black"
          prepend-inner-icon="mdi-lock"
          outlined
          placeholder="PIN"
          :rules="[$rules.required]"
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
            Submit
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
</template>

<script>
import { Alert } from '~/store/alerts'
export default {
  name: 'PinCode',
  props: {
    email: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      valid: false,
      form: {
        code: ''
      },
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v && v.length >= 8) || 'Min 8 characters'
      }
    }
  },
  methods: {
    async sendCode () {
      try {
        this.form.code = Number(this.form.code)
        await this.$axios.post('api/auth/check-code', this.form)
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: 'Code matching'
        }))
        this.$router.push('/ForgotPassword/reset-password')
      } catch (err) {
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'error',
          message: 'Wrong Code'
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
      .card-icon{
        border-width: medium;
        border-color: #E4DDB9;
      }
    </style>
