<template>
  <v-dialog v-model="dialog">
    <v-card class="pa-4">
      <v-form ref="form" v-model="valid" @submit.prevent="signUp()">
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
          :rules="[$rules.required, $rules.emailTemp]"
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
          v-if="$auth.user.roles.name !== 3"
          v-model="form.faculty"
          :items="items"
          outlined
          class="rounded-xl"
          color="black"
          :rules="[$rules.required]"

          label="Faculty"
        />
        <v-select
          v-if="$auth.user.roles.name !== 3"
          v-model="form.roles"
          :items="roles"
          item-value="value"
          item-text="name"
          outlined
          class="rounded-xl"
          color="black"
          :rules="[$rules.required]"
          label="Role"
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
        </v-layout>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { Alert } from '~/store/alerts'

export default {
  name: 'EditUser',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      valid: false,
      form: {
        username: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        faculty: undefined,
        roles: undefined
      },
      loading: false,
      showPassword: false,
      showRetypedPassword: false,
      items: ['IT', 'Business', 'Design'],
      roles: [
        {
          value: 1,
          name: 'Admin'
        },
        {
          value: 2,
          name: 'Manager'
        },
        {
          value: 3,
          name: 'Coordinator'
        },
        {
          value: 4,
          name: 'Student'
        },
        {
          value: 5,
          name: 'Guest'
        }
      ]
    }
  },
  computed: {
    rulesRetypePassword () {
      return (value) => {
        return value === this.form.password || 'Password not the same'
      }
    },
    dialog: {
      get () {
        return this.value
      },
      set (val) {
        this.$refs.form.reset()
        this.$emit('input', val)
      }
    }
  },
  methods: {
    async signUp () {
      try {
        let res = {}
        if (this.$auth.user.roles.name !== 3) {
          res = await this.$axios.post('/account/createClient', this.form)
        } else {
          res = await this.$axios.post('/account/createStudent', this.form)
        }
        this.dialog = false
        this.$emit('updateUser', res)
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: 'Successful'
        }))
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
