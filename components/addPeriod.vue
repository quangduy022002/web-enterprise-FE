<template>
  <v-dialog v-model="dialog" width="60%">
    <v-card class="pa-4">
      <v-form ref="form" v-model="valid" @submit.prevent="signUp()">
        <v-row justify="center" align="center">
          <v-col>
            <v-text-field
              v-model="form.closureDate"
              class="rounded-xl mr-4"
              color="black"
              prepend-inner-icon="mdi-account"
              outlined
              label="Closure Date"
              :rules="[$rules.required]"
            />
            <v-date-picker v-model="form.closureDate" :allowed-dates="allowedDates" />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.finalClosureDate"
              class="rounded-xl mr-4"
              color="black"

              prepend-inner-icon="mdi-account"
              outlined
              label="Final ClosureDate"
              :rules="[$rules.required]"
            />
            <v-date-picker v-model="form.finalClosureDate" :allowed-dates="allowedDates" />
          </v-col>
        </v-row>

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
            Create Period
          </v-btn>
        </v-layout>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { Alert } from '~/store/alerts'

export default {
  name: 'AddPeriod',
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
        closureDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        finalClosureDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        academicYear: ''
      },
      defaultForm: {
        closureDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        finalClosureDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        academicYear: ''
      },
      loading: false,
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
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.$emit('input', val)
      }
    }
  },
  methods: {
    allowedDates: val => parseInt(val.split('-')[2], 10) >= parseInt((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10).split('-')[2], 10),
    async signUp () {
      try {
        this.form.academicYear = this.form.finalClosureDate.slice(0, 4)
        const res = await this.$axios.post('/period/create', this.form)
        this.dialog = false
        this.$emit('updatePeriod', res)
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
