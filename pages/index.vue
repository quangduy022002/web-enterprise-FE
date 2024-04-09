<template>
  <v-layout fill-height class="overflow-auto">
    <v-app-bar
      absolute
      color="primary"
      elevate-on-scroll
      rounded="b-xl"
      class="pa-2"
      height="88"
    >
      <v-btn to="/" icon class="ml-8">
        <v-img src="/logo.png" width="70" height="64" class="mb-4" />
      </v-btn>
      <v-spacer />
      <v-btn v-if="!$auth.loggedIn" color="#387ADF" large class="mb-2">
        Login
      </v-btn>
      <v-btn v-else to="/account" icon class="mr-4">
        <v-img src="/avatar.png" width="70" height="64" class="mb-4" />
      </v-btn>
    </v-app-bar>
  </v-layout>
</template>
