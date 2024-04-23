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
    users: {
      type: Array,
      default: () => []
    },
    faculty: {
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
      console.log(this.faculty)
      let data = []
      let labels = []
      if (this.$auth.user.roles.name === 3) {
        this.faculty.forEach((dataFaculty) => {
          labels.push(dataFaculty.name)
          const userFaculty = this.users.filter(user => user.faculty.id === dataFaculty.id)
          data.push(userFaculty.length)
        })
      } else {
        labels = [
          'Student',
          'Coordinator',
          'Marketing',
          'Admin',
          'Guest'
        ]
        let totalStudent = 0
        let totalCoordinator = 0
        let totalMarketing = 0
        let totalAdmin = 0
        let totalGuest = 0
        this.users.forEach((user) => {
          console.log(user)
          if (user.roles.id === 1) { totalAdmin += 1 }
          if (user.roles.id === 2) { totalMarketing += 1 }
          if (user.roles.id === 3) { totalCoordinator += 1 }
          if (user.roles.id === 4) { totalStudent += 1 }
          if (user.roles.id === 5) { totalGuest += 1 }
        })
        data = [totalStudent, totalCoordinator, totalMarketing, totalAdmin, totalGuest]
      }
      return {
        labels,
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
