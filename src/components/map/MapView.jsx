import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Paper, Typography, Tooltip } from "@mui/material";
import TravelProgress from "./TravelProgress";
import TravelConfirmDialog from "./TravelConfirmDialog";
import { useMap } from "../../contexts/MapContext";
import { useGame } from "../../contexts/GameContext";
import { useLayout } from "../../contexts";

// 地圖容器
const MapContainer = styled(Paper)(({ theme }) => ({
	position: "relative",
	width: "100%",
	aspectRatio: "16/9",
	backgroundColor: "#f4d03f",
	backgroundImage: `
	  radial-gradient(circle at 100% 150%, #f4d03f 24%, #fdeaa8 25%, #fdeaa8 28%, #f4d03f 29%, #f4d03f 36%, #fdeaa8 36%, #fdeaa8 40%, transparent 40%, transparent),
	  radial-gradient(circle at 0    150%, #f4d03f 24%, #fdeaa8 25%, #fdeaa8 28%, #f4d03f 29%, #f4d03f 36%, #fdeaa8 36%, #fdeaa8 40%, transparent 40%, transparent)`,
	backgroundSize: "100px 50px",
	padding: theme.spacing(4),
	boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)",
	filter: "blur(0.5px)",
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		pointerEvents: "none",
		background:
			"linear-gradient(to right, rgba(244,208,63,0.5) 0%, transparent 20%, transparent 80%, rgba(244,208,63,0.5) 100%)",
		boxShadow: "inset 0 0 50px rgba(0,0,0,0.1)",
	},
}));

/**
 * 區域標記點
 */
const AreaMarker = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== "isLocked" && prop !== "isActive" && prop !== "areaType",
})(({ theme, isLocked, isActive, areaType }) => ({
	position: "absolute",
	width: 24,
	height: 24,
	borderRadius: "50%",
	zIndex: 2,
	backgroundColor: isLocked
		? theme.palette.grey[500]
		: isActive
		? theme.palette.primary.main
		: areaType === "town"
		? theme.palette.success.main
		: areaType === "wild"
		? theme.palette.warning.main
		: theme.palette.error.main,
	border: `2px solid ${theme.palette.background.paper}`,
	transform: "translate(-50%, -50%)",
	cursor: isLocked ? "not-allowed" : "pointer",
	transition: "all 0.3s ease",
	"&:hover": !isLocked && {
		transform: "translate(-50%, -50%) scale(1.4)",
		boxShadow: "0 0 10px rgba(0,0,0,0.3)",
	},
}));

/**
 * 玩家標記
 */
const PlayerMarker = styled(AreaMarker)(({ theme }) => ({
	backgroundColor: theme.palette.info.main,
	boxShadow: `0 0 15px ${theme.palette.info.main}`,
	border: `2px solid ${theme.palette.background.paper}`,
	zIndex: 10,

	// 外圈動畫
	"&::after": {
		content: '""',
		position: "absolute",
		top: "50%",
		left: "50%",
		width: 36,
		height: 36,
		border: `2px solid ${theme.palette.info.main}`,
		borderRadius: "50%",
		transform: "translate(-50%, -50%)",
		animation: "pulseOuter 2s infinite",
	},

	"@keyframes pulseOuter": {
		"0%": {
			transform: "translate(-50%, -50%) scale(0.9)",
			opacity: 0.8,
		},
		"100%": {
			transform: "translate(-50%, -50%) scale(1.5)",
			opacity: 0,
		},
	},
}));

/**
 * 路徑連接線
 */
const ConnectionPath = styled("div")(({ theme }) => ({
	position: "absolute",
	height: 2,
	backgroundColor: theme.palette.divider,
	transformOrigin: "left center",
	zIndex: 1,
	"&::after": {
		content: '""',
		position: "absolute",
		top: -2,
		left: 0,
		right: 0,
		bottom: -2,
		background: theme.palette.background.default,
		opacity: 0.1,
	},
}));

/**
 * 地圖視圖組件
 */
