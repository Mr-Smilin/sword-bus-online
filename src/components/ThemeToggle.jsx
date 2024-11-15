/**
 * @file ThemeToggle.jsx
 * @description 主題切換按鈕組件
 */
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

/**
 * 主題切換按鈕組件
 * @param {Object} props
 * @param {boolean} props.isDarkMode - 是否為深色模式
 * @param {Function} props.onToggle - 切換主題的回調函數
 * @param {Object} props.sx - MUI sx 樣式屬性
 */
const ThemeToggle = ({ isDarkMode, onToggle, sx = {} }) => {
	const handleClick = (event) => {
		onToggle(event);
	};

	return (
		<Tooltip title={isDarkMode ? "切換至亮色主題" : "切換至暗色主題"} arrow>
			<IconButton
				data-theme-toggle
				onClick={handleClick}
				color="inherit"
				sx={{
					ml: 1,
					"&:hover": {
						bgcolor: (theme) =>
							theme.palette.mode === "dark"
								? "rgba(255, 255, 255, 0.08)"
								: "rgba(0, 0, 0, 0.04)",
					},
					...sx,
				}}
			>
				{isDarkMode ? (
					<Brightness7Icon fontSize="small" />
				) : (
					<Brightness4Icon fontSize="small" />
				)}
			</IconButton>
		</Tooltip>
	);
};

export default ThemeToggle;
