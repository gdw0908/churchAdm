<template>
  <div>
    <canvas id="chart" height="200"></canvas>
    <p class="chart_unit">단위 : (만원)</p>
  </div>
</template>
<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
export default {
  name: 'barChart',
  components: {},
  data() {
    return {
      myChart: null
    };
  }, 
  created() {},
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      const ctx = document.getElementById('chart').getContext('2d');

      let barBg = ctx.createLinearGradient(0, 0, 100, 350);
          barBg.addColorStop(0, '#3CD4D4');
          barBg.addColorStop(1, '#99C7C7');
          // let bar_2 = ctx.createLinearGradient(0, 0, 1, 350);
          // bar_2.addColorStop(0, 'rgba(34,112,112,.12)');
          // bar_2.addColorStop(1, 'rgba(96,170,170,.12)');
          // let bar_3 = ctx.createLinearGradient(0, 0, 1, 350);
          // bar_3.addColorStop(0, 'rgba(60,212,212,.12)');
          // bar_3.addColorStop(1, 'rgba(153,199,199,.12)');

      this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          datasets: [{
            label: '월별 헌금',
            data: [400, 500, 399, 538, 222, 355, 400, 500, 399, 538, 222, 355],
            backgroundColor: [
              barBg,
              // bar_2,
              // bar_3
            ],
          }]
        },
        options: {
          responsive: false,
          scales: {
            x: { 
              display: false, 
            }, 
            y: { 
              display: true,  
            } 
          }
        }
      });
    }
  }
}
</script>