<template>
  <v-layout fill-height align-center justify-center>
    <v-card outlined width="30%" class="d-block justify-center align-center rounded-xl pa-8" elevation="8" shaped>
      <v-layout column justify-center align-center class="">
        <v-img src="/logo.png" width="132" height="119" class="mb-4" />
        <h1 class="text-center primary--text">
          Sign In
        </h1>
      </v-layout>

      <v-card-text>
        <v-form v-model="valid" @submit.prevent="login()">
          <v-text-field
            v-model="form.username"
            class="rounded-xl"
            color="black"
            prepend-inner-icon="mdi-account"
            outlined
            label="Username"
            :rules="[$rules.required]"
          />
          <v-text-field
            v-model="form.password"
            class="rounded-xl"
            color="black"
            prepend-inner-icon="mdi-lock"
            outlined
            label="Password"
            :rules="[$rules.required]"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
          />
          <v-layout justify-space-between align-center class="mb-6 accent--text">
            <v-checkbox hide-details label="Remember me" class="ma-0" color="accent" on-icon="mdi-checkbox-intermediate">
              <template #label>
                <div class="info--text">
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
              color="primary"
              depressed
              class="text-none text-h6 pa-5 white--text mb-4 rounded-xl"
            >
              Sign In
            </v-btn>
            <p>
              Don't have an Account?
              <a href="/login/create-account">
                Register
              </a>
            </p>
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
      try {
        const res = await this.$axios.post('auth/login', this.form)
        await this.$auth.setToken('local', 'Bearer ' + res.data.token)
        await this.$auth.setUser(res.data)
      } catch (err) {

      }
    }
  }
}
</script>
<style scoped>
  .v-card {
    border-color: black;
    box-shadow: 10px 10px black !important;
  }
</style>
