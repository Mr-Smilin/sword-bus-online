/**
 * @file GameLayout.jsx
 * @description 遊戲布局主組件
 */
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useLayout } from "../contexts";
import Login from "./login/Login";
import AppHeader from "./layout/AppHeader";
import AnimatedNavMenu from "./layout/AnimatedNavMenu";
import MainContent from "./layout/MainContent";

const GameLayout = ({ isDarkMode, onToggleTheme }) => {
	const {
		layoutActions: { switchPanel },
		currentPanel,
		isModalOpen,
	} = useLayout();

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			<AppHeader isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />

			<AnimatedNavMenu
				onMenuSelect={(itemId) => switchPanel(itemId)}
				isDarkMode={isDarkMode}
				onToggleTheme={onToggleTheme}
			/>

			<MainContent />
		</Box>
	);
};

export default GameLayout;
