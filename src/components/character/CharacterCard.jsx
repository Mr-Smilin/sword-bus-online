import React, { useState, useEffect } from "react";
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
import { Heart, Brain, Star, Sword } from "lucide-react";
import ProfessionTab from "./ProfessionTab";
import { useGame } from "../../contexts/GameContext";

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
						transition: "transform 0.3s",
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
	const { player, gainExperience, getExpPercentage, updatePlayerByLevel } =
		useGame();
	const { characterStats } = player;

	const [tabValue, setTabValue] = useState(0);
	const { style, AnimatedComponent } = useAnimation("fadeIn", {
		config: { duration: 500 },
	});

	// 當前狀態
	const [currentHP, setCurrentHP] = useState(0);
	const [currentMP, setCurrentMP] = useState(0);
	const [currentExp, setCurrentExp] = useState(0);

	// 動畫值
	const animatedHP = useNumberAnimation(currentHP);
	const animatedMP = useNumberAnimation(currentMP);
	const animatedExp = useNumberAnimation(currentExp);

	// 經驗值百分比
	const expPercentage = getExpPercentage();

	// 模擬獲得經驗值
	const simulateExpGain = () => {
		gainExperience(500);
	};

	// Tab 切換處理
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	// 更新狀態
	useEffect(() => {
		if (!!characterStats) {
			setCurrentHP(characterStats.currentHealth);
			setCurrentMP(characterStats.currentMana);
			setCurrentExp(characterStats.experience);
		}
	}, [characterStats]);

	if (!player) {
		return (
			<Paper sx={{ p: 3 }}>
				<Typography>載入中...</Typography>
			</Paper>
		);
	}

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
												<Typography variant="body2">
													等級 {characterStats?.level || 1}
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={6}>
											<Box>
												<LinearProgress
													variant="determinate"
													value={expPercentage}
													sx={{
														"& .MuiLinearProgress-bar": {
															transition: "transform 0.3s",
														},
													}}
												/>
												<Typography variant="caption" color="text.secondary">
													經驗值: {Math.floor(animatedExp)} /{" "}
													{characterStats?.nextLevelExp}
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
										maxValue={characterStats?.health || 100}
										color="error"
									/>
								</Grid>

								{/* 魔力值 */}
								<Grid item xs={12}>
									<StatBar
										icon={Brain}
										label="魔力值"
										value={animatedMP}
										maxValue={characterStats?.mana || 100}
									/>
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
								onClick={simulateExpGain}
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
								<Typography variant="body2">增加經驗值(測試)</Typography>
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
