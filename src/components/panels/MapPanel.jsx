import React from "react";
import { Paper, Box } from "@mui/material";
import MapView from "../map/MapView";

const MapPanel = () => {
	return (
		<Paper
			elevation={0}
			sx={{
				width: "100%",
				height: "100%",
				p: 2,
				bgcolor: "background.default",
			}}
		>
			<MapView />
		</Paper>
	);
};

export default MapPanel;
