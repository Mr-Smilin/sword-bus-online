import React from "react";
import { Box, Typography, IconButton, Tooltip, Grid } from "@mui/material";
import { Circle } from "lucide-react";
import { useGame } from "../../contexts/GameContext";

/**
 * 技能圖示組件
 * @param {Object} props - 組件屬性
 * @param {Object} props.skill - 技能資訊
 * @param {boolean} props.isLearned - 是否已學習
 */
const SkillIcon = ({ skill, isLearned }) => {
	return (
		<Tooltip
			title={
				<Box>
					<Typography variant="subtitle2">{skill.name}</Typography>
					<Typography variant="body2">{skill.description}</Typography>
					<Typography variant="caption">
						魔力消耗: {skill.manaCost} | 冷卻時間: {skill.cooldown}秒
					</Typography>
				</Box>
			}
		>
			<Box
				sx={{
					width: 40,
					height: 40,
					borderRadius: 1,
					border: "1px solid",
					borderColor: "divider",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					opacity: isLearned ? 1 : 0.5,
					cursor: "pointer",
					transition: "all 0.2s",
					"&:hover": {
						borderColor: "primary.main",
						transform: "scale(1.05)",
					},
				}}
			>
				<Typography variant="caption">{skill.name.charAt(0)}</Typography>
			</Box>
		</Tooltip>
	);
};

/**
 * 技能類別區塊
 * @param {Object} props - 組件屬性
 * @param {string} props.title - 區塊標題
 * @param {Array} props.skills - 技能列表
 * @param {Array} props.learnedSkills - 已學習技能ID列表
 */
const SkillSection = ({ title, skills, learnedSkills }) => {
	if (!skills || skills.length === 0) return null;

	return (
		<Box sx={{ mb: 2 }}>
			<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
				{title}
			</Typography>
			<Grid container spacing={1}>
				{skills.map((skill) => (
					<Grid item key={skill.id}>
						<SkillIcon
							skill={skill}
							isLearned={learnedSkills.includes(skill.id)}
						/>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

/**
 * 職業頁籤主組件
 */
const ProfessionTab = () => {
	const { currentClass, skillsByClass } = useGame();

	// 如果沒有職業資料，顯示提示訊息
	if (!currentClass) {
		return (
			<Box sx={{ p: 1.5 }}>
				<Typography>尚未選擇職業</Typography>
			</Box>
		);
	}

	// 將技能依類型分類
	const classSkills = skillsByClass[currentClass.id] || [];
	const basicSkills = classSkills.filter((skill) =>
		currentClass.skills.basic.includes(skill.id)
	);
	const advancedSkills = classSkills.filter((skill) =>
		currentClass.skills.advanced.includes(skill.id)
	);
	const ultimateSkills = classSkills.filter((skill) =>
		currentClass.skills.ultimate.includes(skill.id)
	);

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
					onClick={() => console.log("開啟職業視窗")}
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
					skills={basicSkills}
					learnedSkills={currentClass.skills.basic}
				/>
				<SkillSection
					title="進階技能"
					skills={advancedSkills}
					learnedSkills={currentClass.skills.advanced}
				/>
				{ultimateSkills.length > 0 && (
					<SkillSection
						title="終極技能"
						skills={ultimateSkills}
						learnedSkills={currentClass.skills.ultimate}
					/>
				)}
			</Box>
		</Box>
	);
};

export default ProfessionTab;
