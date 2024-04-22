<template>
  <Pie
    id="my-chart-id"
    :chart-options="chartOptions"
    :chart-data="chartData"
    style="height: 350px; width: 350px;"
  />
</template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default {
  name: 'PieChart',
  components: { Pie },
  props: {
    posts: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chartOptions: {
        responsive: true
      }
    }
  },
  computed: {
    chartData () {
      const denied = this.posts.filter(post => post.status.name === 'Denied')
      const notApproved = this.posts.filter(post => post.status.name === 'Not approved')
      const approved = this.posts.filter(post => post.status.name === 'Approved')
      return {
        labels: [
          'Denied',
          'Not Approved',
          'Approved'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [denied.length, notApproved.length, approved.length],
          backgroundColor: [
            '#E14444',
            '#FFC107',
            '#00E676'
          ],
          hoverOffset: 4
        }]
      }
    }
  },
  mounted () {

  }
}
</script>
