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
    chartData(){
      let totalLikes = 0;
      let totalFeedBack = 0;
      let totalComment = 0;
      this.posts.forEach(post => {
        totalLikes += post.likes.length
        totalFeedBack += post.feedbacks.length
        totalComment += post.comments.length
      });
      return {
        labels: [
          'Like',
          'Feedback',
          'Comment'
        ],
        datasets: [{
          data: [totalLikes, totalFeedBack, totalComment],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    }
  }
}
</script>
