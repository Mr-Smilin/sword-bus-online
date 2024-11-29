import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Paper, Typography, Tooltip } from "@mui/material";
import TravelProgress from "./TravelProgress";
import TravelConfirmDialog from "./TravelConfirmDialog";
import { useMap } from "../../contexts/MapContext";
import { useGame } from "../../contexts/GameContext";
import { useLayout } from "../../contexts";

// 地圖容器 - 使用羊皮紙風格
const MapContainer = styled(Paper)(({ theme }) => ({
	position: "relative",
	width: "100%",
	aspectRatio: "16/9",
	backgroundColor: "#f4d03f", // 羊皮紙底色
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

// 區域標記點
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

// 玩家標記
const PlayerMarker = styled("div")(({ theme }) => ({
	position: "absolute",
	width: 16,
	height: 16,
	backgroundColor: theme.palette.warning.main,
	borderRadius: "50%",
	transform: "translate(-50%, -50%)",
	boxShadow: "0 0 10px rgba(0,0,0,0.3)",
	zIndex: 10,
	"&::after": {
		content: '""',
		position: "absolute",
		top: "50%",
		left: "50%",
		width: 24,
		height: 24,
		border: `2px solid ${theme.palette.warning.main}`,
		borderRadius: "50%",
		transform: "translate(-50%, -50%)",
		animation: "pulse 1.5s infinite",
	},
	"@keyframes pulse": {
		"0%": {
			transform: "translate(-50%, -50%) scale(1)",
			opacity: 1,
		},
		"100%": {
			transform: "translate(-50%, -50%) scale(1.5)",
			opacity: 0,
		},
	},
}));

// 路徑連接線
const ConnectionPath = styled("div")(({ theme }) => ({
	position: "absolute",
	height: 2,
	backgroundColor: theme.palette.divider,
	transformOrigin: "left center", // 改變變形的原點
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

const MapView = () => {
	const {
		currentFloor,
		currentArea,
		isMoving,
		moveToArea,
		moveProgress,
		travelInfo,
		calculateTravelTime,
	} = useMap();
	const { areaProgress } = useGame();
	const { layoutActions } = useLayout();

	// 確認視窗的狀態
	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		targetArea: null,
		estimatedTime: 0,
	});

	// 計算兩點間的連線角度和長度
	const calculateConnection = (start, end) => {
		// 計算實際的寬高比例
		const ASPECT_RATIO = 9 / 16;
		// 根據寬高比例調整座標
		const dx = end.x - start.x;
		const dy = (end.y - start.y) * ASPECT_RATIO;

		// 計算實際距離和角度
		const distance = Math.sqrt(dx * dx + dy * dy);
		const angle = Math.atan2(dy, dx) * (180 / Math.PI);

		return { distance, angle };
	};

	// 檢查區域鎖定狀態，返回具體原因
	const getAreaLockReason = (area) => {
		// 檢查是否在可連接範圍
		if (!currentArea.connections.includes(area.id)) {
			return {
				isLocked: true,
				reason: "無法直接到達此區域",
				type: "connection",
			};
		}

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

	// 區域點擊處理
	const handleAreaClick = (area) => {
		if (isMoving) return;

		// 如果不在連接列表中，顯示無法直接到達的提示
		if (!currentArea.connections.includes(area.id)) {
			// 可以使用 Material-UI 的 Snackbar 或 其他提示組件
			return;
		}

		// 檢查探索度要求
		if (area.requiredExploration) {
			const progress = areaProgress?.[area.id];
			if (!progress || progress.maxExploration < area.requiredExploration) {
				return;
			}
		}

		// 計算移動時間並打開確認視窗
		const time = calculateTravelTime(currentArea, area);
		setConfirmDialog({
			open: true,
			targetArea: area,
			estimatedTime: time,
		});
	};

	// 處理確認移動
	const handleConfirmTravel = () => {
		const { targetArea } = confirmDialog;
		setConfirmDialog((prev) => ({ ...prev, open: false }));
		// 先關閉地圖面板
		layoutActions.switchPanel("character");
		// 然後開始移動
		moveToArea(targetArea.id);
	};

	// 處理取消移動
	const handleCancelTravel = () => {
		setConfirmDialog({
			open: false,
			targetArea: null,
			estimatedTime: 0,
		});
	};

	return (
		<>
			<MapContainer className="map-container">
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
				{currentFloor.areas.map((area) => (
					<Tooltip
						key={area.id}
						title={
							<Box>
								<Typography variant="subtitle2">{area.name}</Typography>
								<Typography variant="body2">{area.description}</Typography>
								{(() => {
									const lockStatus = getAreaLockReason(area);
									if (lockStatus.isLocked) {
										return (
											<Typography
												variant="caption"
												color={
													lockStatus.type === "connection"
														? "warning.main"
														: "error"
												}
											>
												{lockStatus.reason}
											</Typography>
										);
									}
									return null;
								})()}
							</Box>
						}
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
					>
						<Box
							sx={{
								position: "absolute",
								left: `${area.position.x}%`,
								top: `${area.position.y}%`,
							}}
						>
							<AreaMarker
								isLocked={isAreaLocked(area)}
								isActive={area.id === currentArea.id}
								areaType={area.type}
								onClick={() => handleAreaClick(area)}
							/>
						</Box>
					</Tooltip>
				))}

				{/* 玩家位置標記 */}
				<PlayerMarker
					style={{
						left: `${currentArea.position.x}%`,
						top: `${currentArea.position.y}%`,
					}}
				/>
			</MapContainer>

			{/* 確認視窗 */}
			<TravelConfirmDialog
				open={confirmDialog.open}
				fromArea={currentArea}
				toArea={confirmDialog.targetArea}
				estimatedTime={confirmDialog.estimatedTime}
				onConfirm={handleConfirmTravel}
				onCancel={handleCancelTravel}
			/>
		</>
	);
};

export default MapView;
