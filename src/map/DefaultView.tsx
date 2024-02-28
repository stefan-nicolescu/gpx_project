import { Button } from "@mui/material";
import { useMap } from "react-leaflet";

interface DefaultViewProps {
  trackBounds: any;
}

export const DefaultView = ({ trackBounds }: DefaultViewProps) => {
  const map = useMap();

  const restoreDefaultView = () => {
    map.fitBounds(trackBounds);
  };

  return (
    <Button
      sx={{
        position: "relative",
        top: "90px",
        left: "10px",
        display: "flex",
        zIndex: 3000,
        backgroundColor: "#f78f07",
      }}
      variant="contained"
      onClick={restoreDefaultView}
    >
      Home
    </Button>
  );
};
