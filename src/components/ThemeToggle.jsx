import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeToggle = ({ isDarkMode, onToggle }) => {
	const handleClick = (event) => {
		onToggle(event);
	};

	return (
		<Tooltip
			title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
		>
			<IconButton
				data-theme-toggle
				sx={{ ml: 1 }}
				onClick={handleClick}
				color="inherit"
			>
				{isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
			</IconButton>
		</Tooltip>
	);
};

export default ThemeToggle;
