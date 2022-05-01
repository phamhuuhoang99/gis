<template>
  <div class="chart">
    <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
export default {
  name: "ChartAveragePopulation",
  components: {
    GChart,
  },
  data() {
    return {
      chartData: [
        ["Year", "Persons"],
        ["2014", 1000],
        ["2015", 1170],
        ["2016", 660],
        ["2017", 1030],
      ],
      chartOptions: {
        colors: ["#1387d2"],
        legend: "none",
        bars: "vertical", // Required for Material Bar Charts.
        hAxis: { format: "decimal" },
        height: 300,
        animation: {
          duration: 1200,
          easing: "out",
          startup: true,
        },
      },
    };
  },

  methods: {},
};
</script>

<style></style>
