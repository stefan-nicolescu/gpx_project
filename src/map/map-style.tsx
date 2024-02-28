import L from "leaflet";

export const iconStart = new L.Icon({
  iconUrl: require("../img/icon_airplane.png"),
  iconRetinaUrl: require("../img/icon_airplane.png"),
  iconSize: [30, 30],
});

export const iconFinish = new L.Icon({
  iconUrl: require("../img/icon_airplane.png"),
  iconRetinaUrl: require("../img/icon_airplane.png"),
  iconSize: [30, 30],
});

export const iconDirectionArrow = new L.Icon({
  iconUrl: require("../img/icon_airplane.png"),
  iconRetinaUrl: require("../img/icon_airplane.png"),
  iconSize: [30, 30],
});

// TODO: radius should be the same independent of zoom level
export const styleCircleMilestones = {
  fillColor: "#f78f07",
  fillOpacity: 1,
  color: "#000000",
  weight: 2,
};

export const styleCircleStartEnd = {
  fillColor: "#f78f07",
  fillOpacity: 1,
  color: "#000000",
  weight: 3,
};

export const styleCircleFinish = {
  fillColor: "#ffffff",
  fillOpacity: 1,
  color: "#000000",
  weight: 2,
};

export const styleCircleHovered = {
  fillColor: "#ffffff",
  fillOpacity: 1,
  color: "#000000",
  weight: 2,
};

export const tooltipAsLabel = {
  borderWidth: "0px",
  backgroundColor: "rgba(0, 0, 0, 0)",
  boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
};

// NOTE: in pixels
export const circleRadiusNormal = 8;
export const circleRadiusLarge = 12;
