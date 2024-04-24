<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <add-period v-model="dialog" @update="updatePeriod" />
    <div class="text-h1 mb-8">
      {{ `Hello ${$auth.user.firstName}` }}
    </div>
    <div class="text-h2 mb-4">
      Analysis
    </div>
    <v-row justify="center" align="center">
      <v-col>
        <PieChart :posts="filteredData" />
      </v-col>
      <v-col>
        <LineChartComponent :posts="data" :periods="periods" />
      </v-col>
    </v-row>
    <div class="text-h2 my-5">
      Post
    </div>
    <v-card>
      <v-card-title class="d-flex align-center justify-lg-space-between">
        <v-select
          v-model="period"
          :items="periods"
          outlined
          single-line
          style="max-width:200px;"
          class="shrink rounded-lg"
          hide-details
          placeholder="Filter by Year"
        >
          <template #selection="data">
            <!-- HTML that describe how select should render selected items -->
            {{ getPeriod(data.item.closureDate, data.item.finalClosureDate) }}
          </template>
          <template #item="data">
            <!-- HTML that describe how select should render items when the select is open -->
            {{ getPeriod(data.item.closureDate, data.item.finalClosureDate) }}
          </template>
        </v-select>
        <v-text-field
          v-model="search"
          class="rounded-lg"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          outlined
          style="max-width:500px;"
          hide-details
        />
        <div class="d-flex align-center" style="gap: 5px">
          <v-btn
            v-if="$auth.user.roles.name <= 2"
            color="primary"
            :disabled="!selectedRows.length"
            x-large
            class="ml-2 text-none rounded-lg"
            @click="handleDownloadAll"
          >
            Download
          </v-btn>
          <v-btn v-if="$auth.user.roles.name === 1" color="primary" x-large class="ml-2 text-none rounded-lg" @click="addPeriod">
            Add Period
          </v-btn>
          <v-btn v-if="$auth.user.roles.name === 4" to="/add-post" color="primary" x-large class="ml-2 text-none rounded-lg">
            Add a post
          </v-btn>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredData"
        item-key="_id"
        show-select
      >
        <template #header.data-table-select>
          <v-checkbox
            :on-icon="'mdi-checkbox-marked-outline'"
            :off-icon="'mdi-checkbox-blank-outline'"
            color="#0C1153"
            @click="handleSelectAll"
          />
        </template>
        <template #item.data-table-select="{ item }">
          <v-checkbox
            v-model="selectedRows"
            :on-icon="'mdi-checkbox-marked-outline'"
            :off-icon="'mdi-checkbox-blank-outline'"
            color="#0C1153"
            multiple
            :value="item"
          />
        </template>
        <template #item.id="{item}">
          <p class="mb-0 styleHover" @click="handleClick(item)">
            {{ item.id }}
          </p>
        </template>
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
          <v-menu
            v-if="(item.status.name !== 'Approved' && $auth.user.roles.name === 4) || $auth.user.roles.name !== 4"
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
              <v-list-item v-if="item.status.name === 'Approved' && ($auth.user.roles.name <= 2)" @click="publishItem(item)">
                <v-list-item-title>
                  <v-icon
                    class="mr-2"
                  >
                    mdi-publish
                  </v-icon>{{ !item.publish ? 'Publish Post' : 'Unpublish Post' }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="$auth.user.roles.name === 1 || $auth.user.roles.name === 2" @click="downloadItem(item)">
                <v-list-item-title>
                  <v-icon
                    class="mr-2"
                  >
                    mdi-download
                  </v-icon>Download
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
import JSZip from 'jszip'
import { Alert } from '~/store/alerts'
import '~/plugins/filesave.js'
export default {
  layout: 'account',
  data () {
    return {
      periods: [],
      period: {},
      dialog: false,
      search: '',
      headers: [
        {
          text: 'Student name',
          value: 'author.fullName',
          sortable: false
        },
        { text: 'Faculty', value: 'author.faculty.name', sortable: true },
        { text: 'Post Id', value: 'id', sortable: false },
        { text: 'Email', value: 'author.email', sortable: false },
        { text: 'Detail Post', value: 'name', sortable: false },
        { text: 'Post status', value: 'status.name', sortable: false },
        { text: 'Year', value: 'period.academicYear', sortable: false },
        { text: 'Publish', value: 'publish', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      data: [],
      item: undefined,
      selectAll: false,
      selectedRows: []
    }
  },
  computed: {
    filteredData () {
      const searchTerm = this.search.toLowerCase()
      const yearFilter = this.period ? this.period.academicYear : ''

      return this.data.filter((item) => {
        const detailPostMatch = item.name.toLowerCase().includes(searchTerm)
        const yearMatch = item.period.academicYear.includes(yearFilter)

        if (!searchTerm && !yearFilter) {
          return true
        }

        if (searchTerm && !yearFilter) {
          return detailPostMatch
        }

        if (!searchTerm && yearFilter) {
          return yearMatch
        }

        return detailPostMatch && yearMatch
      })
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
    updatePeriod (item) {
      this.periods.push(item.data)
    },
    downloadItem (item) {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
      const acceptedExtensions = ['.pdf', '.doc', '.docx']
      const filesPdf = []
      let image = ''
      item.files.forEach((file) => {
        acceptedExtensions.forEach((extension) => {
          if (file.toLowerCase().includes(extension)) {
            filesPdf.push(file)
          }
        })
        imageExtensions.forEach((extension) => {
          if (file.toLowerCase().includes(extension)) {
            image = file
          }
        })
      })
      const zip = new JSZip()
      const img = zip.folder('images')
      img.file('img.png', image)
      const pdf = zip.folder('pdf')
      if (filesPdf.length) {
        filesPdf.forEach((file) => {
          const fileNameWithParams = file.split('?')[0]
          pdf.file(fileNameWithParams.substring(fileNameWithParams.lastIndexOf('/') + 1), file)
        })
      }
      zip.generateAsync({
        type: 'blob'
      }).then(function (content) {
        saveAs(content, `${item.id}.zip`)
      })
    },
    async handleDownloadAll () {
      const zip = new JSZip()
      const images = []
      const variousFiles = []
      await Promise.all(this.selectedRows.map(async (item) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
        const acceptedExtensions = ['.pdf', '.doc', '.docx']

        // eslint-disable-next-line array-callback-return, require-await
        await Promise.all(item.files.map(async (file) => {
          if (imageExtensions.some(ext => file.toLowerCase().includes(ext))) {
            images.push(file)
          } else if (acceptedExtensions.some(ext => file.toLowerCase().includes(ext))) {
            variousFiles.push(file)
          }
        }))

        if (images.length > 0) {
          const img = zip.folder('images')
          images.forEach((image, index) => {
            img.file(`${this.extractFileName(image)}_${index + 1}.png`, image)
          })
        }

        if (variousFiles.length > 0) {
          const various = zip.folder('various_files')
          variousFiles.forEach((file) => {
            various.file(`${this.extractFileName(file)}`, file)
          })
        }
      }))

      zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, 'selected_files.zip')
      })
    },
    extractFileName (url) {
      const segments = url.split('/')

      const lastSegment = segments[segments.length - 1]

      const fileName = lastSegment.split('?')[0]

      return fileName
    },
    getPeriod (closureDate, finalClosureDate) {
      const result = closureDate + ' -> ' + finalClosureDate
      return result // Output: 2024-04 -> 2025-12
    },
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

      this.$store.commit('alerts/add', new Alert(this, {
        type: 'success',
        icon: 'check',
        message: 'Successful'
      }))
    },
    async publishItem (item) {
      await this.$axios.patch(`/submission/publish/${item.id}`, {
        publish: !item.publish
      })
      item.publish = !item.publish

      this.$store.commit('alerts/add', new Alert(this, {
        type: 'success',
        icon: 'check',
        message: 'Successful'
      }))
    },
    handleClick (value) {
      this.$router.push(`/post/${value.id}`)
    },
    handleSelectAll () {
      this.selectAll = !this.selectAll

      if (this.selectAll) {
        this.selectedRows = this.data
      } else {
        this.selectedRows = []
      }
    }
  }
}
</script>
<style scoped lang="scss">
.styleHover {
  cursor: pointer;
  transition: all .1s;
  &:hover {
    font-weight: 700;
    color: #004D85;
  }
}
</style>
