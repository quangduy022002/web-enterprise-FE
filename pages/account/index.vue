<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <add-period v-model="dialog" />
    <div class="text-h1 mb-8">
      {{ `Hello ${$auth.user.firstName}` }}
    </div>
    <v-row justify="center" align="center">
      <v-col>
        <pie-chart :posts="data" />
      </v-col>
      <v-col>
        <line-chart-component :posts="data" />
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-select
          v-model="period"
          :items="periods"
          outlined
          class="shrink"
          item-text="academicYear"
          item-value="academicYear"
          hide-details
          placeholder="Filter by Year"
        />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          outlined
          hide-details
        />
        <v-btn v-if="$auth.user.roles.name === 1" color="primary" x-large class="ml-2" @click="addPeriod">
          Add Period
        </v-btn>
        <v-btn v-if="$auth.user.roles.name === 4" to="/add-post" color="primary" x-large class="ml-2">
          Add a post
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        disable-sort
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
        <template #item.publish="{ item }">
          <v-chip
            :color="getColor(item.publish)"
            dark
          >
            {{ item.publish ? "Published" : "Draft" }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <!-- <v-layout>
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
          </v-layout> -->
          <v-menu
            bottom
            :close-on-click="true"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                fab
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

            <v-list class="d-block">
              <v-list-item v-if="item.status.name !== 'Approved' && $auth.user.roles.name === 4" @click="editItem(item)">
                <v-list-item-title>
                  <v-icon
                    class="mr-2"
                  >
                    mdi-pencil
                  </v-icon>Edit Post
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="(item.status.name !== 'Approved' && $auth.user.roles.name === 4) || $auth.user.roles.name !== 4" @click="deleteItem(item)">
                <v-list-item-title>
                  <v-icon

                    class="mr-2"
                  >
                    mdi-delete
                  </v-icon>Delete Post
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="item.status.name === 'Approved' && $auth.user.roles.name !== 4" @click="publishItem(item)">
                <v-list-item-title>
                  <v-icon
                    class="mr-2"
                  >
                    mdi-publish
                  </v-icon>{{ !item.publish ? 'Publish Post' : 'Unpublish Post' }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
      periods: [],
      period: '',
      dialog: false,
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
        { text: 'Publish', value: 'publish' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      data: [],
      item: undefined
    }
  },
  async mounted () {
    const res = await this.$axios.get('/submission/submission-list')
    const resPeriod = await this.$axios.get('/period/list')
    this.data = res.data
    this.periods = resPeriod.data
    this.data = this.data.map((value) => {
      if (value.author) {
        value.author.fullName = `${value.author?.firstName} ${value.author?.lastName}`
      }

      return value
    })
  },
  methods: {
    addPeriod () {
      this.dialog = true
    },
    getColor (status) {
      if (status === 'Not approved' || status === false) {
        return 'grey'
      } else if (status === 'Approved' || status === true) {
        return 'success'
      } else {
        return 'error'
      }
    },
    editItem (item) {
      this.$router.push({ path: '/add-post', query: { id: item.id } })
    },
    async deleteItem (item) {
      if (this.$auth.user.roles.name === 4) {
        await this.$axios.delete(`/submission/remove/${item.id}`)
      } else {
        await this.$axios.delete(`/submission/removeByManager/${item.id}`)
      }

      const index = this.data.indexOf(item)
      this.data.splice(index, 1)
    },
    async publishItem (item) {
      await this.$axios.patch(`/submission/publish/${item.id}`, {
        publish: !item.publish
      })
      item.publish = !item.publish
    },
    handleClick (value) {
      this.$router.push(`/post/${value.id}`)
    }
  }
}
</script>
