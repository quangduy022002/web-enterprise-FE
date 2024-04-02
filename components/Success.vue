<template>
  <v-card
    outlined
    width="40%"
    class="d-block justify-center align-center rounded-xl pa-8 main-card"
    elevation="8"
    shaped
  >
    <v-layout column justify-center align-center class="mb-4">
      <v-icon size="136">
        mdi-hand-clap
      </v-icon>
      <h1 class="text-center primary--text">
        Congratulation
      </h1>
      <h4 class="text-center pa-3">
        You have made a new password. Let’s log in with your new password.
      </h4>
    </v-layout>

    <v-card-text>
      <v-layout column justify-center align-center class="mt-4">
        <v-btn
          width="90%"
          type="submit"
          large
          color="primary"
          depressed
          class="text-none text-h6 pa-5 mb-4 rounded-xl"
          @click="$router.push('/login')"
        >
          Log in
          <v-icon right>
            mdi-arrow-right
          </v-icon>
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Success'
}
</script>
<style scoped>
.main-card {
  border-color: black;
  box-shadow: 10px 10px #1E437B !important;
}
</style>
