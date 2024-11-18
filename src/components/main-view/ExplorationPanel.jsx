/**
 * @file components/main-view/ExplorationPanel.jsx
 * @description 探索面板組件
 */
import React from "react";
import { Box, Typography } from "@mui/material";

const ExplorationPanel = () => {
	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Typography variant="h6" color="text.secondary">
				探索區域
			</Typography>
			{/* 未來會加入地圖和角色等元素 */}
		</Box>
	);
};

export default ExplorationPanel;
