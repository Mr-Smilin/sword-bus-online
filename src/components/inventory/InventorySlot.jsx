// components/inventory/InventorySlot.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { items } from "../../data/item";

/**
 * 背包格子容器
 * 根據物品狀態不同顯示不同樣式
 */
const SlotContainer = styled(Box)(({ theme, isEmpty, isSelected }) => ({
	// 基礎樣式
	width: "100%",
	height: "100%",
	border: `2px solid ${
		isSelected ? theme.palette.error.main : theme.palette.divider
	}`,
	borderRadius: theme.shape.borderRadius,
	backgroundColor: isEmpty ? "transparent" : theme.palette.background.paper,
	position: "relative",
	cursor: "pointer",

	// 動畫效果
	transition: theme.transitions.create(
		["border-color", "transform", "box-shadow"],
		{
			duration: theme.transitions.duration.shortest,
		}
	),

	// 懸浮效果
	"&:hover": {
		borderColor: theme.palette.primary.main,
		transform: "translateY(-2px)",
		boxShadow: `0 2px 4px ${theme.palette.action.hover}`,
	},
}));

/**
 * 物品堆疊數量顯示
 */
const ItemQuantity = styled(Typography)(({ theme }) => ({
	position: "absolute",
	bottom: 2,
	right: 2,
	fontSize: "0.75rem",
	color: theme.palette.text.secondary,
	backgroundColor: theme.palette.background.paper,
	padding: "0 4px",
	borderRadius: theme.shape.borderRadius,
	minWidth: "20px",
	textAlign: "center",
}));

/**
 * 刪除序號標記
 */
const DeleteNumber = styled(Box)(({ theme }) => ({
	position: "absolute",
	top: -8,
	right: -8,
	width: "20px",
	height: "20px",
	borderRadius: "50%",
	backgroundColor: theme.palette.error.main,
	color: theme.palette.error.contrastText,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "0.75rem",
	fontWeight: "bold",
}));

/**
 * 背包格子組件
 * @param {string} itemId - 物品ID
 * @param {number} quantity - 物品數量
 * @param {number} slot - 格子位置
 * @param {boolean} isSelected - 是否被選中（用於刪除模式）
 * @param {number} deleteIndex - 刪除序號（0表示未選擇刪除）
 * @param {function} onClick - 點擊事件處理
 * @param {function} onMouseEnter - 鼠標進入事件處理
 * @param {function} onMouseLeave - 鼠標離開事件處理
 */
const InventorySlot = ({
	itemId,
	quantity,
	slot,
	isSelected,
	deleteIndex,
	onClick,
	onMouseEnter,
	onMouseLeave,
}) => {
	// 從物品庫獲取物品資料
	const itemData = items.find((i) => i.id === itemId);
	const isEmpty = !itemData;

	return (
		<SlotContainer
			isEmpty={isEmpty}
			isSelected={isSelected}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{!isEmpty && (
				<>
					{/* 物品圖示 - 暫時使用物品名稱首字作為替代 */}
					<Box
						sx={{
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "text.primary",
						}}
					>
						<Typography variant="body2">{itemData.name[0]}</Typography>
					</Box>

					{/* 物品數量顯示 - 僅在數量大於1時顯示 */}
					{quantity > 1 && (
						<ItemQuantity variant="caption">{quantity}</ItemQuantity>
					)}

					{/* 刪除序號 - 僅在刪除模式且被選中時顯示 */}
					{deleteIndex > 0 && <DeleteNumber>{deleteIndex}</DeleteNumber>}
				</>
			)}
		</SlotContainer>
	);
};

export default InventorySlot;
