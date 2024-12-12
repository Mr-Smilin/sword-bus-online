import React from "react";
import { Paper, Typography, Box, Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Coins, AlertCircle } from "lucide-react";
import { useGame } from "../../contexts/GameContext";

/**
 * 商品卡片容器樣式
 */
const ItemCard = styled(Paper)(({ theme }) => ({
	position: "relative",
	padding: theme.spacing(2),
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(1),
	cursor: "pointer",
	transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
	"&:hover": {
		transform: "translateY(-2px)",
		boxShadow: theme.shadows[4],
	},
}));

/**
 * 價格標籤樣式
 */
const PriceTag = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(0.5),
	padding: theme.spacing(0.5, 1),
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.background.default,
}));

/**
 * 商品卡片組件
 * @param {Object} props
 * @param {Object} props.item - 商品資料，包含商品基本資料和價格資訊
 * @param {string} props.mode - 'buy' 或 'sell' 模式
 * @param {Function} props.onClick - 點擊處理函數
 * @param {Function} props.onMouseEnter - 滑鼠進入處理函數
 * @param {Function} props.onMouseLeave - 滑鼠離開處理函數
 */
const ShopItemCard = ({ item, mode, onClick, onMouseEnter, onMouseLeave }) => {
	const { player, hasSufficientCurrency } = useGame();
	const { itemData, basePrice, buyPrice } = item;

	// 檢查是否符合購買條件
	const checkRequirements = () => {
		if (!player || !itemData) return { canBuy: false, reason: "無法購買" };

		// 檢查等級需求
		if (
			item.requiredLevel &&
			player.characterStats.level < item.requiredLevel
		) {
			return {
				canBuy: false,
				reason: `需要等級 ${item.requiredLevel}`,
			};
		}

		// 檢查金幣是否足夠
		const price = mode === "buy" ? basePrice : buyPrice;
		if (!hasSufficientCurrency("gold", price)) {
			return {
				canBuy: false,
				reason: "金幣不足",
			};
		}

		// 檢查庫存
		if (item.stock !== undefined && item.stock <= 0) {
			return {
				canBuy: false,
				reason: "已售完",
			};
		}

		return { canBuy: true, reason: "" };
	};

	const { canBuy, reason } = checkRequirements();
	const currentPrice = mode === "buy" ? basePrice : buyPrice;

	return (
		<ItemCard
			elevation={1}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{/* 物品名稱 */}
			<Typography variant="subtitle2">
				{itemData.name}
				{item.requiredLevel && (
					<Typography
						component="span"
						variant="caption"
						color="text.secondary"
						sx={{ ml: 1 }}
					>
						Lv.{item.requiredLevel}
					</Typography>
				)}
			</Typography>

			{/* 物品描述 */}
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{
					minHeight: "2.5em",
					display: "-webkit-box",
					WebkitLineClamp: 2,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
				}}
			>
				{itemData.description}
			</Typography>

			{/* 價格與購買按鈕 */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mt: "auto",
				}}
			>
				<PriceTag>
					<Coins size={16} />
					<Typography variant="body2">{currentPrice}</Typography>
				</PriceTag>

				{!canBuy ? (
					<Tooltip title={reason} arrow>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<AlertCircle size={16} color="error" />
						</Box>
					</Tooltip>
				) : (
					<Button
						size="small"
						variant="contained"
						onClick={(e) => {
							e.stopPropagation();
							onClick?.();
						}}
					>
						{mode === "buy" ? "購買" : "販賣"}
					</Button>
				)}
			</Box>

			{/* 庫存顯示 */}
			{item.stock !== undefined && (
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{
						position: "absolute",
						top: 8,
						right: 8,
					}}
				>
					庫存: {item.stock}
				</Typography>
			)}
		</ItemCard>
	);
};

export default ShopItemCard;
