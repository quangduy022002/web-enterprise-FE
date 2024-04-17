<template>
  <v-container>
    <v-card flat class="d-block justify-center align-center rounded-xl pa-8">
      <v-layout column justify-center align-center class="">
        <v-img src="/logo.png" width="132" height="119" class="mb-4" />
        <h1 class="text-center">
          {{ $auth.user.email }}
        </h1>
      </v-layout>

      <v-card-text>
        <v-form v-model="valid" @submit.prevent="signUp()">
          <v-text-field
            v-model="$auth.user.username"
            class="rounded-xl"
            color="black"

            prepend-inner-icon="mdi-account"
            outlined
            label="Username"
            :rules="[$rules.required]"
            disabled
          />
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
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'AccountSetting',
  layout: 'account',
  data () {
    return {
      valid: false,
      form: {
        firstName: undefined,
        lastName: undefined,
        dob: undefined,
        phone: undefined,
        address: undefined,
        avatar: undefined
      },
      loading: false,
      showPassword: false,
      showRetypedPassword: false,
      items: ['IT', 'Business', 'Design']
    }
  },
  created () {
    Object.keys(this.form).forEach((key) => {
      this.form[key] = this.$auth.user[key]
    })
  },
  methods: {
  }
}
</script>
