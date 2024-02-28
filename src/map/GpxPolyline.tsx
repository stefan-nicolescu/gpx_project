import L, { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { Marker, Polyline, Popup, useMap, useMapEvents } from "react-leaflet";
import { iconStart } from "./map-style";

interface PolylineProps {
  polylinePoints: any;
  trackBounds: any;
  hoveredPointCoordinates: any;
  setHoveredPointCoordinates: any;
  isShownHoveredPoint: boolean;
  setIsShownHoveredPoint: any;
}

export const GpxPolyline = ({
  polylinePoints,
  trackBounds,
  hoveredPointCoordinates,
  setHoveredPointCoordinates,
  isShownHoveredPoint,
  setIsShownHoveredPoint,
}: PolylineProps) => {
  // NOTE: the useMap hook allow the child to change the parent
  const map = useMap();

  // const handleMouseOver = () => {
  //   console.log("hovered");

  //   // get the coordinates hovered
  //   // find the closest point amongst polylinePOints
  //   // pass the distance and elevation data here
  //   // create a marker
  //   // include in tooltip info on the distance & elevation for the found poin
  // };

  // console.log("polylinePoints: ", polylinePoints);

  // !!!! nu e ok pentru ca punctele sunt prea apropiate
  const handleMouseOver = (event: any) => {
    setIsShownHoveredPoint(true);

    // Get the coordinates hovered
    const { lat, lng } = event.latlng;

    // console.log("lat: ", lat);
    // console.log("lng: ", lng);

    const hoveredIndex = polylinePoints.filter((item: any) => {
      // console.log("item: ", item);
      return parseFloat(item[0]) === lat && parseFloat(item[1]) === lng;
    });

    console.log("hoveredIndex:", hoveredIndex);

    if (hoveredIndex > -1) {
      // setIsShownHoveredPoint(true)
    }

    setHoveredPointCoordinates([lat, lng]);

    // TODO: propagare index catre GpxPage si catre Chart

    // setHoveredLatLng([lat, lng]);

    // console.log("lat:", lat);
    // console.log("lng:", lng);

    // Find the closest point amongst polylinePoints
    // For simplicity, let's just use the first point as an example
    // const closestPoint = polylinePoints[0];

    // Pass the distance and elevation data here (replace with your own logic)
    // const distance = calculateDistance(closestPoint, { lat, lng });
    // const elevation = closestPoint.elevation; // Replace with actual elevation value

    // Create a marker
    // const renderMarker = () => (
    //   <Marker position={[lat, lng]}>
    //     <Popup>
    //       <div>
    //         <p>test</p>
    //         {/* <p>Distance: {distance} meters</p>
    //         <p>Elevation: {elevation} meters</p> */}
    //       </div>
    //     </Popup>
    //   </Marker>
    // );

    // Remove existing marker before adding a new one (optional)
    // map.eachLayer((layer) => {
    //   if (layer instanceof L.Marker) {
    //     layer.remove();
    //   }
    // });

    // Add the marker to the map
    // marker.addTo(map);
  };

  // const onMapLoad = useMapEvents({
  //   load() {
  //     console.log("loaded");
  //   },
  // });

  const handleMouseOut = (event: any) => {
    // setIsShownHoveredPoint(false);
    // console.log("hovered outside");
  };

  useEffect(() => {
    // NOTE: only execute the fitBounds when the trackBounds prop arrives
    if (trackBounds && Array.isArray(trackBounds) && trackBounds.length > 0) {
      map.fitBounds(trackBounds);
    }
  }, [trackBounds]);

  // const startMarkerLatLng = new LatLng(
  //   parseFloat("46.7691060"),
  //   parseFloat("23.6326750")
  // );

  // const startMarker = (
  //   <Marker position={hoveredLatLng} icon={startIcon} alt="start">
  //     <Popup>Start</Popup>
  //   </Marker>
  // );

  return (
    <>
      <Polyline
        pathOptions={{ color: "#eb7a23", weight: 3 }}
        positions={polylinePoints}
        eventHandlers={{ mouseover: handleMouseOver, mouseout: handleMouseOut }}
      />
      {/* {isHoveringPolyline && startMarker} */}
    </>
  );
};
