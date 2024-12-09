import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { items } from "../../data/item";
import { DEFAULT_INVENTORY_SETTINGS } from "../../data/inventory/settings";

const TooltipContainer = styled(Paper)(({ theme }) => ({
	position: "fixed",
	padding: theme.spacing(1.5),
	maxWidth: 250,
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[3],
	pointerEvents: "none",
	zIndex: theme.zIndex.tooltip,
}));

// 不同稀有度的顏色映射
const RARITY_COLORS = {
	common: "#9e9e9e", // 灰色
	uncommon: "#4caf50", // 綠色
	rare: "#2196f3", // 藍色
	epic: "#9c27b0", // 紫色
	legendary: "#ffc107", // 金色
};

const ItemTooltip = ({ itemId, position, quantity, show = true }) => {
	if (!show || !itemId) return null;

	const itemData = items.find((i) => i.id === itemId);
	if (!itemData) return null;

	console.log(position, itemData);

	return (
		<TooltipContainer
			style={{
				left: position.x + 20,
				top: position.y + 20,
			}}
		>
			<Typography
				variant="subtitle2"
				sx={{ color: RARITY_COLORS[itemData.rarity] }}
				gutterBottom
			>
				{itemData.name}
			</Typography>

			<Typography variant="body2" color="text.secondary" gutterBottom>
				{itemData.description}
			</Typography>

			<Box sx={{ mt: 1 }}>
				<Typography variant="caption" display="block" color="text.secondary">
					類型: {itemData.type}
				</Typography>
				{quantity > 1 && (
					<Typography variant="caption" display="block" color="text.secondary">
						數量: {quantity}
					</Typography>
				)}
				{itemData.stackable && (
					<Typography variant="caption" display="block" color="text.secondary">
						最大堆疊: {DEFAULT_INVENTORY_SETTINGS.maxStackByType[itemData.type]}
					</Typography>
				)}
				<Typography variant="caption" display="block" color="text.secondary">
					價值: {itemData.value} 金幣
				</Typography>
			</Box>
		</TooltipContainer>
	);
};

export default ItemTooltip;
