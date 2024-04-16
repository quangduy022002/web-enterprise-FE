<template>
  <v-container>
    <html-vue ref="htmlVue">
      <post slot="pdf-content" :post="item" />
    </html-vue>
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
        <v-btn v-if="$auth.user.roles.name === 4" to="/add-post" color="primary" x-large class="ml-2">
          Add a post
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        @click:row="handleClick"
      >
        <template #item.status.name="{ item }">
          <v-chip
            :color="getColor(item.status.name)"
            dark
          >
            {{ item.status.name }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-layout>
          <v-icon
            v-if="item.status.name !== 'Approved' && $auth.user.roles.name === 4"
            class="mr-2"
            @click.stop="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="(item.status.name !== 'Approved' && $auth.user.roles.name === 4) || $auth.user.roles.name !== 4"
            class="mr-2"
            @click.stop="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
          </v-layout>
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
      search: '',
      headers: [
        {
          text: 'Student name',
          value: 'author.fullName'
        },
        { text: 'Faculty', value: 'author.faculty.name' },
        { text: 'Post Id', value: 'id' },
        { text: 'Email', value: 'author.email' },
        { text: 'Detail Post', value: 'name' },
        { text: 'Post status', value: 'status.name' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      data: [],
      item: undefined
    }
  },
  async mounted () {
    const res = await this.$axios.get('/submission/submission-list')
    this.data = res.data
    this.data = this.data.map((value) => {
      if (value.author) {
        value.author.fullName = `${value.author?.firstName} ${value.author?.lastName}`
      }

      return value
    })
  },
  methods: {
    getColor (status) {
      if (status === 'Not approved') {
        return 'grey'
      } else if (status === 'Approved') {
        return 'success'
      } else {
        return 'error'
      }
    },
    editItem (item) {
      this.$router.push({ path: '/add-post', query: { id: item.id } })
    },
    async deleteItem (item) {
      await this.$axios.delete(`/submission/remove/${item.id}`)
      const index = this.data.indexOf(item)
      this.data.splice(index, 1)
    },
    handleClick (value) {
      this.$router.push(`/post/${value.id}`)
    }
  }
}
</script>
