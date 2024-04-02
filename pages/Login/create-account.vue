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
        <v-form v-model="valid" @submit.prevent="signUp()">
          <v-layout>
            <v-text-field
              v-model="form.firstName"
              class="rounded-xl mr-4"
              color="black"

              prepend-inner-icon="mdi-account"
              outlined
              label="First Name"
              :rules="[$rules.required]"
            />
            <v-text-field
              v-model="form.lastName"
              class="rounded-xl"
              color="black"

              prepend-inner-icon="mdi-account"
              outlined
              label="Last Name"
              :rules="[$rules.required]"
            />
          </v-layout>

          <v-text-field
            v-model="form.email"
            class="rounded-xl"
            color="black"
            prepend-inner-icon="mdi-email"
            outlined
            label="Email"
            :rules="[$rules.required, $rules.email]"
          />
          <v-text-field
            v-model="form.username"
            class="rounded-xl"
            color="black"

            prepend-inner-icon="mdi-account"
            outlined
            label="Username"
            :rules="[$rules.required]"
          />
          <v-select
            :items="items"
            outlined
            class="rounded-xl"
            color="black"
            :rules="[$rules.required]"

            label="Faculty"
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
          <v-text-field
            v-model="form.retypedPassword"
            class="rounded-xl"
            color="black"

            prepend-inner-icon="mdi-lock"
            outlined
            label="Confirm Password"
            :rules="[$rules.required, rulesRetypePassword]"
            :append-icon="showRetypedPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showRetypedPassword ? 'text' : 'password'"
            @click:append="showRetypedPassword = !showRetypedPassword"
          />
          <v-layout column justify-center align-center>
            <v-btn
              width="90%"
              large
              :disabled="!valid || loading"
              type="submit"
              color="primary"
              depressed
              class="text-none text-h6 pa-5 rounded-xl mb-2"
            >
              Create Account
            </v-btn>
            <p class="black--text">
              Already have account?
              <nuxt-link to="/login">
                <a>
                  Login
                </a>
              </nuxt-link>
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
        password: undefined,
        retypedPassword: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined
      },
      loading: false,
      showPassword: false,
      showRetypedPassword: false,
      items: ['IT', 'Business', 'Design']
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
        const res = await this.$axios.post('auth/create-account', this.form)
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
