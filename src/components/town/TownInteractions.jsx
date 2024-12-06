/**
 * @file TownInteractions.jsx
 * @description 城鎮設施交互組件，負責展示和處理城鎮內所有可用的設施
 */
import React, { useState } from "react";
import {
	Box,
	Button,
	Paper,
	Collapse,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// 引入圖標
import {
	Building2, // 樓層切換圖標
	Store, // 商店圖標
	Scroll, // 任務圖標
	BedDouble, // 旅館圖標
	Hammer, // 鐵匠圖標
	Sword, // 競技場圖標
	Warehouse, // 倉庫圖標
	Mail, // 郵件圖標
} from "lucide-react";

// 引入必要的 context 和組件
import { useMap } from "../../contexts/MapContext";
import { floors } from "../../data/maps/mapDefinitions";
import FloorSwitchDialog from "./FloorSwitchDialog";
import QuickFloorSwitch from "./QuickFloorSwitch";

/**
 * 自定義動畫網格項目組件
 * 為網格項目添加平滑的過渡動畫效果
 */
const AnimatedGridItem = styled(Grid)(({ theme, expanded }) => ({
	transition: theme.transitions.create(["width", "flex-basis"], {
		duration: theme.transitions.duration.standard,
		easing: theme.transitions.easing.easeInOut,
	}),
	...(expanded && {
		flexBasis: "100% !important",
		maxWidth: "100% !important",
	}),
}));

/**
 * 自定義動畫紙張容器組件
 * 為容器添加縮放和陰影的過渡效果
 */
const AnimatedPaper = styled(Paper)(({ theme }) => ({
	transition: theme.transitions.create(
		["transform", "box-shadow", "height", "background-color"],
		{
			duration: theme.transitions.duration.standard,
			easing: theme.transitions.easing.easeInOut,
		}
	),
	height: "100%",
	display: "flex",
	flexDirection: "column",
}));

/**
 * 城鎮設施配置
 * 定義所有可用的城鎮設施及其屬性
 */
const TOWN_FACILITIES = [
	{
		id: "floors",
		label: "樓層傳送",
		icon: Building2,
		description: "前往其他已解鎖的城鎮",
		disabled: false,
		renderExtra: (props) => (
			<QuickFloorSwitch onFloorSelect={props.onFloorSelect} />
		),
	},
	{
		id: "shop",
		label: "商店",
		icon: Store,
		description: "購買補給品和裝備",
		disabled: true,
		tooltip: "商店正在進貨中...",
	},
	{
		id: "quest",
		label: "任務公會",
		icon: Scroll,
		description: "接取和提交任務",
		disabled: true,
		tooltip: "公會正在整理任務中...",
	},
	{
		id: "inn",
		label: "旅館",
		icon: BedDouble,
		description: "休息並恢復狀態",
		disabled: true,
		tooltip: "旅館正在打掃中...",
	},
	{
		id: "blacksmith",
		label: "鐵匠鋪",
		icon: Hammer,
		description: "強化和修理裝備",
		disabled: true,
		tooltip: "鐵匠正在整理工具...",
	},
	{
		id: "arena",
		label: "競技場",
		icon: Sword,
		description: "參與PVP對戰",
		disabled: true,
		tooltip: "競技場正在準備中...",
	},
	{
		id: "storage",
		label: "倉庫",
		icon: Warehouse,
		description: "存放物品",
		disabled: true,
		tooltip: "倉庫管理員正在盤點...",
	},
	{
		id: "mail",
		label: "郵箱",
		icon: Mail,
		description: "收發郵件和物品",
		disabled: true,
		tooltip: "郵差正在整理郵件...",
	},
];

/**
 * 城鎮互動面板組件
 * @returns {JSX.Element} 城鎮互動面板
 */
const TownInteractions = () => {
	// 從地圖上下文獲取狀態和方法
	const { currentFloor, currentArea, changeFloor } = useMap();

	// 狀態管理
	const [expandedId, setExpandedId] = useState(null); // 當前展開的設施ID
	const [isDialogOpen, setIsDialogOpen] = useState(false); // 樓層選擇對話框狀態
	const [confirmDialog, setConfirmDialog] = useState({
		// 確認對話框狀態
		open: false,
		targetFloor: null,
	});

	/**
	 * 處理樓層切換確認
	 */
	const handleConfirmChange = () => {
		if (confirmDialog.targetFloor) {
			changeFloor(confirmDialog.targetFloor.id);
		}
		setConfirmDialog({ open: false, targetFloor: null });
	};

	/**
	 * 處理樓層切換選擇
	 * @param {number} floorId - 目標樓層ID
	 */
	const handleFloorChange = (floorId) => {
		const targetFloor = floors.find((f) => f.id === floorId);
		setConfirmDialog({
			open: true,
			targetFloor,
		});
		setIsDialogOpen(false);
	};

	// 只在城鎮顯示
	if (currentArea.type !== "town") return null;

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			{/* 可滾動的設施列表容器 */}
			<Box
				sx={{
					flex: 1,
					overflow: "auto",
					px: 2,
					mr: -2,
				}}
			>
				<Box sx={{ py: 2 }}>
					{/* 設施網格布局 */}
					<Grid
						container
						spacing={2}
						sx={{
							transition: (theme) =>
								theme.transitions.create("all", {
									duration: theme.transitions.duration.standard,
									easing: theme.transitions.easing.easeInOut,
								}),
						}}
					>
						{TOWN_FACILITIES.map((facility) => (
							<AnimatedGridItem
								item
								key={facility.id}
								xs={12} // 手機版一行一個
								sm={6} // 平板一行兩個
								md={4} // 桌面版一行三個
								lg={3} // 大螢幕一行四個
							>
								{/* 設施卡片 */}
								<AnimatedPaper
									onMouseEnter={() => setExpandedId(facility.id)}
									onMouseLeave={() => setExpandedId(null)}
									elevation={expandedId === facility.id ? 4 : 1}
									sx={{
										p: 2,
										border: 1,
										borderColor: "divider",
										bgcolor: "background.paper",
										transform:
											expandedId === facility.id
												? "translateY(2px)"
												: "translateY(0)",
										"&:hover": {
											borderColor: facility.disabled
												? "divider"
												: "primary.main",
										},
									}}
								>
									{/* 設施內容容器 */}
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											flexWrap: "wrap",
											gap: 2,
										}}
									>
										{/* 設施按鈕 */}
										<Tooltip title={facility.tooltip} arrow>
											<span>
												<Button
													variant="outlined"
													startIcon={<facility.icon size={18} />}
													disabled={facility.disabled}
													onClick={() => {
														if (facility.id === "floors") {
															setIsDialogOpen(true);
														}
													}}
													sx={{
														justifyContent: "flex-start",
														whiteSpace: "nowrap",
														minWidth: "auto",
													}}
												>
													{facility.label}
												</Button>
											</span>
										</Tooltip>

										{/* 展開的詳細資訊 */}
										<Collapse
											in={expandedId === facility.id}
											sx={{ width: "100%" }}
										>
											{/* 額外的組件（如快速樓層切換）*/}
											{facility.renderExtra?.({
												onFloorSelect: handleFloorChange,
											})}
											<Box
												sx={{
													pt: 2,
													mt: 2,
													borderTop: 1,
													borderColor: "divider",
												}}
											>
												<Typography variant="body2" color="text.secondary">
													{facility.description}
												</Typography>
											</Box>
										</Collapse>
									</Box>
								</AnimatedPaper>
							</AnimatedGridItem>
						))}
					</Grid>
				</Box>
			</Box>

			{/* 樓層切換對話框 */}
			<FloorSwitchDialog
				open={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onFloorSelect={handleFloorChange}
			/>

			{/* 確認對話框 */}
			<Dialog
				open={confirmDialog.open}
				onClose={() => setConfirmDialog({ open: false, targetFloor: null })}
			>
				<DialogTitle>確認傳送</DialogTitle>
				<DialogContent>
					確定要傳送到 {confirmDialog.targetFloor?.name} 嗎？
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setConfirmDialog({ open: false, targetFloor: null })}
					>
						取消
					</Button>
					<Button variant="contained" onClick={handleConfirmChange}>
						確認
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default TownInteractions;
