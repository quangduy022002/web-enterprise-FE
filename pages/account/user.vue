<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <edit-user v-model="dialog" :faculties="faculty" />
    <div class="text-h1 mb-8">
      {{ `Hello ${$auth.user.firstName}` }}
    </div>
    <div v-if="$auth.user.roles.id === 1" class="text-h2 mb-4">
      Analysis
    </div>
    <line-user v-if="$auth.user.roles.id === 1" :faculty="faculty" :users="data" />
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
            v-if="item.roles.id !== 1"
            @click.stop="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template #item.roles.description="{ item }">
          <v-select
            v-if="$auth.user.roles.id === 1"
            v-model="item.roles"
            :items="roles"
            item-text="description"
            return-object
            :disabled="item.roles.id === 1"
            @change="changeRole(item)"
          />
          <div v-else>
            {{ item.roles.description }}
          </div>
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
      faculty: undefined,
      roles: [{ name: 1, id: 1, description: 'Admin' }, { name: 2, id: 2, description: 'Marketing Manager' }, { name: 3, id: 3, description: 'Marketing Coordinator' }, { name: 4, id: 4, description: 'Student' }, { name: 5, id: 5, description: 'Guest' }]
    }
  },
  async fetch () {
    const res = await this.$axios.get('/account/get-all')
    const resFac = await this.$axios.get('/faculty/get-all')
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
    async changeRole (user) {
      try {
        await this.$axios.patch(`/account/update-role/${user.id}`, { roleName: user.roles.name })
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
    },
    async deleteItem (item) {
      await this.$axios.delete(`/account/delete/${item.id}`)
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
