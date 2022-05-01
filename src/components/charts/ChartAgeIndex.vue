<template>
  <div class="chart">
    <GChart type="LineChart" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
export default {
  name: "ChartAgeIndex",
  components: {
    GChart,
  },
  data() {
    return {
      chartData: [
        ["Year", "%"],
        ["2014", 50.1],
        ["2015", 53.4],
        ["2016", 56.9],
        ["2017", 48.8],
      ],
      chartOptions: {
        colors: ["#1387d2"],
        legend: "none",
        bars: "vertical", // Required for Material Bar Charts.
        hAxis: { format: "decimal" },
        height: 300,
        curveType: "function",
        animation: {
          duration: 1000,
          easing: "linear",
          startup: true,
        },
      },
    };
  },
};
</script>

<style></style>
