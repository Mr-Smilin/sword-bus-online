// components/inventory/InventoryGrid.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLayout } from "../../contexts";
import { Box } from "@mui/material";
import { FixedSizeGrid as Grid } from "react-window";
import { styled } from "@mui/material/styles";
import InventorySlot from "./InventorySlot";
import { DEFAULT_INVENTORY_SETTINGS } from "../../data/inventory/settings";

/**
 * 背包網格容器
 */
const GridContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	backgroundColor: theme.palette.background.default,
	borderRadius: theme.shape.borderRadius,
	width: "100%",
	overflowX: "hidden",
	// 網格背景效果
	// backgroundImage: `linear-gradient(${theme.palette.divider} 1px, transparent 1px),
	//                linear-gradient(90deg, ${theme.palette.divider} 1px, transparent 1px)`,
	// backgroundSize: "52px 52px",
	// backgroundPosition: "-1px -1px",
}));

/**
 * 背包網格組件
 */
const InventoryGrid = ({
	items = [], // 物品列表
	maxSlots = DEFAULT_INVENTORY_SETTINGS.defaultMaxSlots, // 最大格子數
	selectedItems = [], // 選中的格子列表
	deleteQueue = [], // 待刪除的格子列表
	onSlotClick, // 格子點擊回調
	onItemHover, // 物品懸浮回調
}) => {
	const { isInventoryExpanded } = useLayout();
	// 容器引用，用於測量大小
	const containerRef = useRef(null);

	// 格子配置
	const baseSlotSize = 50; // 基礎格子大小
	const minSlotSize = 40; // 最小格子大小
	const maxSlotSize = 60; // 最大格子大小
	const gap = 4; // 格子間距

	// 布局狀態
	const [layout, setLayout] = useState({
		columnCount: 8, // 列數
		slotSize: baseSlotSize, // 實際格子大小
		containerHeight: 300, // 容器高度
		containerWidth: 0, // 容器寬度
	});

	/**
	 * 監聽容器大小變化並重新計算布局
	 */
	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				// 計算可用寬度
				const containerWidth = entry.contentRect.width;
				const availableWidth = containerWidth - 32; // 扣除padding

				// 計算最佳列數和格子大小
				let columnCount = Math.floor(availableWidth / (baseSlotSize + gap));
				columnCount = Math.max(4, Math.min(12, columnCount)); // 限制列數範圍

				// 計算實際格子大小
				let slotSize = Math.floor(
					(availableWidth - (columnCount - 1) * gap) / columnCount
				);
				slotSize = Math.max(minSlotSize, Math.min(maxSlotSize, slotSize));

				// 更新布局
				setLayout({
					...layout,
					columnCount,
					slotSize,
					containerWidth: availableWidth,
				});
			}
		});

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (isInventoryExpanded)
			setLayout({
				...layout,
				containerHeight: 600,
			});
		else
			setLayout({
				...layout,
				containerHeight: 300,
			});
	}, [isInventoryExpanded]);

	// 計算行數
	const rowCount = Math.ceil(maxSlots / layout.columnCount);

	/**
	 * 渲染單個格子
	 */
	const Cell = ({ columnIndex, rowIndex, style }) => {
		const slotIndex = rowIndex * layout.columnCount + columnIndex;

		// 超出最大格子數不渲染
		if (slotIndex >= maxSlots) return null;

		// 查找格子中的物品
		const item = items.find((item) => item.slot === slotIndex);
		const isSelected = selectedItems.includes(slotIndex) ? true : undefined;
		const deleteIndex = deleteQueue.indexOf(slotIndex) + 1;

		// 調整格子樣式
		const adjustedStyle = {
			...style,
			width: layout.slotSize,
			height: layout.slotSize,
			padding: gap / 2,
		};

		return (
			<div style={adjustedStyle}>
				<InventorySlot
					itemId={item?.itemId}
					quantity={item?.quantity || 0}
					slot={slotIndex}
					isselected={isSelected}
					deleteIndex={deleteIndex}
					onClick={() => onSlotClick?.(slotIndex, item)}
					onMouseEnter={(e) => onItemHover?.(item, true, e)}
					onMouseLeave={(e) => onItemHover?.(item, false, e)}
				/>
			</div>
		);
	};

	return (
		<GridContainer ref={containerRef}>
			<Box sx={{ width: "100%" }}>
				<Grid
					columnCount={layout.columnCount}
					columnWidth={layout.slotSize + gap}
					height={layout.containerHeight}
					rowCount={rowCount}
					rowHeight={layout.slotSize + gap}
					width={layout.containerWidth}
					itemData={items}
					style={{ overflowX: "hidden" }}
					overscanRowCount={2}
				>
					{Cell}
				</Grid>
			</Box>
		</GridContainer>
	);
};

export default InventoryGrid;
