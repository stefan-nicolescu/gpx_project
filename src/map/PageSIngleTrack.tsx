import { Grid } from "@mui/material";
import { XMLParser } from "fast-xml-parser";
import * as geolib from "geolib";
import { LatLng, LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { ChartElevationProfile } from "./ChartElevationProfile";
import { GpxMap } from "./GpxMap";
import { TrackDetailsPane } from "./TrackDetailsPane";
import { generateArray } from "./util";

export type ParsedGpxPoint = {
  "@_lat": string;
  "@_lon": string;
  ele: number;
};

// TODO: de scris/citit din db
const hardcodedTrackDetails = {
  name: "Tura de bicicleta - Titlu Test",
  startLocation: "Localitatea A",
  endLocation: "Localitatea B",
  intermediaryLocations: ["Azuga", "Sinaia", "Busteni", "Predeal"],
};

const urlGpxLarge =
  "https://raw.githubusercontent.com/stefan-nicolescu/tests/main/CETU_50k_2023.gpx";

const urlGpxSmall =
  "https://raw.githubusercontent.com/stefan-nicolescu/tests/main/CETU_7k_2023.gpx";

const urlRideWithGpsTrack1 =
  "https://raw.githubusercontent.com/stefan-nicolescu/tests/main/fundulea_manastirea_114k.gpx";

const urlRideWithGpsTrack2 =
  "https://raw.githubusercontent.com/stefan-nicolescu/tests/main/agnita_100k.gpx";

const urlFagaras =
  "https://raw.githubusercontent.com/stefan-nicolescu/tests/main/fagaras_zarnei_rudarita.gpx";

export const PageSingleTrack = () => {
  // NOTE: needed in order to include lat, lon for each point
  const parserOptions = {
    ignoreAttributes: false,
  };

  const parser = new XMLParser(parserOptions);

  // NOTE: used by the map to render the gpx track
  const [polylinePoints, setPolylinePoints] = useState<LatLngExpression[]>([]);

  const [majorMilestonePoints, setMajorMilestonePoints] = useState<any[]>([]);

  // NOTE: used by the map to fit the gpx track in view
  const [trackBounds, setTrackBounds] = useState<any[]>([]);

  // NOTE: used by the chart for plotting (distance, elevation) as (x, y)
  const [dataDistance, setDataDistance] = useState<number[]>([]);
  const [data, setData] = useState<any[]>([]);

  // NOTE: used by the chart to mark fixed distances
  const [dataMainPoints, setDataMainPoints] = useState<any[]>([]);

  const [startMarkerLatLng, setStartMarkerLatLng] = useState<any>(null);

  // NOTE: used to show hover interactions map > chart and chart > map
  const [hoveredPointCoordinates, setHoveredPointCoordinates] = useState<any>(
    new LatLng(46.77397, 23.6212457)
  );

  const [hoveredPointIndex, setHoveredPointIndex] = useState<number>(0);

  // NOTE: used to show/hide on the map the point being hovered on the chart
  const [isShownHoveredPoint, setIsShownHoveredPoint] =
    useState<boolean>(false);

  const [chartElevationMin, setChartElevationMin] = useState<number>(0);
  const [chartElevationMax, setChartElevationMax] = useState<number>(1000);
  useState<number>(100);
  const [chartElevationStepSize, setChartElevationStepSize] =
    useState<number>(100);

  const [chartDistanceMax, setChartDistanceMax] = useState<number>(0);
  const [chartDistStepSize, setChartDistStepSize] = useState<number>(0);

  const [totalClimbedElevation, setTotalClimbedElevation] = useState<number>(0);
  const [totalDescendedElevation, setTotalDescendedElevation] =
    useState<number>(0);

  const [trackDate, setTrackDate] = useState<any>();

  useEffect(() => {
    const fetchGpxData = async () => {
      try {
        const response = await fetch(urlFagaras);
        const gpxString = await response.text();

        try {
          let xmlAsJsObj = parser.parse(gpxString, true);
          console.log("xmlAsJsObj: ", xmlAsJsObj);

          const date = xmlAsJsObj?.gpx?.metadata?.time;
          console.log("date: ", date);

          // if (date) {
          setTrackDate(date);
          // }

          // @ts-ignore
          const trackCoordinates = xmlAsJsObj?.gpx?.trk?.trkseg?.trkpt.map(
            (point: ParsedGpxPoint) => {
              return [point["@_lat"], point["@_lon"]];
            }
          );
          // console.log("trackCoordinates: ", trackCoordinates);

          // NOTE: convert coordinates to distances between points
          const distances = trackCoordinates.map(
            (coord: any, index: number) => {
              // NOTE: the distance from the first point is 0
              if (index === 0) return 0;
              const distance = geolib.getDistance(
                {
                  latitude: trackCoordinates[index - 1][0],
                  longitude: trackCoordinates[index - 1][1],
                },
                { latitude: coord[0], longitude: coord[1] }
              );
              return distance;
            }
          );
          // console.log("distances: ", distances);

          // NOTE: convert distances (relative between successive points to absolute, from origin)
          const cumulativeDistances = distances.reduce(
            (acc: any, distance: any, index: number) => {
              const cumulative = index === 0 ? 0 : acc[index - 1] + distance;
              return [...acc, cumulative];
            },
            []
          );
          // console.log("cumulativeDistances: ", cumulativeDistances);

          setDataDistance(cumulativeDistances);

          // ----- extract parameters for x axis ticks (distance)
          const maxDistance = Math.max(...cumulativeDistances);
          setChartDistanceMax(maxDistance);
          // console.log("maxDistance: ", maxDistance);

          // NOTE: have more ticks for smaller ranges
          let distStepSize = 0;

          if (maxDistance < 1000) {
            distStepSize = 100;
          } else if (maxDistance < 10000) {
            distStepSize = 1000;
          } else if (maxDistance < 50000) {
            distStepSize = 5000;
          } else {
            distStepSize = 10000;
          }

          setChartDistStepSize(distStepSize);

          const elevationValues = xmlAsJsObj?.gpx?.trk?.trkseg?.trkpt.map(
            (point: ParsedGpxPoint) => {
              return point?.ele;
            }
          );
          console.log("elevationValues: ", elevationValues);

          const deltaElevationValues = elevationValues.map(
            (value: number, index: number) => {
              if (index === 0) {
                return 0;
              } else {
                return value - elevationValues[index - 1];
              }
            }
          );
          console.log("deltaElevationValues: ", deltaElevationValues);

          const totalClimbed = deltaElevationValues
            .filter((value: number) => value > 0)
            .reduce(
              (accumulator: number, currentValue: number) =>
                accumulator + currentValue,
              0
            )
            .toFixed(0);
          setTotalClimbedElevation(totalClimbed);

          const totalDescended = deltaElevationValues
            .filter((value: number) => value < 0)
            .reduce(
              (accumulator: number, currentValue: number) =>
                accumulator + currentValue,
              0
            )
            .toFixed(0);
          setTotalDescendedElevation(totalDescended);

          // ----- extract parameters for y axis ticks (elevation)
          const minElevation = Math.min(...elevationValues);
          const roundedMinElevation = Math.floor(minElevation / 100) * 100;
          setChartElevationMin(roundedMinElevation);

          const maxElevation = Math.max(...elevationValues);
          const roundedMaxElevation =
            (Math.floor(maxElevation / 100) + 1) * 100;
          setChartElevationMax(roundedMaxElevation);

          const range = roundedMaxElevation - roundedMinElevation;

          // NOTE: have more ticks for smaller ranges
          if (range < 100) {
            setChartElevationStepSize(10);
          } else if (range < 500) {
            setChartElevationStepSize(50);
          } else {
            setChartElevationStepSize(100);
          }

          // NOTE: exclude points beyond 50km
          // NOTE: pair distance with elevation into (x,y)
          const xyData = cumulativeDistances
            // .filter((val: number) => val <= endCutoffDistance)
            .map((val: number, index: number) => ({
              x: val,
              y: elevationValues[index],
            }));

          setData(xyData);

          const arr = generateArray(0, maxDistance, distStepSize);
          // console.log("arr: ", arr);

          const extendSearch = 10;

          let extraPoints: any[] = [];
          let indexesClosestFixedDistance: any[] = [];

          arr.forEach((mainDistance: number) => {
            // NOTE: find will return the first encountered point that meets the condition

            const searchCriteria = (point: any) =>
              point?.x >= mainDistance ||
              point?.x >= mainDistance - extendSearch;

            const found = xyData.find(searchCriteria);
            const foundIndex = xyData.findIndex(searchCriteria);

            // console.log("found: ", found);

            if (found) {
              extraPoints.push({ ...found, x: mainDistance });
            }

            if (foundIndex) {
              indexesClosestFixedDistance.push(foundIndex);
            }
          });

          console.log("extraPoints: ", extraPoints);

          setDataMainPoints(extraPoints);

          // console.log(
          //   "indexesClosestFixedDistance: ",
          //   indexesClosestFixedDistance
          // );

          const coordinatesMilestones = trackCoordinates
            .filter((point: any, index: any) =>
              indexesClosestFixedDistance.includes(index)
            )
            .map((item: any, index: number) => {
              console.log("item: ", item);
              return {
                distance: extraPoints[index]?.x / 1000,
                coordinates: new LatLng(
                  parseFloat(item[0]),
                  parseFloat(item[1])
                ),
              };
            });

          // console.log("coordinatesMilestones: ", coordinatesMilestones);

          setMajorMilestonePoints(coordinatesMilestones);

          // console.log("dataMainPoints: ", dataMainPoints);

          let minLatitude = parseFloat(trackCoordinates[0][0]);
          let maxLatitude = parseFloat(trackCoordinates[0][0]);
          let minLongitude = parseFloat(trackCoordinates[0][1]);
          let maxLongitude = parseFloat(trackCoordinates[0][1]);

          // NOTE: iterate over the array of points to find min and max for lat and lon
          for (const [latitude, longitude] of trackCoordinates) {
            const parsedLatitude = parseFloat(latitude);
            const parsedLongitude = parseFloat(longitude);

            if (!isNaN(parsedLatitude)) {
              minLatitude = Math.min(minLatitude, parsedLatitude);
              maxLatitude = Math.max(maxLatitude, parsedLatitude);
            }

            if (!isNaN(parsedLongitude)) {
              minLongitude = Math.min(minLongitude, parsedLongitude);
              maxLongitude = Math.max(maxLongitude, parsedLongitude);
            }
          }

          if (trackCoordinates.length > 0) {
            setStartMarkerLatLng(
              new LatLng(
                parseFloat(trackCoordinates[0][0]),
                parseFloat(trackCoordinates[0][1])
              )
            );
          }

          setPolylinePoints(trackCoordinates);

          setTrackBounds([
            [minLatitude, minLongitude],
            [maxLatitude, maxLongitude],
          ]);
        } catch (err) {
          console.log("Error parsing GPX: ", err);
        }
      } catch (error) {
        console.error("Error fetching GPX:", error);
      }
    };

    fetchGpxData();
  }, []);

  //  ----- for logging states ------

  useEffect(() => {
    // console.log("hoveredPointCoordinates: ", hoveredPointCoordinates);
    // console.log("isShownHoveredPoint: ", isShownHoveredPoint);
    // console.log("hoveredPointIndex: ", hoveredPointIndex);
    // console.log("polylinePoints: ", polylinePoints);
  }, [
    isShownHoveredPoint,
    hoveredPointIndex,
    hoveredPointCoordinates,
    polylinePoints,
  ]);

  //  ----- for logging states ------

  // NOTE: when the hovered chart point index changes, update the coordinates
  useEffect(() => {
    if (hoveredPointIndex > -1 && isShownHoveredPoint === true) {
      const hoveredPointCoord = polylinePoints[hoveredPointIndex];
      // console.log("hoveredPointCoord: ", hoveredPointCoord);

      setHoveredPointCoordinates(
        new LatLng(
          // @ts-ignore
          parseFloat(hoveredPointCoord[0]),
          // @ts-ignore
          parseFloat(hoveredPointCoord[1])
        )
      );
    }
  }, [hoveredPointIndex, isShownHoveredPoint]);

  return (
    <Grid container spacing={2} sx={{ height: "900px" }}>
      <Grid item xs={4} sx={{ border: "1px solid red" }}>
        <TrackDetailsPane
          trackName={hardcodedTrackDetails?.name}
          date={trackDate}
          startName={hardcodedTrackDetails?.startLocation}
          endName={hardcodedTrackDetails?.endLocation}
          intermediaryNames={hardcodedTrackDetails?.intermediaryLocations}
          distance={chartDistanceMax}
          totalClimb={totalClimbedElevation}
          totalDescent={totalDescendedElevation}
        />
      </Grid>
      <Grid item xs={8} container>
        <Grid
          item
          xs={12}
          sx={{ height: "650px", border: "1px solid #000000" }}
        >
          <GpxMap
            polylinePoints={polylinePoints}
            trackBounds={trackBounds}
            milestones={majorMilestonePoints}
            hoveredPointCoordinates={hoveredPointCoordinates}
            setHoveredPointCoordinates={setHoveredPointCoordinates}
            // startMarkerLatLng={startMarkerLatLng}
            isShownHoveredPoint={isShownHoveredPoint}
            setIsShownHoveredPoint={setIsShownHoveredPoint}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ height: "350px", border: "1px solid #000000" }}
        >
          <ChartElevationProfile
            data={data}
            dataDistance={dataDistance}
            dataMainPoints={dataMainPoints}
            // --- hover
            hoveredPointCoordinates={hoveredPointCoordinates}
            setHoveredPointCoordinates={setHoveredPointCoordinates}
            isShownHoveredPoint={isShownHoveredPoint}
            setIsShownHoveredPoint={setIsShownHoveredPoint}
            hoveredPointIndex={hoveredPointIndex}
            setHoveredPointIndex={setHoveredPointIndex}
            // --- hover

            // intervalMainPoint={intervalMainPoint}
            chartElevationMin={chartElevationMin}
            chartElevationMax={chartElevationMax}
            chartElevationStepSize={chartElevationStepSize}
            chartDistanceMax={chartDistanceMax}
            chartDistStepSize={chartDistStepSize}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