const MapView = () => {
	// 取得地圖相關狀態和方法
	const {
		currentFloor,
		currentArea,
		isMoving,
		areaProgress,
		moveToArea,
		calculateTravelTime,
		canMoveToArea,
		unlockedAreas,
	} = useMap();

	const { layoutActions } = useLayout();

	// 確認對話框狀態
	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		targetArea: null,
	});

	/**
	 * 計算兩點間的連線角度和長度
	 */
	const calculateConnection = (start, end) => {
		const ASPECT_RATIO = 9 / 16;
		const dx = end.x - start.x;
		const dy = (end.y - start.y) * ASPECT_RATIO;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const angle = Math.atan2(dy, dx) * (180 / Math.PI);

		return { distance, angle };
	};

	// 檢查區域鎖定狀態，返回具體原因
	const getAreaLockReason = (area) => {
		// 檢查探索度要求
		if (area.requiredExploration) {
			const progress = areaProgress?.[area.id];
			if (!progress || progress.maxExploration < area.requiredExploration) {
				return {
					isLocked: true,
					reason: `需要探索度: ${area.requiredExploration}`,
					type: "exploration",
				};
			}
		}

		// 檢查是否已解鎖
		if (!unlockedAreas.includes(area.id)) {
			return {
				isLocked: true,
				reason: "該區域尚未解鎖",
				type: "unlock",
			};
		}

		// 檢查是否在可連接範圍
		if (!currentArea.connections.includes(area.id)) {
			return {
				isLocked: true,
				reason: "與該地區沒有相連",
				type: "connection",
			};
		}

		return {
			isLocked: false,
			reason: null,
			type: null,
		};
	};

	// 檢查區域是否已解鎖
	const isAreaLocked = (area) => {
		return getAreaLockReason(area).isLocked;
	};

	/**
	 * 處理區域點擊
	 */
	const handleAreaClick = (area) => {
		if (isMoving) return;

		// 檢查是否可以移動
		if (!canMoveToArea(area.id)) return;

		setConfirmDialog({
			open: true,
			targetArea: area,
		});
	};

	/**
	 * 處理確認移動
	 */
	const handleConfirmTravel = () => {
		const { targetArea } = confirmDialog;
		setConfirmDialog({ open: false, targetArea: null });

		// 先關閉地圖面板
		layoutActions.switchPanel("character");
		// 然後開始移動
		moveToArea(targetArea.id);
	};

	return (
		<>
			<MapContainer>
				{/* 繪製連接路徑 */}
				{currentFloor.areas.map((area) =>
					area.connections.map((targetId) => {
						const targetArea = currentFloor.areas.find(
							(a) => a.id === targetId
						);
						if (!targetArea) return null;

						const { distance, angle } = calculateConnection(
							area.position,
							targetArea.position
						);

						return (
							<ConnectionPath
								key={`${area.id}-${targetId}`}
								style={{
									left: `${area.position.x}%`,
									top: `${area.position.y}%`,
									width: `${distance}%`,
									transform: `rotate(${angle}deg)`,
								}}
							/>
						);
					})
				)}

				{/* 繪製區域標記 */}
				{currentFloor.areas.map((area) => {
					const lockStatus = getAreaLockReason(area);

					return (
						<Tooltip
							key={area.id}
							title={
								<Box>
									<Typography variant="subtitle2">{area.name}</Typography>
									<Typography variant="body2">{area.description}</Typography>
									{lockStatus.isLocked && (
										<Typography variant="caption" color="error">
											{lockStatus.reason}
										</Typography>
									)}
								</Box>
							}
							placement="bottom"
							PopperProps={{
								// 確保 Popper 不會擋住互動
								modifiers: [
									{
										name: "offset",
										options: {
											offset: [0, 12], // 調整 Tooltip 的偏移
										},
									},
								],
							}}
							arrow
						>
							<Box
								sx={{
									position: "absolute",
									left: `${area.position.x}%`,
									top: `${area.position.y}%`,
								}}
							>
								<AreaMarker
									isLocked={lockStatus.isLocked}
									isActive={area.id === currentArea.id}
									areaType={area.type}
									onClick={() => handleAreaClick(area)}
								/>
							</Box>
						</Tooltip>
					);
				})}

				{/* 玩家位置標記 */}
				<PlayerMarker
					style={{
						left: `${currentArea.position.x}%`,
						top: `${currentArea.position.y}%`,
					}}
				/>
			</MapContainer>

			{/* 確認對話框 */}
			<TravelConfirmDialog
				open={confirmDialog.open}
				fromArea={currentArea}
				toArea={confirmDialog.targetArea}
				estimatedTime={
					confirmDialog.targetArea
						? calculateTravelTime(currentArea, confirmDialog.targetArea)
						: 0
				}
				onConfirm={handleConfirmTravel}
				onCancel={() => setConfirmDialog({ open: false, targetArea: null })}
			/>
		</>
	);
};

export default MapView;
