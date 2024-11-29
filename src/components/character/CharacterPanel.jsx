import React from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import {
	CircleUser, // 角色圖標
	Swords, // 力量圖標
	Wind, // 敏捷圖標
	Brain, // 智力圖標
	Star, // 等級圖標
	Heart, // 生命值圖標
} from "lucide-react";
import { useGame } from "../../contexts/GameContext";
import { classes } from "../../data/classes";
import { weapons } from "../../data/weapons";

/**
 * 屬性資訊組件
 */
const StatInfo = ({ icon: Icon, label, value }) => (
	<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
		<Icon size={16} />
		<Typography variant="body2">
			{label}: {value}
		</Typography>
	</Box>
);

/**
 * 角色資訊面板組件
 */
export const CharacterPanel = () => {
	const { player } = useGame();

	if (!player) {
		return (
			<Paper sx={{ p: 3 }}>
				<Typography>載入中...</Typography>
			</Paper>
		);
	}

	const { characterStats, currentClassId } = player;
	const currentClass = classes[currentClassId];

	return (
		<Paper sx={{ p: 3 }}>
			{/* 基本資訊區 */}
			<Box sx={{ mb: 3 }}>
				<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
					<CircleUser size={24} />
					<Typography variant="h6" sx={{ ml: 1 }}>
						基本資訊
					</Typography>
				</Box>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<Typography variant="body1">名稱：{player.name}</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography variant="body1">
							職業：{currentClass.name} (Lv.{characterStats.level})
						</Typography>
					</Grid>
				</Grid>
			</Box>

			{/* 基礎屬性區 */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="subtitle2" gutterBottom>
					基礎屬性
				</Typography>
				<Box sx={{ pl: 1 }}>
					<StatInfo icon={Heart} label="生命值" value={characterStats.health} />
					<StatInfo icon={Brain} label="魔力值" value={characterStats.mana} />
					<StatInfo
						icon={Swords}
						label="力量"
						value={characterStats.strength}
					/>
					<StatInfo icon={Wind} label="敏捷" value={characterStats.dexterity} />
					<StatInfo
						icon={Brain}
						label="智力"
						value={characterStats.intelligence}
					/>
				</Box>
			</Box>

			{/* 裝備資訊區 */}
			{player.equipped?.weapon && (
				<Box>
					<Typography variant="subtitle2" gutterBottom>
						裝備武器
					</Typography>
					<Typography variant="body2">
						{weapons.find((w) => w.id === player.equipped.weapon)?.name ||
							"未知武器"}
					</Typography>
				</Box>
			)}
		</Paper>
	);
};

export default CharacterPanel;
