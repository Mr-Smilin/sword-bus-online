/**
 * @file components/main-view/MainView.jsx
 * @description 主要遊戲視圖組件
 */
import React from "react";
import { Box, Typography } from "@mui/material";
import { useLayout } from "../../contexts";
import ExplorationPanel from "./ExplorationPanel";

// 面板類型定義
const MAIN_VIEW_PANELS = {
	EXPLORATION: "exploration",
	TEST: "test",
	// 未來可能的其他面板類型
	// BATTLE: "battle",
	// EVENT: "event"
};

// 面板內容映射
const PANEL_COMPONENTS = {
	[MAIN_VIEW_PANELS.EXPLORATION]: ExplorationPanel,
	[MAIN_VIEW_PANELS.TEST]: () => (
		<Box sx={{ p: 3 }}>
			<Typography variant="h6">測試面板</Typography>
		</Box>
	),
	// 未來其他面板的組件映射
};

const MainView = () => {
	const { mainViewPanel = MAIN_VIEW_PANELS.EXPLORATION } = useLayout();

	// 獲取當前要顯示的面板組件
	const CurrentPanel = PANEL_COMPONENTS[mainViewPanel] || ExplorationPanel;

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				position: "relative",
				overflow: "hidden",
				bgcolor: "background.default",
				borderRadius: 1,
				border: 1,
				borderColor: "divider",
			}}
		>
			<CurrentPanel />
		</Box>
	);
};

export default MainView;
