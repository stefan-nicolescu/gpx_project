import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Typography } from "@mui/material";
import { format } from "date-fns";

interface TrackDetailsProps {
  trackName: string;
  date: any;
  startName: string;
  endName: string;
  intermediaryNames: string[];
  distance: number;
  totalClimb: number;
  totalDescent: number;
}

export const TrackDetailsPane = ({
  trackName,
  date,
  startName,
  endName,
  intermediaryNames,
  distance,
  totalClimb,
  totalDescent,
}: TrackDetailsProps) => {
  return (
    <>
      <Typography variant={"h5"}>{trackName}</Typography>
      <Typography variant={"h5"}>
        {date ? format(date, "yyyy-MM-dd HH:mm") : "no data info"}
      </Typography>

      <Typography variant={"body1"}>
        {`Distanţa: ${(distance / 1000).toFixed(1)} km`}
      </Typography>
      <Typography variant={"body1"}>{`Total urcat: ${totalClimb}`}</Typography>
      <Typography
        variant={"body1"}
      >{`Total coborat: ${totalDescent}`}</Typography>
      <Typography variant={"body1"}>Panta maxima</Typography>
      <Typography variant={"body1"}>Panta minima</Typography>

      <Timeline position="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              variant="filled"
              sx={{ color: "#f78f07", fillColor: "#f78f07" }}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{startName}</TimelineContent>
        </TimelineItem>
        {intermediaryNames.map((name: string, index: number) => {
          return (
            <TimelineItem key={`${name}-${index}`}>
              <TimelineSeparator>
                <TimelineDot
                  variant="outlined"
                  sx={{ borderColor: "#f78f07" }}
                />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>{name}</TimelineContent>
            </TimelineItem>
          );
        })}
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="filled" />
          </TimelineSeparator>
          <TimelineContent>{endName}</TimelineContent>
        </TimelineItem>
      </Timeline>

      {/* TODO: buton descarca GPX */}
      {/* TODO: buton descarca ca PDF */}
    </>
  );
};
