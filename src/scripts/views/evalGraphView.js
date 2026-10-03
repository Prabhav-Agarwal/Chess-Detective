import ApexCharts from "apexcharts";
import View from "./View";

class EvalGraph {
  #evalGraph = document.querySelector("#eval-graph");
  #options = {
    series: [{ name: "Evaluation", data: [] }],

    chart: {
      type: "area",
      height: "100%",
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false },
      parentHeightOffset: 0,
      sparkline: { enabled: true },
    },

    dataLabels: { enabled: false },
    legend: { show: false },

    stroke: { curve: "straight", width: 1, colors: ["#888"] },

    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        opacityFrom: 1,
        opacityTo: 1,
        // placeholder 50/50 split; replaced with the real zero offset once data arrives
        colorStops: [
          { offset: 0, color: "#ffffff", opacity: 1 },
          { offset: 50, color: "#ffffff", opacity: 1 },
          { offset: 50, color: "#000000", opacity: 1 },
          { offset: 100, color: "#000000", opacity: 1 },
        ],
      },
    },

    markers: { size: 0, hover: { size: 5 } },

    grid: {
      show: false,
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
    },

    xaxis: {
      type: "numeric",
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      crosshairs: { show: true },
      min: 0,
      max: 36,
    },

    yaxis: { show: false, min: -5, max: 5 },

    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: "#888",
          borderWidth: 1,
          strokeDashArray: 0,
        },
      ],
    },

    tooltip: {
      enabled: true,
      theme: "dark",
      intersect: false,
      x: { formatter: (v) => `Move ${v}` },
      y: {
        formatter: (v) => (v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)),
        title: { formatter: () => "Eval" },
      },
      fixed: { enabled: false },
    },
  };
  #chart;
  constructor() {
    this.#chart = new ApexCharts(this.#evalGraph, this.#options);
    this.#chart.render();
  }

  updateOptions(sample) {
    const data = sample.map((v, i) => [i, v]);

    const top = Math.max(...sample, 0);
    const bottom = Math.min(...sample, 0);
    const p = (top / (top - bottom)) * 100;

    chart.render().then(() =>
      chart.updateOptions({
        series: [{ data }],
        fill: {
          gradient: {
            colorStops: [
              { offset: 0, color: "#ffffff", opacity: 1 },
              { offset: p, color: "#ffffff", opacity: 1 },
              { offset: p, color: "#000000", opacity: 1 },
              { offset: 100, color: "#000000", opacity: 1 },
            ],
          },
        },
      }),
    );
  }
}

export default new EvalGraph();

/* const sample = [
  0.23, 0.43, 0.28, 0.3, 0.02, 0.12, 0.05, 0.35, 0.28, 0.22, 0.11, 0.3, 0.13,
  0.02, -1.85, 0.14, -0.49, -0.46, -0.46, -0.45, -0.76, -0.87, -3.85, -4.2, -5,
  -3.23, -3.35, 0.22, 0.1, 4.05, 4.5, 4.75, 4.54, 5, 5, 5, 5,
]; */
