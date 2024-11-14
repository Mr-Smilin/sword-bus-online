import React, { useState } from "react";
import { useAnimation, useNumberAnimation } from "../../utils/animations";
import {
	Paper,
	Typography,
	Box,
	LinearProgress,
	IconButton,
	Grid2 as Grid,
} from "@mui/material";
import {
	Heart, // 生命值
	Brain, // 魔力值
	Swords, // 攻擊力
	Wind, // 敏捷
	Star, // 等級
	Sword, // 武器
} from "lucide-react";

/**
 * 角色資訊卡片元件
 * 整合角色狀態和武器裝備
 */
export const CharacterCard = () => {
	// 動畫相關
	const { style, AnimatedComponent } = useAnimation("fadeIn", {
		config: { duration: 500 },
	});

	// 血量和魔力值動畫
	const [currentHP, setCurrentHP] = useState(100);
	const [currentMP, setCurrentMP] = useState(80);
	const animatedHP = useNumberAnimation(currentHP);
	const animatedMP = useNumberAnimation(currentMP);

	// 模擬血量變化的示例函數
	const simulateHPChange = () => {
		const newHP = Math.max(
			0,
			Math.min(100, currentHP + (Math.random() > 0.5 ? 10 : -10))
		);
		setCurrentHP(newHP);
	};

	// 經驗值動畫
	const animatedExp = useNumberAnimation(75);

	return (
		<AnimatedComponent style={style}>
			<Paper sx={{ p: 2, height: "100%", position: "relative" }}>
				{/* 標題區與等級資訊 */}
				<Grid container alignItems="center" spacing={1} sx={{ mb: 2 }}>
					<Grid xs="auto">
						<Typography variant="h6" component="h2">
							角色狀態
						</Typography>
					</Grid>
					<Grid xs="auto">
						<Star size={20} />
					</Grid>
					<Grid xs>
						<Typography variant="body2" display="inline">
							等級 15
						</Typography>
						<Box sx={{ width: "100%", mt: 0.5 }}>
							<LinearProgress
								variant="determinate"
								value={animatedExp}
								sx={{
									"& .MuiLinearProgress-bar": {
										transition: "transform 0.8s ease-in-out",
									},
								}}
							/>
							<Typography variant="caption" color="text.secondary">
								經驗值: 7500 / 10000
							</Typography>
						</Box>
					</Grid>
				</Grid>

				{/* 武器欄位 - 絕對定位在右側中間 */}
				<Box
					sx={{
						position: "absolute",
						right: 16,
						top: "50%",
						transform: "translateY(-50%)",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Box
						sx={{
							border: 1,
							borderColor: "divider",
							borderRadius: 1,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 60,
							height: 60,
							transition: "all 0.2s ease-in-out",
							"&:hover": {
								borderColor: "primary.main",
								bgcolor: "action.hover",
								transform: "scale(1.05)",
							},
						}}
					>
						<IconButton onClick={simulateHPChange}>
							<Sword size={32} />
						</IconButton>
					</Box>
					<Typography variant="caption" align="center" display="block">
						武器
					</Typography>
				</Box>

				{/* 狀態值 - 左側內容區，預留右側空間給武器圖標 */}
				<Box sx={{ width: "calc(100% - 100px)" }}>
					<Grid container spacing={2}>
						<Grid xs={12}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
								<Heart size={20} />
								<Typography variant="body2" sx={{ ml: 1 }}>
									生命值: {Math.round(animatedHP)}/100
								</Typography>
							</Box>
							<LinearProgress
								variant="determinate"
								value={animatedHP}
								color="error"
								sx={{
									mb: 2,
									"& .MuiLinearProgress-bar": {
										transition: "transform 0.8s ease-in-out",
									},
								}}
							/>
						</Grid>

						<Grid xs={12}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
								<Brain size={20} />
								<Typography variant="body2" sx={{ ml: 1 }}>
									魔力值: {Math.round(animatedMP)}/80
								</Typography>
							</Box>
							<LinearProgress
								variant="determinate"
								value={(animatedMP / 80) * 100}
								color="primary"
								sx={{
									mb: 2,
									"& .MuiLinearProgress-bar": {
										transition: "transform 0.8s ease-in-out",
									},
								}}
							/>
						</Grid>

						{/* 基礎屬性值 */}
						<Grid xs={6}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									transition: "transform 0.2s ease-in-out",
									"&:hover": {
										transform: "translateX(5px)",
									},
								}}
							>
								<Swords size={20} />
								<Typography variant="body2" sx={{ ml: 1 }}>
									力量: 15
								</Typography>
							</Box>
						</Grid>
						<Grid xs={6}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									transition: "transform 0.2s ease-in-out",
									"&:hover": {
										transform: "translateX(5px)",
									},
								}}
							>
								<Wind size={20} />
								<Typography variant="body2" sx={{ ml: 1 }}>
									敏捷: 12
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</AnimatedComponent>
	);
};
