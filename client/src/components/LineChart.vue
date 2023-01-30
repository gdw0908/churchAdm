<template>
  <div>
    <canvas id="line_chart" width="1490" height="300"></canvas>
    <p class="chart_unit">단위 : (만원)</p>
  </div>
</template>
<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
export default {
  name: 'lineChart',
  components: {},
  data () {
    return {
      lineChart: null
    }
  },
  created () {},
  mounted () {
    this.fillData()
  },
  methods: {
    fillData () {
      const chart = document.getElementById('line_chart').getContext('2d')
      this.lineChart = new Chart(chart, {
        type: 'line',
        data: {
          labels: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
          ],
          datasets: [{
            label: '일별 헌금',
            data: [
              100, 200, 150, 200, 200, 220, 250, 150, 120, 220,
              250, 150, 200, 200, 220, 250, 300, 280, 278, 198,
              250, 150, 200, 200, 220, 250, 300, 280, 278, 198, 240
            ],
            backgroundColor: ['rgba(16, 230, 230, 0.1)'],
            fill: 'start',
            borderColor: ['rgba(16, 230, 230, 0.6)'],
            borderWidth: 1,
            pointBorderColor: '#00D2D2',
            pointBorderWidth: 5
          }]
        },
        options: {
          scales: {
            x: {
              display: true
              // ticks: {
              //   display: true
              // },
            },
            y: {
              display: true,
              ticks: {
                beginAtZero: true,
                tickColor: 'red'
              }
            }
          }
        }
      })
    }
  }
}
</script>
