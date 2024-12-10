// components/inventory/InventoryGrid.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLayout } from "../../contexts";
import { Box } from "@mui/material";
import { FixedSizeGrid as Grid } from "react-window";
import { styled } from "@mui/material/styles";
import InventorySlot from "./InventorySlot";
import { DEFAULT_INVENTORY_SETTINGS } from "../../data/inventory/settings";
import { items as allItem } from "../../data/item";
import SplitStackDialog from "./SplitStackDialog";

/**
 * 背包網格容器
 */
const GridContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	paddingRight: 0,
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
 * @param {Array} items - 物品列表
 * @param {number} maxSlots - 最大格子數
 * @param {Array} selectedItems - 選中的格子列表
 * @param {Array} deleteQueue - 待刪除的格子列表
 * @param {Function} onSlotClick - 格子點擊處理
 * @param {Function} onItemHover - 物品懸浮處理
 * @param {Function} onMoveItem - 物品移動處理
 * @param {Function} onSplitStack - 堆疊拆分處理
 */
const InventoryGrid = ({
	items = [], // 物品列表
	maxSlots = DEFAULT_INVENTORY_SETTINGS.defaultMaxSlots, // 最大格子數
	selectedItems = [], // 選中的格子列表
	deleteQueue = [], // 待刪除的格子列表
	onSlotClick, // 格子點擊回調
	onItemHover, // 物品懸浮回調
	onMoveItem, // 移動物品回調
	onSplitStack, // 物品拆分回調
}) => {
	// 容器引用，用於測量大小
	const containerRef = useRef(null);

	const { isInventoryExpanded } = useLayout();
	const [showSplitDialog, setShowSplitDialog] = useState(false);
	const [dragData, setDragData] = useState(null);
	const [targetSlot, setTargetSlot] = useState(null);

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
				const availableWidth = containerWidth - 28; // 扣除padding

				// 計算最佳列數和格子大小
				let columnCount = Math.floor(availableWidth / (baseSlotSize + gap));
				columnCount = Math.max(4, Math.min(12, columnCount)); // 限制列數範圍

				// 計算實際格子大小
				let slotSize = Math.floor(
					(availableWidth - (columnCount - 1) * gap) / columnCount
				);
				slotSize = Math.max(minSlotSize, Math.min(maxSlotSize, slotSize));

				// 更新布局
				setLayout((prevLayout) => ({
					...prevLayout,
					columnCount,
					slotSize,
					containerWidth: availableWidth,
				}));
			}
		});

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (isInventoryExpanded)
			setLayout((prevLayout) => ({
				...prevLayout,
				containerHeight: 600,
			}));
		else
			setLayout((prevLayout) => ({
				...prevLayout,
				containerHeight: 300,
			}));
	}, [isInventoryExpanded]);

	// 計算行數
	const rowCount = Math.ceil(maxSlots / layout.columnCount);

	/**
	 * 處理物品放置
	 */
	const handleDrop = (data, targetSlot) => {
		if (data.sourceSlot === targetSlot) return;

		const sourceItem = items.find((item) => item.slot === data.sourceSlot);
		const targetItem = items.find((item) => item.slot === targetSlot);

		// 判斷是否需要拆分堆疊
		if (
			sourceItem &&
			data.stackable &&
			sourceItem.quantity > 1 &&
			(!targetItem || targetItem.itemId === sourceItem.itemId)
		) {
			setDragData(data);
			setTargetSlot(targetSlot);
			setShowSplitDialog(true);
			return;
		}

		// 一般移動
		onMoveItem?.(data.sourceSlot, targetSlot);
	};

	/**
	 * 處理堆疊拆分確認
	 */
	const handleSplitConfirm = (amount) => {
		setShowSplitDialog(false);
		if (dragData && targetSlot !== null) {
			// 如果選擇了全部數量，使用一般移動
			if (
				amount ===
				items.find((item) => item.slot === dragData.sourceSlot)?.quantity
			) {
				onMoveItem?.(dragData.sourceSlot, targetSlot);
			} else {
				// 否則使用拆分
				onSplitStack?.(dragData.sourceSlot, targetSlot, amount);
			}
		}
		setDragData(null);
		setTargetSlot(null);
	};

	/**
	 * 渲染單個格子
	 */
	const Cell = ({ columnIndex, rowIndex, style }) => {
		const slotIndex = rowIndex * layout.columnCount + columnIndex;

		// 超出最大格子數不渲染
		if (slotIndex >= maxSlots) return null;

		// 查找格子中的物品
		const item = items.find((item) => item.slot === slotIndex);
		const isSelected = selectedItems.includes(slotIndex) ? "true" : undefined;
		const deleteIndex = deleteQueue.indexOf(slotIndex) + 1;
		const isDragTarget = targetSlot === slotIndex ? "true" : undefined;

		// 調整格子樣式
		const adjustedStyle = {
			...style,
			width: layout.slotSize,
			height: layout.slotSize,
			padding: gap / 2,
			...(isDragTarget && {
				backgroundColor: "rgba(25, 118, 210, 0.1)",
				borderRadius: 4,
			}),
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
					onDragStart={(slot) => {
						console.log("Drag start:", slot);
					}}
					onDragEnd={() => {
						// 清理拖曳狀態
						console.log("Drag end");
					}}
					onDragOver={(slot) => {
						// 處理拖曳經過的視覺反饋
						console.log("Drag over:", slot);
					}}
					onDrop={(data, slot) => handleDrop(data, slot)}
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

			<SplitStackDialog
				open={showSplitDialog}
				itemData={
					dragData ? allItem.find((i) => i.id === dragData.itemId) : null
				}
				quantity={dragData?.quantity || 0}
				onConfirm={handleSplitConfirm}
				onCancel={() => {
					setShowSplitDialog(false);
					setDragData(null);
					setTargetSlot(null);
				}}
			/>
		</GridContainer>
	);
};

export default InventoryGrid;
