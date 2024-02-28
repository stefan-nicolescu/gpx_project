import L, { LatLng, polyline } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { GpxPolyline } from "./GpxPolyline";
import { useEffect, useState } from "react";
import {
  circleRadiusLarge,
  circleRadiusNormal,
  iconFinish,
  iconStart,
  styleCircleFinish,
  styleCircleHovered,
  styleCircleMilestones,
  styleCircleStartEnd,
  tooltipAsLabel,
} from "./map-style";
import { DefaultView } from "./DefaultView";
import "./map-style.css";

interface GpxMapProps {
  polylinePoints: any;
  trackBounds: any;
  milestones: any[];
  hoveredPointCoordinates: any;
  setHoveredPointCoordinates: any;
  isShownHoveredPoint: boolean;
  setIsShownHoveredPoint: any;
}

export const GpxMap = ({
  polylinePoints,
  trackBounds,
  milestones,
  hoveredPointCoordinates,
  setHoveredPointCoordinates,
  isShownHoveredPoint,
  setIsShownHoveredPoint,
}: GpxMapProps) => {
  // console.log(polylinePoints);

  console.log("milestones", milestones);

  const [startMarkerLatLng, setStartMarkerLatLng] = useState<any>(null);
  const [finishMarkerLatLng, setFinishMarkerLatLng] = useState<any>(null);

  useEffect(() => {
    if (polylinePoints.length > 0) {
      setStartMarkerLatLng(
        new LatLng(
          parseFloat(polylinePoints[0][0]),
          parseFloat(polylinePoints[0][1])
        )
      );

      const lastIndex = polylinePoints.length - 1;
      setFinishMarkerLatLng(
        new LatLng(
          parseFloat(polylinePoints[lastIndex][0]),
          parseFloat(polylinePoints[lastIndex][1])
        )
      );
    }
  }, [polylinePoints]);

  // console.log(polylinePoints);

  const leafletOptions = {
    attributionControl: false, // Disable attribution control
  };

  return (
    <MapContainer center={new LatLng(45, 25)} zoom={7} {...leafletOptions}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="OpenStreetMap"
      />
      {/* ---- gpx track as a polyline ---- */}
      <GpxPolyline
        polylinePoints={polylinePoints}
        trackBounds={trackBounds}
        hoveredPointCoordinates={hoveredPointCoordinates}
        setHoveredPointCoordinates={setHoveredPointCoordinates}
        isShownHoveredPoint={isShownHoveredPoint}
        setIsShownHoveredPoint={setIsShownHoveredPoint}
      />
      {startMarkerLatLng && (
        <CircleMarker
          center={startMarkerLatLng}
          radius={circleRadiusLarge}
          pathOptions={styleCircleStartEnd}
        ></CircleMarker>
      )}
      {finishMarkerLatLng && (
        <CircleMarker
          center={finishMarkerLatLng}
          radius={circleRadiusLarge}
          pathOptions={styleCircleStartEnd}
        ></CircleMarker>
      )}
      {/* ---- points showing fixed distance along the path ---- */}
      {/* TODO: print number of kilometer milestone mark */}
      {milestones.map((data: any, index: number) => {
        return (
          <CircleMarker
            key={`${index}`}
            center={data?.coordinates}
            radius={circleRadiusNormal}
            pathOptions={styleCircleMilestones}
          >
            <Tooltip
              className="tooltip tooltip-milestone"
              permanent={true}
              direction={"right"}
            >
              {`${data?.distance} km`}
            </Tooltip>
          </CircleMarker>
        );
      })}
      {/* ---- point showing what was hovered on the chart ---- */}
      {isShownHoveredPoint && (
        <CircleMarker
          center={hoveredPointCoordinates}
          radius={circleRadiusNormal}
          pathOptions={styleCircleHovered}
        >
          <Tooltip
            className="tooltip tooltip-hovered"
            permanent={true}
            direction={"right"}
          >
            add data here
          </Tooltip>
        </CircleMarker>
      )}
      <DefaultView trackBounds={trackBounds} />
    </MapContainer>
  );
};
