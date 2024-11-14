/**
 * @file AppHeader.jsx
 * @description 應用程式頂部導航欄
 */
import React from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import ThemeToggle from "../ThemeToggle";
import { useLayout } from "../../contexts";

const AppHeader = ({ isDarkMode, onToggleTheme }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const {
		currentDrawerWidth,
		drawerActions: { handleDrawerToggle },
	} = useLayout();

	return (
		<AppBar
			position="fixed"
			sx={{
				width: { md: `calc(100% - ${currentDrawerWidth}px)` },
				ml: { md: `${currentDrawerWidth}px` },
				transition: (theme) =>
					theme.transitions.create(["margin", "width"], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.standard,
					}),
			}}
		>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				{isMobile && (
					<IconButton
						color="inherit"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
				)}
				<Typography variant="h6" noWrap component="div">
					劍域物語
				</Typography>
				<ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
			</Toolbar>
		</AppBar>
	);
};

export default AppHeader;
