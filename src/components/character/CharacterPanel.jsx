import React from "react";
import { Paper, Typography, Box, Grid2 as Grid, Chip } from "@mui/material";
import {
	Swords, // 攻擊力
	Shield, // 防具
	ScrollText, // 文字卷軸
	Target, // 目標
	Zap, // 閃電/狀態
} from "lucide-react";

/**
 * 角色詳細資訊面板元件
 */
export const CharacterPanel = () => {
	return (
		<Paper sx={{ p: 3 }}>
			{/* 角色基本資訊 */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="h5" gutterBottom>
					角色資訊
				</Typography>
				<Grid container spacing={2}>
					<Grid xs={12} sm={6}>
						<Typography variant="subtitle1">名稱: 測試角色</Typography>
					</Grid>
					<Grid xs={12} sm={6}>
						<Typography variant="subtitle1">職業: 戰士</Typography>
					</Grid>
				</Grid>
			</Box>

			<Box
				sx={{
					width: "100%",
					height: "1px",
					bgcolor: "divider",
					my: 2,
				}}
			/>

			{/* 詳細屬性 */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="h6" gutterBottom>
					詳細屬性
				</Typography>
				<Grid container spacing={3}>
					{/* 基礎屬性 */}
					<Grid xs={12} md={6}>
						<Box sx={{ mb: 2 }}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
								<ScrollText size={20} />
								<Typography variant="subtitle1" sx={{ ml: 1 }}>
									基礎屬性
								</Typography>
							</Box>
							<Box sx={{ pl: 3 }}>
								<Typography variant="body2" gutterBottom>
									力量: 15 (+2)
								</Typography>
								<Typography variant="body2" gutterBottom>
									敏捷: 12 (+1)
								</Typography>
								<Typography variant="body2" gutterBottom>
									智力: 8 (+0)
								</Typography>
							</Box>
						</Box>
					</Grid>

					{/* 戰鬥屬性 */}
					<Grid xs={12} md={6}>
						<Box sx={{ mb: 2 }}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
								<Swords size={20} />
								<Typography variant="subtitle1" sx={{ ml: 1 }}>
									戰鬥屬性
								</Typography>
							</Box>
							<Box sx={{ pl: 3 }}>
								<Typography variant="body2" gutterBottom>
									物理攻擊: 150-180
								</Typography>
								<Typography variant="body2" gutterBottom>
									魔法攻擊: 50-65
								</Typography>
							</Box>
						</Box>
					</Grid>

					{/* 防禦屬性 */}
					<Grid xs={12} md={6}>
						<Box sx={{ mb: 2 }}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
								<Shield size={20} />
								<Typography variant="subtitle1" sx={{ ml: 1 }}>
									防禦屬性
								</Typography>
							</Box>
							<Box sx={{ pl: 3 }}>
								<Typography variant="body2" gutterBottom>
									物理防禦: 120
								</Typography>
								<Typography variant="body2" gutterBottom>
									魔法防禦: 80
								</Typography>
							</Box>
						</Box>
					</Grid>

					{/* 特殊屬性 */}
					<Grid xs={12} md={6}>
						<Box>
							<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
								<Target size={20} />
								<Typography variant="subtitle1" sx={{ ml: 1 }}>
									特殊屬性
								</Typography>
							</Box>
							<Box sx={{ pl: 3 }}>
								<Typography variant="body2" gutterBottom>
									暴擊率: 15%
								</Typography>
								<Typography variant="body2" gutterBottom>
									暴擊傷害: 150%
								</Typography>
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Box>

			<Box
				sx={{
					width: "100%",
					height: "1px",
					bgcolor: "divider",
					my: 2,
				}}
			/>

			{/* 狀態效果 */}
			<Box>
				<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
					<Zap size={20} />
					<Typography variant="h6" sx={{ ml: 1 }}>
						狀態效果
					</Typography>
				</Box>
				<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
					<Chip label="力量增加 10%" color="primary" />
					<Chip label="防禦增加 5%" color="success" />
				</Box>
			</Box>
		</Paper>
	);
};
