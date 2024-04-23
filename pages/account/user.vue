<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <edit-user v-model="dialog" />
    <div class="text-h1 mb-8">
      {{ `Hello ${$auth.user.firstName}` }}
    </div>
    <div v-if="this.$auth.user.roles.id === 1" class="text-h2 mb-4">
      Analysis
    </div>
    <line-user :faculty="faculty" :users="data" v-if="this.$auth.user.roles.id === 1" />
    <div class="text-h2 my-5">
      User
    </div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          outlined
          hide-details
        />
        <v-btn v-if="$auth.user.roles.name === 1 || $auth.user.roles.name === 3 " color="primary" x-large class="ml-2 text-none" @click="addUser()">
          Add user
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        disable-sort
      >
        <template #item.actions="{ item }">
          <v-icon
            @click.stop="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import { Alert } from '~/store/alerts'
export default {
  layout: 'account',
  data () {
    return {
      dialog: false,
      search: '',
      headers: [
        { text: 'First name', value: 'firstName' },
        { text: 'Last name', value: 'lastName' },
        { text: 'Faculty', value: 'faculty.name' },
        { text: 'email', value: 'email' },
        { text: 'Username', value: 'username' },
        { text: 'Roles', value: 'roles.description' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      data: [],
      item: undefined,
      faculty: undefined
    }
  },
  async fetch () {
    const res = await this.$axios.get('api/account/get-all')
    const resFac = await this.$axios.get('api/faculty/get-all')
    this.faculty = resFac.data
    if (this.$auth.user.roles.name !== 3) {
      this.data = res.data
    } else {
      this.data = res.data.filter(user => user?.faculty?.id === this.$auth.user.faculty.id && user.roles.id === 4)
    }
  },
  methods: {
    addUser () {
      this.dialog = true
    },
    async deleteItem (item) {
      await this.$axios.delete(`api/account/delete/${item.id}`)
      const index = this.data.indexOf(item)
      this.data.splice(index, 1)
      this.$store.commit('alerts/add', new Alert(this, {
        type: 'success',
        icon: 'check',
        message: 'Successful'
      }))
    }
  }
}
</script>
