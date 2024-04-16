<template>
  <div>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      ref="html2Pdf"
      filename="hee hee"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="800px"
    >
      <section slot="pdf-content">
      </section>
    </vue-html2pdf>
  </div>
</template>
<script>
import VueHtml2pdf from 'vue-html2pdf'
export default {
  components: {
    VueHtml2pdf
  },
  methods: {
    /*
            Generate Report using refs and calling the
            refs function generatePdf()
        */
    generateReport () {
      this.$refs.html2Pdf.generatePdf()
    }
  }
}
</script>
