<template>
  <v-layout fill-height align-center justify-center>
    <v-card outlined width="40%" class="d-block justify-center align-center rounded-xl pa-8" elevation="8" shaped>
      <v-layout column justify-center align-center class="">
        <v-img src="/logo.png" width="132" height="119" class="mb-4" />
        <h1 class="text-center">
          Sign In
        </h1>
      </v-layout>

      <v-card-text>
        <v-form v-model="valid" @submit.prevent="login()">
          <v-text-field
            v-model="form.username"
            class="rounded-xl"
            color="black"
            background-color="primary"
            prepend-inner-icon="mdi-account"
            solo
            placeholder="Username"
            :rules="[$rules.required]"
          />
          <v-text-field
            v-model="form.password"
            class="rounded-xl"
            color="black"
            background-color="primary"
            prepend-inner-icon="mdi-lock"
            solo
            placeholder="Password"
            :rules="[$rules.required]"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
          />
          <v-layout justify-space-between align-center class="mb-6 accent--text">
            <v-checkbox hide-details label="Remember me" class="ma-0" color="accent" on-icon="mdi-checkbox-intermediate">
              <template #label>
                <div class="accent--text">
                  Remember me
                </div>
              </template>
            </v-checkbox>
            <v-btn to="/ForgotPassword" plain class="ma-0 pa-0 accent--text">
              Forgot password
            </v-btn>
          </v-layout>
          <v-layout column justify-center align-center>
            <v-btn
              width="90%"
              type="submit"
              :disabled="!valid || loading"
              large
              color="#DC4E56"
              depressed
              class="text-none text-h6 pa-5 primary--text mb-4 rounded-xl"
            >
              Sign In
            </v-btn>
            <v-btn
              width="90%"
              large
              color="#1E437B"
              depressed
              class="text-none text-h6 pa-5 primary--text rounded-xl"
            >
              Create Account
            </v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      valid: false,
      form: {
        username: undefined,
        password: undefined
      },
      loading: false,
      showPassword: false
    }
  },
  methods: {
    async login () {
      const res = await this.$axios.post('auth/login', this.form)
      console.log(res)
    }
  }
}
</script>
<style scoped>
  .v-card {
    border-color: black;
    box-shadow: 10px 10px #1E437B !important;
  }
</style>
