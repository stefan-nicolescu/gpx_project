import {
  CategoryScale,
  Chart as ChartJS,
  CoreScaleOptions,
  Filler,
  Interaction,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Scale,
  Tick,
  Title,
  Tooltip,
} from "chart.js";
import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";
import { useRef } from "react";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  CrosshairPlugin
);

// @ts-ignore
Interaction.modes.interpolate = Interpolate;

interface ChartProps {
  data: any;
  dataDistance: any;
  dataMainPoints: any;
  hoveredPointCoordinates: any;
  setHoveredPointCoordinates: any;
  isShownHoveredPoint: boolean;
  setIsShownHoveredPoint: any;
  // intervalMainPoint: number;
  hoveredPointIndex: number;
  setHoveredPointIndex: any;
  chartElevationMin: number;
  chartElevationMax: number;
  chartElevationStepSize: number;
  chartDistanceMax: number;
  chartDistStepSize: number;
}

export function ChartElevationProfile({
  data,
  dataDistance,
  dataMainPoints,
  hoveredPointCoordinates,
  setHoveredPointCoordinates,
  isShownHoveredPoint,
  setIsShownHoveredPoint,
  // intervalMainPoint,
  hoveredPointIndex,
  setHoveredPointIndex,

  // NOTE: props for optimum (x, y) scale
  chartElevationMin,
  chartElevationMax,
  chartElevationStepSize,
  chartDistanceMax,
  chartDistStepSize,
}: ChartProps) {
  const chartRef = useRef<ChartJS>(null);

  const tickValues = [0, 5000, 100000];
  // for (let i = 0; i <= chartDistanceMax; i += chartDistStepSize) {
  //   tickValues.push(i);
  // }
  // tickValues.push(chartDistanceMax);

  const elevationChartOptions = {
    events: ["mouseout", "mousemove", "mouseenter", "mouseleave"],
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Elevation Profile",
      },
      tooltip: {
        y: 200,
        enabled: true,
        mode: "interpolate",
        intersect: false,
        backgroundColor: "#ffffff",
        bodyColor: "#000000",
        borderColor: "#000000",
        borderWidth: 1,
        cornerRadius: 2,
        callbacks: {
          // to disable the title
          title: function (context: any) {
            return null;
          },
          // format text displayed and callback to display point on map
          label: function (item: any) {
            // console.log("item?.dataIndex: ", item?.dataIndex);

            // NOTE: find the index of the hovered chart data point
            setHoveredPointIndex(item?.dataIndex);
            // NOTE: enable showing the point on the map

            if (isShownHoveredPoint === false) {
              setIsShownHoveredPoint(true);
            }

            let label1 = `${(item?.raw?.x / 1000).toFixed(1)} km`;
            let label2 = `${(item?.raw?.y).toFixed(1)} m`;
            return [label1, label2];
          },
        },
      },
      crosshair: {
        line: {
          color: "#000000",
          width: 0.5,
        },
        sync: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        },
        // TODO: works??
        // snapping: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grace: 0,
        title: {
          display: true,
          text: "Distance (km)",
        },
        suggestedMin: 0,
        suggestedMax: chartDistanceMax,
        max: chartDistanceMax,
        ticks: {
          color: "#555555",
          // count: 11,
          stepSize: chartDistStepSize,
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: number | string,
            index: number,
            ticks: Tick[]
          ) {
            // console.log(tickValue);
            if (typeof tickValue === "number") {
              return (tickValue / 1000).toFixed(0) + " km";
            } else {
              return tickValue;
            }
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Elevation (m)",
        },
        suggestedMin: chartElevationMin,
        suggestedMax: chartElevationMax,
        ticks: {
          color: "#555555",
          count:
            (chartElevationMax - chartElevationMin) / chartElevationStepSize +
            1,
          stepSize: chartElevationStepSize,
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: string | number,
            index: number,
            ticks: Tick[]
          ) {
            return tickValue + " m";
          },
        },
      },
    },
    elements: {
      // NOTE: needed to make the chart smooth
      line: { tension: 0.2 },
    },
    onHover: (event: any, chartElement: any) => {
      // console.log("event: ", event);
      // console.log("Mouseout event occurred.");
      // if (chartElement.length === 0) {
      //   // Mouseout event occurred
      //   console.log("Mouseout event occurred.");
      // }
    },
  };

  const chartData = {
    labels: dataDistance,
    datasets: [
      // NOTE: second dataset just for the points at fixed interval distance
      {
        label: "main-points",
        data: dataMainPoints,
        pointRadius: 7,
        pointBorderWidth: 2,
        pointBorderColor: "#000000",
        pointBackgroundColor: "#f78f07",
      },
      {
        label: "Elevation Profile",
        data: data,
        // NOTE: listed here the only interactions the chart will respond to
        options: {
          events: ["hover"],
        },
        // NOTE: display connecting line between xy points
        showLine: true,
        // NOTE: fill area under the line
        fill: true,
        borderWidth: 3,
        borderColor: "#f78f07",
        backgroundColor: "rgba(245, 211, 166, 0.5)",
        // NOTE: hide points for the line chart
        pointRadius: 0,
        pointBorderColor: "rgba(62, 115, 67, 0)",
        pointBackgroundColor: "rgba(157, 209, 162, 0)",
      },
    ],
  };

  // console.log("hoveredPointCoordinates from Chart: ", hoveredPointCoordinates);

  return (
    <Chart
      type="scatter"
      ref={chartRef}
      data={chartData}
      //@ts-ignore
      options={elevationChartOptions}
    />
  );
}
