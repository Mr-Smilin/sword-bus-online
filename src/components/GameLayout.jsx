import React, { useState } from "react";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Paper,
	AppBar,
	Toolbar,
	Typography,
} from "@mui/material";
import Login from "./login/Login";
import ThemeToggle from "./ThemeToggle";
import { useGame } from "../contexts/GameContext";

const GameLayout = ({ isDarkMode, onToggleTheme }) => {
	// 在這裡使用 useGame hook 獲取遊戲數據
	const {
		characterStats,
		currentClass,
		selectClass,
		// ... 其他需要的遊戲數據和方法
	} = useGame();

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const drawerWidth = 240;

	if (!isLoggedIn) {
		return (
			<Login
				onLogin={setIsLoggedIn}
				isDarkMode={isDarkMode}
				onToggleTheme={onToggleTheme}
			/>
		);
	}

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			<AppBar
				position="fixed"
				sx={{
					width: `calc(100% - ${drawerWidth}px)`,
					ml: `${drawerWidth}px`,
				}}
			>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Typography variant="h6" noWrap component="div">
						SwordArf Offline
					</Typography>
					<ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
			>
				<Toolbar /> {/* Add spacing for AppBar */}
				<List>
					{["Character", "Inventory", "Skills", "Map"].map((text) => (
						<ListItem button key={text}>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
			</Drawer>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					mt: 8, // Add margin for AppBar
					display: "grid",
					gap: 2,
					gridTemplateColumns: "1fr 1fr",
					gridTemplateRows: "1fr 1fr",
				}}
			>
				<Paper sx={{ p: 2, gridColumn: "1 / 2", gridRow: "1 / 2" }}>
					Character Status
				</Paper>
				<Paper sx={{ p: 2, gridColumn: "2 / 3", gridRow: "1 / 2" }}>
					Equipment
				</Paper>
				<Paper sx={{ p: 2, gridColumn: "1 / 3", gridRow: "2 / 3" }}>
					Battle Log
				</Paper>
			</Box>
		</Box>
	);
};

export default GameLayout;
