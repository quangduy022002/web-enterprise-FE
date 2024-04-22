<template>
  <v-container>
    <v-card flat class="d-block justify-center align-center rounded-xl pa-8">
      <v-layout column justify-center align-center class="">
        <v-file-input id="inputFile" v-model="fileImage" style="visibility: hidden;" />
        <v-badge
          avatar
          bordered
          overlap
          icon="mdi-camera"
        >
          <v-avatar size="132">
            <v-img :src="avatar" @click="editImage" />
          </v-avatar>
        </v-badge>

        <h1 class="text-center">
          {{ $auth.user.email }}
        </h1>
      </v-layout>

      <v-card-text>
        <v-form v-model="valid" @submit.prevent="editProfile()">
          <v-text-field
            v-model="$auth.user.username"
            class="rounded-xl"
            color="black"
            prepend-inner-icon="mdi-account"
            outlined
            label="Username"
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
          <v-text-field
            v-model="form.phone"
            class="rounded-xl"
            color="black"

            prepend-inner-icon="mdi-account"
            outlined
            label="Phone Number"
            :rules="[$rules.phone]"
          />
          <v-text-field
            v-model="form.address"
            class="rounded-xl"
            color="black"

            prepend-inner-icon="mdi-account"
            outlined
            label="Address"
          />
          <v-menu
            bottom
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="form.dob"
                class="rounded-xl"
                color="black"
                prepend-inner-icon="mdi-account"
                outlined
                readonly
                label="Date of birth"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="form.dob" />
          </v-menu>
          <v-layout justify-end>
            <v-btn type="submit" color="primary">
              Save
            </v-btn>
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
      fileImage: undefined,
      loading: false,
      showPassword: false,
      showRetypedPassword: false,
      items: ['IT', 'Business', 'Design']
    }
  },
  computed: {
    avatar () {
      if (this.fileImage) {
        return URL.createObjectURL(this.fileImage)
      } else {
        return this.form.avatar || '/avatar.png'
      }
    }
  },
  created () {
    Object.keys(this.form).forEach((key) => {
      this.form[key] = this.$auth.user[key]
    })
  },
  methods: {
    editImage () {
      document.getElementById('inputFile').click()
    },
    async editProfile () {
      if (this.fileImage) {
        const data = new FormData()
        data.append('files', this.fileImage)
        const res = await this.$axios.post('/medias/upload', data, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`
          }
        })
        this.form.avatar = res.data[0]
      }
      await this.$axios.patch(`/account/update-info/${this.$auth.user.id}`, this.form)
    }
  }
}
</script>
