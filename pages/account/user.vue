<template>
  <v-container>
    <edit-user v-model="dialog" />
    <div class="text-h1 mb-8">
      {{ `Hello ${$auth.user.firstName}` }}
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
        <v-btn v-if="$auth.user.roles.name === 1 || $auth.user.roles.name === 3 " color="primary" x-large class="ml-2" @click="addUser()">
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
      item: undefined
    }
  },
  async mounted () {
    const res = await this.$axios.get('/account/get-all')
    this.data = res.data
  },
  methods: {
    addUser () {
      this.dialog = true
    },
    async deleteItem (item) {
      await this.$axios.delete(`/account/delete/${item.id}`)
      const index = this.data.indexOf(item)
      this.data.splice(index, 1)
    }
  }
}
</script>
