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
} from "@mui/material";

// 引入所需圖標
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

// 引入所需的 context 和組件
import { useMap } from "../../contexts/MapContext";
import { floors } from "../../data/maps/mapDefinitions";
import FloorSwitchDialog from "./FloorSwitchDialog";
import QuickFloorSwitch from "./QuickFloorSwitch";

/**
 * 城鎮設施配置
 * @property {string} id - 設施唯一標識符
 * @property {string} label - 設施名稱
 * @property {Component} icon - 設施圖標組件
 * @property {string} description - 設施描述
 * @property {boolean} disabled - 是否禁用
 * @property {string} tooltip - 禁用時的提示文字
 * @property {Function} renderExtra - 渲染額外的組件（可選）
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
 * 用於展示和管理所有可用的城鎮設施
 */
const TownInteractions = () => {
	// 從地圖上下文獲取狀態和方法
	const { currentFloor, currentArea, changeFloor } = useMap();

	// 組件內部狀態管理
	const [isExpanded, setIsExpanded] = useState({}); // 控制每個設施的展開狀態
	const [isDialogOpen, setIsDialogOpen] = useState(false); // 控制樓層選擇對話框
	const [confirmDialog, setConfirmDialog] = useState({
		// 控制確認對話框
		open: false,
		targetFloor: null,
	});

	/**
	 * 處理樓層切換的確認流程
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

	/**
	 * 執行樓層切換
	 */
	const handleConfirmChange = () => {
		if (confirmDialog.targetFloor) {
			changeFloor(confirmDialog.targetFloor.id);
		}
		setConfirmDialog({ open: false, targetFloor: null });
	};

	// 只在城鎮顯示
	if (currentArea.type !== "town") return null;

	return (
		<Box
			sx={{
				position: "relative",
				height: "100%",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* 可滾動的設施列表容器 */}
			<Box
				sx={{
					flex: 1,
					overflowY: "auto",
					pr: 2, // 為滾動條預留空間
					mr: -2, // 補償 padding-right
					// 滾動陰影效果
					maskImage: "linear-gradient(to bottom, black 90%, transparent)",
					WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent)",
				}}
			>
				{/* 設施列表 */}
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 2 }}>
					{TOWN_FACILITIES.map((facility) => (
						<Paper
							key={facility.id}
							onMouseEnter={() =>
								setIsExpanded((prev) => ({ ...prev, [facility.id]: true }))
							}
							onMouseLeave={() =>
								setIsExpanded((prev) => ({ ...prev, [facility.id]: false }))
							}
							sx={{
								p: 2,
								transition: "all 0.3s ease-in-out",
								border: 1,
								borderColor: "divider",
								bgcolor: "background.paper",
								"&:hover": {
									boxShadow: 1,
									borderColor: facility.disabled ? "divider" : "primary.main",
								},
							}}
						>
							{/* 設施主按鈕區域 */}
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
												// 其他設施的點擊處理將在後續實現
											}}
										>
											{facility.label}
										</Button>
									</span>
								</Tooltip>

								{/* 渲染額外的組件（如快速樓層切換） */}
								{facility.renderExtra?.({
									onFloorSelect: handleFloorChange,
								})}
							</Box>

							{/* 展開區域 - 顯示設施詳細信息 */}
							<Collapse in={Boolean(isExpanded[facility.id])}>
								<Box
									sx={{
										mt: 2,
										pt: 2,
										borderTop: 1,
										borderColor: "divider",
									}}
								>
									<Typography variant="body2" color="text.secondary">
										{facility.description}
									</Typography>
								</Box>
							</Collapse>
						</Paper>
					))}
				</Box>
			</Box>

			{/* 樓層選擇對話框 */}
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
