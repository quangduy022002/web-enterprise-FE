<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    style="height: 350px; width: 350px;"
  />
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement
)

export default {
  name: 'LineChartComponent',
  components: { Bar },
  props: {
    posts: {
      type: Array,
      default: () => []
    },
    periods: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chartOptions: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }
  },
  computed: {
    chartData () {
      let data = []
      let labels
      if (this.$auth.user.roles.name !== 4 && this.periods.length) {
        labels = this.getMonthsBetweenDates(new Date(this.periods[0].closureDate), new Date(this.periods[0].finalClosureDate))
        const postCounts = this.posts.reduce((counts, post) => {
          const month = new Date(post.createdAt).toLocaleString('en', { month: 'long' })
          const index = labels.indexOf(month)

          if (index !== -1) {
            counts[index]++
          }

          return counts
        }, new Array(labels.length).fill(0))
        data = postCounts
      } else {
        let totalLikes = 0
        let totalFeedBack = 0
        let totalComment = 0
        this.posts.forEach((post) => {
          totalLikes += post.likes.length
          totalFeedBack += post.feedbacks.length
          totalComment += post.comments.length
        })
        data = [totalLikes, totalFeedBack, totalComment]
      }
      return {
        labels: labels ?? [
          'Like',
          'Feedback',
          'Comment'
        ],
        datasets: [{
          data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    }
  },
  methods: {
    getMonthsBetweenDates (startDate, endDate) {
      const months = []
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        months.push(currentDate.toLocaleString('en', { month: 'long' }))
        currentDate.setMonth(currentDate.getMonth() + 1)
      }
      return months
    }
  }
}
</script>
