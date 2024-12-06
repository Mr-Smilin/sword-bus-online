/**
 * @file components/main-view/ExplorationPanel.jsx
 * @description 探索面板組件
 */
import React from "react";
import { Box, Typography } from "@mui/material";
import { useMap } from "../../contexts/MapContext";
import TownInteractions from "../town/TownInteractions";

/**
 * 探索面板組件
 * 根據當前區域類型顯示不同的內容：
 * 1. 城鎮 - 顯示可用的城鎮設施
 * 2. 野外 - 顯示探索和休息選項
 * 3. 迷宮 - 顯示迷宮探索相關內容
 */
const ExplorationPanel = () => {
	const { currentArea, areaProgress } = useMap();

	/**
	 * 渲染城鎮內容
	 */
	const renderTownContent = () => (
		<Box>
			<TownInteractions />
			{/* 未來會加入其他城鎮設施 */}
		</Box>
	);

	/**
	 * 渲染野外內容
	 */
	const renderWildContent = () => {
		const progress = areaProgress[currentArea.id] || {
			currentExploration: 0,
			maxExploration: 0,
		};

		return (
			<Box>
				<Typography variant="h6" gutterBottom>
					探索選項
				</Typography>
				<Typography variant="body2" color="text.secondary" gutterBottom>
					當前探索度：{progress.currentExploration} /{" "}
					{currentArea.maxExploration}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					最高探索度：{progress.maxExploration} / {currentArea.maxExploration}
				</Typography>
				{/* 未來會加入探索和休息按鈕 */}
			</Box>
		);
	};

	/**
	 * 渲染迷宮內容
	 */
	const renderDungeonContent = () => {
		const progress = areaProgress[currentArea.id] || {
			currentExploration: 0,
			maxExploration: 0,
			dungeonExploration: 0,
		};

		return (
			<Box>
				<Typography variant="h6" gutterBottom>
					迷宮探索
				</Typography>
				<Typography variant="body2" color="text.secondary" gutterBottom>
					地域探索度：{progress.dungeonExploration} /{" "}
					{currentArea.maxDungeonExploration}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					累積探索度：{progress.maxExploration} / {currentArea.maxExploration}
				</Typography>
				{/* 未來會加入迷宮探索相關功能 */}
			</Box>
		);
	};

	/**
	 * 根據區域類型渲染對應內容
	 */
	const renderAreaContent = () => {
		switch (currentArea.type) {
			case "town":
				return renderTownContent();
			case "wild":
				return renderWildContent();
			case "dungeon":
				return renderDungeonContent();
			default:
				return null;
		}
	};

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				p: 2,
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			{/* 標題區域 */}
			<Box sx={{ p: 2, flexShrink: 0 }}>
				<Typography variant="h5" gutterBottom>
					{currentArea.name}
				</Typography>
				<Typography variant="body2" color="text.secondary" gutterBottom>
					{currentArea.description}
				</Typography>
			</Box>

			{/* 內容區域 - 允許滾動 */}
			<Box
				sx={{
					flex: 1,
					overflow: "auto",
					px: 2,
					// 滾動陰影效果
					maskImage: "linear-gradient(to bottom, black 90%, transparent)",
					WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent)",
				}}
			>
				{renderAreaContent()}
			</Box>
		</Box>
	);
};

export default ExplorationPanel;
