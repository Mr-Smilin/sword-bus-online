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
	useTheme,
	useMediaQuery,
	IconButton,
	ListItemIcon,
	Modal,
} from "@mui/material";
import {
	Menu as MenuIcon,
	Person as PersonIcon,
	Backpack as BackpackIcon,
	AutoAwesome as SkillsIcon,
	Map as MapIcon,
	Close as CloseIcon,
} from "@mui/icons-material";
import Login from "./login/Login";
import ThemeToggle from "./ThemeToggle";
import { useGame } from "../contexts/GameContext";
import { useModalPanel } from "../hooks/useModalPanel";

/**
 * 定義選單項目配置
 * @type {Array<{text: string, id: string, icon: JSX.Element, isModal: boolean}>}
 */
const menuItems = [
	{ text: "角色資訊", id: "character", icon: <PersonIcon />, isModal: false },
	{ text: "背包道具", id: "inventory", icon: <BackpackIcon />, isModal: false },
	{ text: "技能列表", id: "skills", icon: <SkillsIcon />, isModal: false },
	{ text: "地圖", id: "map", icon: <MapIcon />, isModal: true },
];

/**
 * 取得選單項目的樣式
 * @param {string} itemId - 項目ID
 * @param {boolean} isSelected - 是否被選中
 * @param {Theme} theme - Material-UI 主題對象
 * @returns {Object} 樣式對象
 */
const getMenuItemStyle = (itemId, isSelected, theme) => ({
	"&.MuiListItem-root": {
		backgroundColor: isSelected
			? theme.palette.mode === "light"
				? theme.palette.success.light
				: theme.palette.primary.light
			: "transparent",
		color: isSelected
			? theme.palette.mode === "light"
				? theme.palette.success.contrastText
				: theme.palette.primary.contrastText
			: theme.palette.text.primary,
		"&:hover": {
			backgroundColor: isSelected
				? theme.palette.mode === "light"
					? theme.palette.success.light
					: theme.palette.primary.dark
				: theme.palette.mode === "light"
				? theme.palette.success.light
				: theme.palette.primary.light,
		},
	},
});

/**
 * 遊戲主介面元件
 * 包含側邊選單、主要內容區域和彈出視窗
 */
const GameLayout = ({ isDarkMode, onToggleTheme }) => {
	// 獲取遊戲相關資料和方法
	const { characterStats, currentClass, selectClass } = useGame();

	// Material-UI 主題和響應式設計相關
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const drawerWidth = 240;

	// 狀態管理
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	// 使用自定義 Hook 管理面板和彈出視窗
	const { selectedPanel, isModalOpen, handlePanelChange, closeModal } =
		useModalPanel("character");

	/**
	 * 處理側邊欄開關（移動裝置）
	 */
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	/**
	 * 處理選單項目點擊
	 * @param {Object} item - 選單項目對象
	 */
	const handleMenuClick = (item) => {
		handlePanelChange(item.id, item.isModal);
		if (isMobile) {
			setMobileOpen(false);
		}
	};

	// 如果未登入，顯示登入頁面
	if (!isLoggedIn) {
		return (
			<Login
				onLogin={setIsLoggedIn}
				isDarkMode={isDarkMode}
				onToggleTheme={onToggleTheme}
			/>
		);
	}

	/**
	 * 渲染側邊欄內容
	 */
	const drawerContent = (
		<>
			<Toolbar>
				{isMobile && (
					<IconButton onClick={handleDrawerToggle} sx={{ ml: "auto" }}>
						<CloseIcon />
					</IconButton>
				)}
			</Toolbar>
			<List>
				{menuItems.map((item) => (
					<ListItem
						button
						key={item.id}
						onClick={() => handleMenuClick(item)}
						sx={getMenuItemStyle(item.id, selectedPanel === item.id, theme)}
					>
						<ListItemIcon
							sx={{
								color:
									selectedPanel === item.id
										? theme.palette.mode === "light"
											? theme.palette.success.contrastText
											: theme.palette.primary.contrastText
										: "inherit",
							}}
						>
							{item.icon}
						</ListItemIcon>
						<ListItemText primary={item.text} />
					</ListItem>
				))}
			</List>
		</>
	);

	/**
	 * 渲染選中面板的內容
	 * @returns {JSX.Element} 面板內容
	 */
	const renderPanelContent = () => {
		switch (selectedPanel) {
			case "character":
				return <div>角色詳細資訊面板</div>;
			case "inventory":
				return <div>背包道具內容面板</div>;
			case "skills":
				return <div>技能列表面板</div>;
			case "map":
				return <div>地圖面板</div>;
			default:
				return <div>請選擇一個面板</div>;
		}
	};

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			{/* 頂部導航欄 */}
			<AppBar
				position="fixed"
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					ml: { md: `${drawerWidth}px` },
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

			{/* 側邊導航欄 */}
			<Box
				component="nav"
				sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
			>
				{/* 移動裝置的暫時性側邊欄 */}
				{isMobile ? (
					<Drawer
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						ModalProps={{
							keepMounted: true, // 為了更好的移動端效能
						}}
						sx={{
							"& .MuiDrawer-paper": {
								boxSizing: "border-box",
								width: drawerWidth,
							},
						}}
					>
						{drawerContent}
					</Drawer>
				) : (
					// 桌面版的永久性側邊欄
					<Drawer
						variant="permanent"
						sx={{
							"& .MuiDrawer-paper": {
								boxSizing: "border-box",
								width: drawerWidth,
							},
						}}
						open
					>
						{drawerContent}
					</Drawer>
				)}
			</Box>

			{/* 主要內容區域 */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					mt: 8,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
				}}
			>
				<Box
					sx={{
						display: "grid",
						gap: 2,
						gridTemplateColumns: {
							xs: "1fr",
							sm: "1fr 1fr",
						},
						gridTemplateRows: "auto",
					}}
				>
					{/* 角色狀態卡片 */}
					<Paper
						sx={{
							p: 2,
							gridColumn: { xs: "1", sm: "1 / 2" },
							minHeight: "200px",
						}}
					>
						角色狀態
					</Paper>
					{/* 裝備欄位卡片 */}
					<Paper
						sx={{
							p: 2,
							gridColumn: { xs: "1", sm: "2 / 3" },
							minHeight: "200px",
						}}
					>
						裝備欄位
					</Paper>
					{/* 主要內容卡片 */}
					<Paper
						sx={{
							p: 2,
							gridColumn: { xs: "1", sm: "1 / 3" },
							minHeight: "200px",
						}}
					>
						{!isModalOpen && renderPanelContent()}
					</Paper>
				</Box>

				{/* 彈出式地圖視窗 */}
				<Modal
					open={isModalOpen && selectedPanel === "map"}
					onClose={closeModal}
					aria-labelledby="modal-map"
					aria-describedby="modal-map-description"
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Paper
						sx={{
							position: "relative",
							width: "80%",
							maxWidth: 800,
							maxHeight: "80vh",
							overflow: "auto",
							p: 4,
							outline: "none", // 移除 Modal 的預設外框
						}}
						onClick={(e) => e.stopPropagation()} // 防止點擊內容區域時關閉視窗
					>
						<IconButton
							onClick={closeModal}
							sx={{
								position: "absolute",
								right: 8,
								top: 8,
							}}
						>
							<CloseIcon />
						</IconButton>
						{renderPanelContent()}
					</Paper>
				</Modal>
			</Box>
		</Box>
	);
};

export default GameLayout;
