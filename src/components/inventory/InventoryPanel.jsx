import React, { useState, useCallback } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { Trash2, SortDesc, Dices, ChevronDown, ChevronUp } from "lucide-react";
import { useGame } from "../../contexts/GameContext";
import { useLayout } from "../../contexts";
import { items } from "../../data/item";
import InventoryGrid from "./InventoryGrid";
import ItemTooltip from "./ItemTooltip";
import DeleteItemDialog from "./DeleteItemDialog";

const InventoryPanel = () => {
	const { isInventoryExpanded, layoutActions } = useLayout();
	const {
		inventoryState,
		sortInventory,
		discardItems,
		removeFromInventory,
		addToInventory,
	} = useGame();

	// 隨機添加物品
	const handleAddRandomItem = () => {
		const availableItems = items.filter((item) => item.type !== "quest"); // 排除任務物品
		const randomItem =
			availableItems[Math.floor(Math.random() * availableItems.length)];
		if (randomItem) {
			// 隨機數量，可堆疊物品 1-5，不可堆疊物品固定 1
			const quantity = randomItem.stackable
				? Math.floor(Math.random() * 5) + 1
				: 1;
			addToInventory(randomItem.id, quantity);
		}
	};

	// 物品提示框狀態
	const [tooltipState, setTooltipState] = useState({
		show: false,
		itemId: null,
		quantity: 0,
		position: { x: 0, y: 0 },
	});

	// 刪除模式相關狀態
	const [isDeleteMode, setIsDeleteMode] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	// 處理格子點擊
	const handleSlotClick = useCallback(
		(slot, item) => {
			if (!item) return;

			if (isDeleteMode) {
				setSelectedItems((prev) => {
					const index = prev.findIndex((i) => i.slot === slot);
					if (index === -1) {
						return [
							...prev,
							{ slot, itemId: item.itemId, quantity: item.quantity },
						];
					} else {
						return prev.filter((_, i) => i !== index);
					}
				});
			}
		},
		[isDeleteMode]
	);

	// 處理物品懸浮
	const handleItemHover = useCallback((item, show, event) => {
		if (!item) {
			setTooltipState((prev) => ({ ...prev, show: false }));
			return;
		}

		if (show) {
			setTooltipState({
				show: true,
				itemId: item.itemId,
				quantity: item.quantity,
				position: {
					x: event.clientX,
					y: event.clientY,
				},
			});
		} else {
			setTooltipState((prev) => ({ ...prev, show: false }));
		}
	}, []);

	// 處理丟棄確認
	const handleDeleteConfirm = useCallback(
		(items, quantity) => {
			if (quantity) {
				// 單個堆疊物品的部分刪除
				removeFromInventory(items[0].slot, quantity);
			} else {
				// 批量刪除
				discardItems(items.map((item) => item.slot));
			}
			setSelectedItems([]);
			setShowDeleteDialog(false);
			setIsDeleteMode(false);
		},
		[removeFromInventory, discardItems]
	);

	return (
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			{/* 標題和操作按鈕 */}
			<Box
				sx={{
					p: 2,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderBottom: 1,
					borderColor: "divider",
					flexShrink: 0,
				}}
			>
				<Typography variant="h6">背包</Typography>
				<Box sx={{ display: "flex", gap: 1 }}>
					{/* 測試按鈕 */}
					<Button
						startIcon={<Dices size={18} />}
						onClick={handleAddRandomItem}
						variant="outlined"
						size="small"
						disabled={isDeleteMode}
					>
						隨機物品
					</Button>
					<Button
						startIcon={<SortDesc size={18} />}
						onClick={sortInventory}
						variant="outlined"
						size="small"
						disabled={isDeleteMode}
					>
						整理
					</Button>
					<Button
						startIcon={<Trash2 size={18} />}
						onClick={() => setIsDeleteMode(!isDeleteMode)}
						variant={isDeleteMode ? "contained" : "outlined"}
						color={isDeleteMode ? "error" : "primary"}
						size="small"
					>
						丟棄
					</Button>
					{/* 展開/收合按鈕 */}
					<IconButton
						size="small"
						onClick={layoutActions.toggleInventoryExpand}
						sx={{ ml: 1 }}
					>
						{isInventoryExpanded ? (
							<ChevronDown size={20} />
						) : (
							<ChevronUp size={20} />
						)}
					</IconButton>
				</Box>
			</Box>

			{/* 物品網格 */}
			<Box
				sx={{
					flex: 1, // 占用剩餘空間
					minHeight: 0, // 重要！允許 flex 子元素縮小
					overflow: "hidden", // 防止溢出
				}}
			>
				<InventoryGrid
					items={inventoryState.items}
					maxSlots={inventoryState.maxSlots}
					selectedItems={selectedItems.map((item) => item.slot)}
					deleteQueue={selectedItems.map((_, index) => index + 1)}
					onSlotClick={handleSlotClick}
					onItemHover={handleItemHover}
				/>
			</Box>

			{/* 刪除模式底部按鈕 */}
			{isDeleteMode && selectedItems.length > 0 && (
				<Box sx={{ p: 2, borderTop: 1, borderColor: "divider", flexShrink: 0 }}>
					<Button
						fullWidth
						variant="contained"
						color="error"
						onClick={() => setShowDeleteDialog(true)}
					>
						丟棄選擇的物品 ({selectedItems.length})
					</Button>
				</Box>
			)}

			{/* 物品提示框 */}
			<ItemTooltip {...tooltipState} />

			{/* 刪除確認對話框 */}
			<DeleteItemDialog
				open={showDeleteDialog}
				itemsToDelete={selectedItems}
				onConfirm={handleDeleteConfirm}
				onCancel={() => setShowDeleteDialog(false)}
			/>
		</Box>
	);
};

export default InventoryPanel;
