import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1976d2",
		},
		background: {
			default: "#f5f5f5",
			paper: "#ffffff",
		},
	},
});

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#90caf9",
		},
		background: {
			default: "#303030",
			paper: "#424242",
		},
	},
});
