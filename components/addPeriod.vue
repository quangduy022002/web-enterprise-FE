<template>
  <v-dialog v-model="dialog" width="60%">
    <v-card class="pa-4">
      <v-form ref="form" v-model="valid" @submit.prevent="signUp()">
        <v-row justify="center" align="center">
          <v-col>
            <v-menu
              bottom
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="form.closureDate"
                  class="rounded-xl mr-4"
                  color="black"
                  prepend-inner-icon="mdi-account"
                  outlined
                  readonly
                  v-bind="attrs"
                  label="Closure Date"
                  :rules="[$rules.required]"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="form.closureDate" :allowed-dates="allowedDates" />
            </v-menu>
          </v-col>
          <v-col>
            <v-menu
              bottom
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="form.finalClosureDate"
                  class="rounded-xl mr-4"
                  color="black"
                  readonly
                  prepend-inner-icon="mdi-account"
                  outlined
                  v-bind="attrs"
                  label="Final ClosureDate"
                  :rules="[$rules.required]"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="form.finalClosureDate" :allowed-dates="allowedDates" />
            </v-menu>
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
import moment from 'moment'
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
    allowedDates: (val) => {
      const selectedDate = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set hours to midnight for accurate comparison
      return selectedDate >= today
    },
    async signUp () {
      try {
        const closureDate = moment(this.form.closureDate)
        const finalClosureDate = moment(this.form.finalClosureDate)
        const diffInDays = finalClosureDate.diff(closureDate, 'days')
        if (diffInDays > 14) {
          this.$store.commit('alerts/add', new Alert(this, {
            type: 'error',
            message: 'The closure date and final closure date must only be 14 days apart'
          }))
          return
        }
        this.form.academicYear = this.form.finalClosureDate.slice(0, 4)
        const res = await this.$axios.post('/period/create', this.form)
        this.dialog = false
        this.$emit('update', res)
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
