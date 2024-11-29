import React, { useState, useEffect } from "react";
import { Paper, LinearProgress, Typography, Box } from "@mui/material";
import { ArrowRight } from "lucide-react";

const TravelProgress = ({
	progress,
	fromArea,
	toArea,
	estimatedTime,
	isMoving,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [shouldCollapse, setShouldCollapse] = useState(false);

	// 控制進度條的顯示與隱藏
	useEffect(() => {
		if (isMoving && !isVisible) {
			setIsVisible(true);
		} else if (!isMoving && progress >= 100) {
			// 延遲隱藏效果
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 1500); // 1秒顯示 + 0.5秒動畫
			return () => clearTimeout(timer);
		}
	}, [isMoving, progress, isVisible]);

	// 監聽滑鼠位置，控制進度條在導航區域時的收縮
	useEffect(() => {
		const handleMouseMove = (e) => {
			const navbarArea = document.querySelector("[data-navbar-area]");
			if (navbarArea) {
				const rect = navbarArea.getBoundingClientRect();
				const isOverNavbar = e.clientY <= rect.bottom;
				setShouldCollapse(isOverNavbar);
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	// 格式化時間顯示
	const formatTime = (seconds) => {
		if (seconds < 60) {
			return `${Math.ceil(seconds)}秒`;
		}
		return `${Math.ceil(seconds / 60)}分鐘`;
	};

	if (!fromArea || !toArea) return null;

	return (
		<Paper
			elevation={3}
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				height: "auto",
				zIndex: 1200,
				px: 2,
				py: 1,
				bgcolor: "background.paper",
				borderRadius: "0 0 8px 8px",
				transform: !isVisible
					? "translateY(-100%)"
					: shouldCollapse
					? "translateY(-28px)"
					: "translateY(0)",
				transition: "transform 0.5s ease-in-out",
				visibility: isVisible ? "visible" : "hidden",
			}}
		>
			{/* 區域和時間資訊 */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					mb: 1,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Typography variant="body2">{fromArea.name}</Typography>
					<ArrowRight size={16} />
					<Typography variant="body2">{toArea.name}</Typography>
					<Typography variant="body2" color="text.secondary">
						· {formatTime(estimatedTime)}
					</Typography>
				</Box>
				<Typography variant="body2" color="text.secondary">
					{Math.round(progress)}%
				</Typography>
			</Box>

			{/* 進度條 */}
			<LinearProgress
				variant="determinate"
				value={progress}
				sx={{
					height: 4,
					borderRadius: 1,
					"& .MuiLinearProgress-bar": {
						transition: "transform 0.3s ease",
					},
				}}
			/>
		</Paper>
	);
};

export default TravelProgress;
