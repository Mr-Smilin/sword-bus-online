import React, { useState } from "react";
import { useAnimation, useNumberAnimation } from "../../utils/animations";
import {
	Paper,
	Typography,
	Box,
	LinearProgress,
	Grid,
	Tabs,
	Tab,
	Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Heart, Brain, Swords, Wind, Star, Sword } from "lucide-react";
import ProfessionTab from "./ProfessionTab";

/**
 * 狀態條元件
 */
const StatBar = ({ icon: Icon, label, value, maxValue, color = "primary" }) => (
	<Grid container spacing={1} alignItems="center">
		<Grid item xs="auto">
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Icon size={16} />
				<Typography variant="body2">
					{label}: {Math.round(value)}/{maxValue}
				</Typography>
			</Box>
		</Grid>
		<Grid item xs={6}>
			<LinearProgress
				variant="determinate"
				value={(value / maxValue) * 100}
				color={color}
				sx={{
					"& .MuiLinearProgress-bar": {
						transition: "transform 0.8s ease-in-out",
					},
				}}
			/>
		</Grid>
	</Grid>
);

/**
 * Tab 面板組件
 */
const TabPanel = ({ children, value, index, ...other }) => (
	<div
		role="tabpanel"
		hidden={value !== index}
		id={`character-tabpanel-${index}`}
		aria-labelledby={`character-tab-${index}`}
		{...other}
		style={{
			height: "100%",
			display: value === index ? "flex" : "none",
			flexDirection: "column",
		}}
	>
		{value === index && children}
	</div>
);

/**
 * 自定義Tab樣式
 */
const StyledTab = styled(Tab)({
	minHeight: "32px",
	height: "32px",
	fontSize: "0.875rem",
	textTransform: "none",
	padding: "0 16px",
});

/**
 * 角色卡片主組件
 */
export const CharacterCard = () => {
	// Tab 切換狀態
	const [tabValue, setTabValue] = useState(0);
	// 動畫相關
	const { style, AnimatedComponent } = useAnimation("fadeIn", {
		config: { duration: 500 },
	});

	// 血量和魔力值動畫
	const [currentHP, setCurrentHP] = useState(100);
	const [currentMP, setCurrentMP] = useState(80);
	const animatedHP = useNumberAnimation(currentHP);
	const animatedMP = useNumberAnimation(currentMP);
	const animatedExp = useNumberAnimation(75);

	// 模擬血量變化
	const simulateHPChange = () => {
		const newHP = Math.max(
			0,
			Math.min(100, currentHP + (Math.random() > 0.5 ? 10 : -10))
		);
		setCurrentHP(newHP);
	};

	// Tab 切換處理
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	return (
		<AnimatedComponent style={style}>
			<Paper
				sx={{
					height: { xs: "280px", sm: "320px" },
					display: "flex",
					flexDirection: "column",
				}}
			>
				{/* 標題與Tab */}
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						sx={{
							minHeight: "32px",
							height: "32px",
							"& .MuiTabs-indicator": {
								height: 2,
							},
						}}
					>
						<StyledTab label="角色" />
						<StyledTab label="職業" />
					</Tabs>
				</Box>

				{/* 內容區域 */}
				<Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
					{/* 角色狀態面板 */}
					<TabPanel value={tabValue} index={0}>
						{/* 主要內容區 */}
						<Box sx={{ p: 1.5, flexGrow: 1, overflow: "auto" }}>
							<Grid container spacing={1.5}>
								{/* 等級資訊 */}
								<Grid item xs={12}>
									<Grid container spacing={1} alignItems="center">
										<Grid item xs="auto">
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 1 }}
											>
												<Star size={16} />
												<Typography variant="body2">等級 15</Typography>
											</Box>
										</Grid>
										<Grid item xs={6}>
											<Box>
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
								</Grid>

								{/* 生命值 */}
								<Grid item xs={12}>
									<StatBar
										icon={Heart}
										label="生命值"
										value={animatedHP}
										maxValue={100}
										color="error"
									/>
								</Grid>

								{/* 魔力值 */}
								<Grid item xs={12}>
									<StatBar
										icon={Brain}
										label="魔力值"
										value={animatedMP}
										maxValue={80}
									/>
								</Grid>

								{/* 基礎屬性值 */}
								<Grid item xs={6}>
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
										<Swords size={16} />
										<Typography variant="body2" sx={{ ml: 1 }}>
											力量: 15
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={6}>
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
										<Wind size={16} />
										<Typography variant="body2" sx={{ ml: 1 }}>
											敏捷: 12
										</Typography>
									</Box>
								</Grid>
							</Grid>
						</Box>

						{/* 武器欄位 */}
						<Box
							sx={{
								p: 1.5,
								borderTop: 1,
								borderColor: "divider",
								backgroundColor: (theme) =>
									theme.palette.mode === "light"
										? theme.palette.grey[50]
										: theme.palette.grey[900],
							}}
						>
							<Button
								variant="outlined"
								onClick={simulateHPChange}
								startIcon={<Sword size={20} />}
								sx={{
									width: "100%",
									py: 1,
									borderColor: "divider",
									"&:hover": {
										borderColor: "primary.main",
										bgcolor: "action.hover",
									},
								}}
							>
								<Typography variant="body2">武器</Typography>
							</Button>
						</Box>
					</TabPanel>

					{/* 職業面板 */}
					<TabPanel value={tabValue} index={1}>
						<ProfessionTab />
					</TabPanel>
				</Box>
			</Paper>
		</AnimatedComponent>
	);
};

export default CharacterCard;
