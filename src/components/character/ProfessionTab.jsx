// ProfessionTab.jsx
import React from "react";
import { Box, Typography, IconButton, Tooltip, Grid } from "@mui/material";
import { Circle } from "lucide-react";
import { useGame } from "../../contexts/GameContext";
import { classes } from "../../data/classes";

/**
 * 技能圖示組件
 * @param {Object} props
 * @param {Object} props.skill - 技能資訊
 * @param {boolean} props.isLocked - 是否被鎖定
 * @param {string[]} props.requirements - 解鎖需求說明
 */
const SkillIcon = ({ skill, isLocked, requirements = [] }) => {
	return (
		<Tooltip
			title={
				<Box>
					<Typography variant="subtitle2">{skill.name}</Typography>
					<Typography variant="body2">{skill.description}</Typography>
					<Typography variant="caption">
						魔力消耗: {skill.manaCost} | 冷卻時間: {skill.cooldown}秒
					</Typography>
					{isLocked && requirements.length > 0 && (
						<Box sx={{ mt: 1 }}>
							<Typography variant="caption" color="error">
								需求：
							</Typography>
							{requirements.map((req, index) => (
								<Typography
									key={index}
									variant="caption"
									color="error"
									display="block"
								>
									• {req}
								</Typography>
							))}
						</Box>
					)}
				</Box>
			}
		>
			<Box
				sx={{
					width: 40,
					height: 40,
					margin: 0.1,
					borderRadius: 1,
					border: "1px solid",
					borderColor: "divider",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					opacity: isLocked ? 0.5 : 1,
					cursor: "pointer",
					transition: "all 0.2s",
					"&:hover": {
						borderColor: "primary.main",
						transform: "scale(1.05)",
					},
					position: "relative",
					// 添加鎖定圖示
					"&::after": isLocked
						? {
								content: '"🔒"',
								position: "absolute",
								right: -5,
								bottom: -5,
								fontSize: "14px",
						  }
						: undefined,
				}}
			>
				<Typography variant="caption">{skill.name.charAt(0)}</Typography>
			</Box>
		</Tooltip>
	);
};

/**
 * 技能區塊組件
 * @param {Object} props
 * @param {string} props.title - 區塊標題
 * @param {Array} props.active - 可用技能列表
 * @param {Array} props.locked - 鎖定技能列表
 */
const SkillSection = ({ title, active = [], locked = [] }) => {
	if (active.length === 0 && locked.length === 0) return null;

	return (
		<Box sx={{ mb: 2 }}>
			<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
				{title}
			</Typography>
			<Grid container spacing={1}>
				{active.map((skill) => (
					<Grid item key={skill.id}>
						<SkillIcon skill={skill} isLocked={false} />
					</Grid>
				))}
				{locked.map((skill) => {
					// 產生需求說明
					const requirements = [];
					if (skill.requirements?.level) {
						requirements.push(`需要等級 ${skill.requirements.level}`);
					}
					if (skill.requirements?.weapon) {
						requirements.push(
							`需要武器類型: ${skill.requirements.weapon.join("/")}`
						);
					}

					return (
						<Grid item key={skill.id}>
							<SkillIcon
								skill={skill}
								isLocked={true}
								requirements={requirements}
							/>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
};

/**
 * 職業頁籤主組件
 */
const ProfessionTab = () => {
	const { player, getAvailableSkills } = useGame();
	const currentClassId = player.currentClassId;
	const currentClass = classes[currentClassId];

	// 獲取當前可用和鎖定的技能
	const { active, locked } = getAvailableSkills();

	// 依據技能類型分類
	const filterSkillsByType = (skills, type) =>
		skills.filter((skill) => currentClass.skills[type].includes(skill.id));

	return (
		<Box sx={{ p: 1.5 }}>
			{/* 職業資訊區 */}
			<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
				<IconButton
					size="small"
					sx={{
						mr: 1.5,
						width: 36,
						height: 36,
						"&:hover": {
							transform: "scale(1.1)",
						},
					}}
				>
					<Circle size={24} />
				</IconButton>
				<Box>
					<Typography variant="subtitle1">{currentClass.name}</Typography>
					<Typography variant="body2" color="text.secondary">
						{currentClass.description}
					</Typography>
				</Box>
			</Box>

			{/* 技能列表區 */}
			<Box sx={{ overflow: "auto", maxHeight: "calc(100% - 80px)" }}>
				<SkillSection
					title="基礎技能"
					active={filterSkillsByType(active, "basic")}
					locked={filterSkillsByType(locked, "basic")}
				/>
				<SkillSection
					title="進階技能"
					active={filterSkillsByType(active, "advanced")}
					locked={filterSkillsByType(locked, "advanced")}
				/>
				<SkillSection
					title="終極技能"
					active={filterSkillsByType(active, "ultimate")}
					locked={filterSkillsByType(locked, "ultimate")}
				/>
			</Box>
		</Box>
	);
};

export default ProfessionTab;
