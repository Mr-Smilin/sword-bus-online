/**
 * @file GameLayout.jsx
 * @description 遊戲布局主組件
 */
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useModalPanel } from "../hooks/useModalPanel";
import Login from "./login/Login";
import AppHeader from "./layout/AppHeader";
import NavigationDrawer from "./layout/NavigationDrawer";
import MainContent from "./layout/MainContent";

const GameLayout = ({ isDarkMode, onToggleTheme }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { selectedPanel, isModalOpen, handlePanelChange, closeModal } =
		useModalPanel("character");

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
			<AppHeader isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />

			<NavigationDrawer
				selectedPanel={selectedPanel}
				onMenuClick={(item) => handlePanelChange(item.id, item.isModal)}
			/>

			<MainContent
				selectedPanel={selectedPanel}
				isModalOpen={isModalOpen}
				onCloseModal={closeModal}
			/>
		</Box>
	);
};

export default GameLayout;
