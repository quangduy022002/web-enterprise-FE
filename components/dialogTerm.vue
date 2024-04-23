<template>
  <div class="text-center">
    <v-dialog v-model="dialog" content-class="rounded-xl">
      <template #activator="{ on, attrs }">
        <slot name="button" :on="on" :attrs="attrs" />
      </template>

      <v-card class="rounded-xl pa-8">
        <slot name="header" />
        <div class="mt-n4 mr-n4 text-end">
          <v-btn icon @click="$emit('click')">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <v-card-title class="pa-0 text-h5 font-weight-bold">
          Term Rules
        </v-card-title>
        <v-card flat>
          <p class="mb-0 my-3 text-subtitle-1">
            Ownership and Rights: By submitting a post to our education platform, you acknowledge that you own the rights to the content or have obtained permission to use it. You offer us a non-exclusive, worldwide, royalty-free licence to use, reproduce, modify, adapt, publish, translate, and distribute the content in any medium and format. This licence lets us display and promote your content on our platform and through our marketing channels. However, you retain all ownership rights to your content, and we will not sell or license it to third parties without your consent.
            Ethical Content Policy: We expect all submitted content to adhere to high ethical standards and respect academic integrity principles. Copyright infringement, deception, fabrication, and other types of academic dishonesty are strongly prohibited. You are responsible for ensuring that your content is original and accurately represents your ideas, research, and opinions. Any violations of this policy may result in your content being removed from our platform and your account being terminated. We reserve the right to take further action, including legal action, to address breaches of ethical content standards.
          </p>
        </v-card>
        <v-card-actions class="d-flex align-center justify-end mt-2">
          <v-btn color="primary" class="text-none" outlined @click="dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'DialogTerm',
  emits: ['click'],
  data () {
    return {
      dialog: false
    }
  }
}
</script>
