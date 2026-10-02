import ApexCharts from "apexcharts";

const options = {
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

export const chart = new ApexCharts(
  document.querySelector("#eval-graph"),
  options,
);
