<template>
  <v-layout fill-height align-center justify-center>
    <v-card outlined width="40%" class="d-block justify-center align-center rounded-xl pa-8 main-card" elevation="8" shaped>
      <v-layout column justify-center align-center class="mb-16">
        <v-card outlined rounded="pill" class="card-icon">
          <v-icon size="136" color="error">
            mdi-exclamation-thick
          </v-icon>
        </v-card>
        <h1 class="text-center">
          Forgot your password?
        </h1>
        <p>That a tragic! Please, enter your email and there will be a mail for you to reset password.</p>
      </v-layout>

      <v-card-text>
        <v-form v-model="valid">
          <p class="font-weight-black">
            Email Address
          </p>
          <v-text-field
            v-model="form.email"
            class="rounded-xl"
            color="black"
            background-color="primary"
            prepend-inner-icon="mdi-email-outline"
            solo
            placeholder="e.g. boybadluck@fpt.edu.vn"
            :rules="[$rules.required, $rules.email]"
          />
          <v-layout column justify-center align-center class="mt-16">
            <v-btn
              width="90%"
              type="submit"
              :disabled="!valid || loading"
              large
              color="#DC4E56"
              depressed
              class="text-none text-h6 pa-5 primary--text mb-4 rounded-xl"
            >
              Send Email
              <v-icon
                right
              >
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data () {
    return {
      valid: false,
      form: {
        email: undefined
      },
      loading: false,
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
        const res = await this.$axios.post('auth/send-code', this.form)
        console.log(res)
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
