<template>
  <v-layout fill-height align-center justify-center>
    <v-card outlined width="40%" class="d-block justify-center align-center rounded-xl pa-8" elevation="8" shaped>
      <v-layout column justify-center align-center class="">
        <v-img src="/logo.png" width="132" height="119" class="mb-4" />
        <h1 class="text-center">
          Sign Up
        </h1>
      </v-layout>

      <v-card-text>
        <v-form v-model="valid" @submit="signUp()">
          <v-row no-gutters>
            <v-text-field
              v-model="form.firstName"
              class="rounded-xl mr-4"
              color="black"
              background-color="primary"
              prepend-inner-icon="mdi-account"
              solo
              placeholder="First Name"
              :rules="[$rules.required]"
            />
            <v-text-field
              v-model="form.lastName"
              class="rounded-xl ml-4"
              color="black"
              background-color="primary"
              prepend-inner-icon="mdi-account"
              solo
              placeholder="Last Name"
              :rules="[$rules.required]"
            />
          </v-row>

          <v-text-field
            v-model="form.email"
            class="rounded-xl"
            color="black"
            background-color="primary"
            prepend-inner-icon="mdi-account"
            solo
            placeholder="Email"
            :rules="[$rules.required, $rules.email]"
          />
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
          <v-text-field
            v-model="form.retypedPassword"
            class="rounded-xl"
            color="black"
            background-color="primary"
            prepend-inner-icon="mdi-lock"
            solo
            placeholder="Confirm Password"
            :rules="[$rules.required, rulesRetypePassword]"
            :append-icon="showRetypedPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showRetypedPassword ? 'text' : 'password'"
            @click:append="showRetypedPassword = !showRetypedPassword"
          />
          <v-layout align-center class="mb-6 accent--text">
            Already have account?
            <v-btn to="/Login" plain class="ma-0 pa-0 accent--text">
              Login
            </v-btn>
          </v-layout>
          <v-layout column justify-center align-center>
            <v-btn
              width="90%"
              large
              :disabled="!valid || loading"
              type="submit"
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
        password: undefined,
        retypedPassword: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined
      },
      loading: false,
      showPassword: false,
      showRetypedPassword: false
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
    async signUp () {
      try {
        const res = await this.$axios.post('api/auth/create-account', this.form)
        await this.$auth.setToken('local', 'Bearer ' + res.data.token)
      } catch (err) {

      }
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
