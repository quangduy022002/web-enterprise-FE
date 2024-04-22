<template>
  <LineChartGenerator
    :chart-options="chartOptions"
    :chart-data="chartData"
    style="height: 350px; width: 350px;"
  />
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'
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
  components: { LineChartGenerator },
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
    chartData(){
      let totalLikes = 0;
      let totalFeedBack = 0;
      let totalComment = 0;
      this.posts.forEach(post => {
        console.log(post)
      });
      return {
        labels: [
          'Like',
          'Feedback',
          'Comment'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100],
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
