/**
 * @file components/main-view/ExplorationPanel.jsx
 * @description 探索面板組件
 */
import React from "react";
import { Box, Typography } from "@mui/material";
import { useMap } from "../../contexts/MapContext";

const ExplorationPanel = () => {
	const { currentArea } = useMap();

	// 根據區域類型渲染不同的內容
	const renderAreaContent = () => {
		switch (currentArea.type) {
			case "town":
				return (
					<Box>
						{/* 城鎮設施 */}
						<Typography variant="h6">城鎮設施</Typography>
						{/* 商店、看板等內容 */}
					</Box>
				);

			case "wild":
				return (
					<Box>
						{/* 野外探索 */}
						<Typography variant="h6">探索選項</Typography>
						{/* 探索、休息按鈕等 */}
					</Box>
				);

			case "dungeon":
				return (
					<Box>
						{/* 迷宮內容 */}
						<Typography variant="h6">迷宮探索</Typography>
						{/* 迷宮相關內容 */}
					</Box>
				);

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
			}}
		>
			<Typography variant="h5" gutterBottom>
				{currentArea.name}
			</Typography>
			<Typography variant="body2" color="text.secondary" gutterBottom>
				{currentArea.description}
			</Typography>

			{renderAreaContent()}
		</Box>
	);
};

export default ExplorationPanel;
