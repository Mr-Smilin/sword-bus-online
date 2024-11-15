/**
 * @file AppHeader.jsx
 * @description 應用程式頂部導航欄，適配新的動畫導航選單
 */
import React from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
	Box,
} from "@mui/material";
import ThemeToggle from "../ThemeToggle";
import { useLayout } from "../../contexts";

/**
 * 應用程式頂部導航欄組件
 * @param {Object} props
 * @param {boolean} props.isDarkMode - 是否為深色模式
 * @param {Function} props.onToggleTheme - 切換主題的回調函數
 */
const AppHeader = ({ isDarkMode, onToggleTheme }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const { isMenuOpen } = useLayout();

	return (
		<AppBar
			position="fixed"
			elevation={isMenuOpen ? 0 : 4}
			sx={{
				width: "100%",
				transition: theme.transitions.create(
					["width", "margin", "box-shadow", "background-color"],
					{
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.standard,
					}
				),
				bgcolor: isMenuOpen
					? "rgba(0, 0, 0, 0.5)"
					: theme.palette.background.default,
				backdropFilter: isMenuOpen ? "blur(10px)" : "none",
			}}
		>
			<Toolbar
				sx={{
					justifyContent: "space-between",
					minHeight: { xs: 56, sm: 64 },
					px: { xs: 2, sm: 3 },
				}}
			>
				<Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{
							mr: 2,
							opacity: isMenuOpen ? 0.7 : 1,
							transition: theme.transitions.create("opacity"),
						}}
					>
						Sword Art Offline
					</Typography>
				</Box>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					{!isMobile && (
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{
								opacity: isMenuOpen ? 0.7 : 1,
								transition: theme.transitions.create("opacity"),
							}}
						>
							{/* 這裡可以添加用戶名稱或其他信息 */}
							歡迎回來，冒險者
						</Typography>
					)}

					<ThemeToggle
						isDarkMode={isDarkMode}
						onToggle={onToggleTheme}
						sx={{
							opacity: isMenuOpen ? 0.7 : 1,
							transition: theme.transitions.create("opacity"),
						}}
					/>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default AppHeader;
