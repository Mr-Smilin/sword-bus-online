import React, { useState, useMemo, useCallback } from "react";
import { Box, Typography, Tabs, Tab, Button } from "@mui/material";
import { ShoppingBag, Coins, ChevronLeft, ChevronRight } from "lucide-react";
import { useGame } from "../../contexts/GameContext";
import { useMap } from "../../contexts/MapContext";
import { getShopsByArea } from "../../data/shop/shopDefinitions";
import { items } from "../../data/item";
import { getShopDialog, getShopkeeperName } from "../../data/shop/shopDialogs";
import ShopItemList from "./ShopItemList";
import ShopItemDialog from "./ShopItemDialog";
import InventoryPanel from "../inventory/InventoryPanel";

/**
 * 商店面板組件
 */
const ShopPanel = () => {
	// 從上下文獲取資料
	const {
		player,
		getCurrencyBalance,
		addCurrency,
		deductCurrency,
		addToInventory,
		removeFromInventory,
		hasSufficientCurrency,
	} = useGame();
	const { currentArea } = useMap();

	// 商店相關狀態
	const [currentTab, setCurrentTab] = useState("buy"); // buy 或 sell
	const [selectedItem, setSelectedItem] = useState(null); // 選中的商品
	const [dialog, setDialog] = useState({
		content: "", // 對話內容
		type: "welcome", // 對話類型
	});

	// 背包展開狀態
	const [isInventoryExpanded, setIsInventoryExpanded] = useState(false);

	// 取得當前區域的商店
	const currentShop = useMemo(() => {
		const shops = getShopsByArea(currentArea.id);
		// 獲取商店資料後設置歡迎語
		const shop = shops[0];
		if (shop) {
			setDialog({
				content: getShopDialog(shop.id, "welcome"),
				type: "welcome",
			});
		}
		return shop;
	}, [currentArea.id]);

	// 根據物品類型分類商品 - 購買列表
	const categorizedItems = useMemo(() => {
		if (!currentShop) return {};

		return currentShop.items.reduce((acc, item) => {
			const itemData = items.find((i) => i.id === item.itemId);
			if (!itemData) return acc;

			if (!acc[itemData.type]) {
				acc[itemData.type] = [];
			}
			acc[itemData.type].push({
				...item,
				itemData,
			});

			return acc;
		}, {});
	}, [currentShop]);

	// 根據物品類型分類商品 - 販賣列表
	const categorizedInventory = useMemo(() => {
		if (!player?.inventory.state.items) return {};

		return player.inventory.state.items.reduce((acc, item) => {
			const itemData = items.find((i) => i.id === item.itemId);
			if (!itemData) return acc;

			// 無收購價的物品不顯示
			const shopItem = currentShop?.items.find(
				(si) => si.itemId === item.itemId
			);
			if (!shopItem?.buyPrice) return acc;

			if (!acc[itemData.type]) {
				acc[itemData.type] = [];
			}
			acc[itemData.type].push({
				...shopItem,
				itemData,
				quantity: item.quantity,
				slot: item.slot,
			});

			return acc;
		}, {});
	}, [player?.inventory.state.items, currentShop]);

	// 更新對話內容
	const updateDialog = useCallback(
		(type) => {
			if (!currentShop) return;
			setDialog({
				content: getShopDialog(currentShop.id, type),
				type,
			});
		},
		[currentShop]
	);

	// 處理商品點擊
	const handleItemClick = (item) => {
		setSelectedItem(item);
		updateDialog("introduce");
	};

	// 處理交易確認
	const handleTradeConfirm = (quantity) => {
		if (!selectedItem) return;

		if (currentTab === "buy") {
			// 購買邏輯
			const totalPrice = selectedItem.basePrice * quantity;
			if (deductCurrency("gold", totalPrice)) {
				addToInventory(selectedItem.itemId, quantity);
				updateDialog("thanks");
			}
		} else {
			// 販賣邏輯
			const totalPrice = selectedItem.buyPrice * quantity;
			if (removeFromInventory(selectedItem.slot, quantity)) {
				addCurrency("gold", totalPrice);
				updateDialog("thanks");
			}
		}

		setSelectedItem(null);
	};

	// 處理交易取消
	const handleTradeCancel = () => {
		if (
			selectedItem &&
			!hasSufficientCurrency("gold", selectedItem.basePrice)
		) {
			updateDialog("poorLeave");
		}
		setSelectedItem(null);
	};

	// 如果沒有商店資料，顯示提示訊息
	if (!currentShop) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography>此區域沒有商店</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				height: "100%",
				width: "100%",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* 整體容器 - 用於統一移動 */}
			<Box
				sx={{
					display: "flex",
					height: "100%",
					width: "100%", // 背包展開時增加寬度
					transform: isInventoryExpanded
						? "translateX(-400px)"
						: "translateX(0)", // 整體向左推移
					transition: "all 0.3s ease-in-out",
				}}
			>
				{/* 商店主要區域 */}
				<Box
					onClick={() => setIsInventoryExpanded(false)}
					sx={{
						flex: "0 0 100%", // 展開時縮小比例
						display: "flex",
						flexDirection: "column",
						transition: "flex 0.3s ease-in-out",
					}}
				>
					{/* 標題區域 */}
					<Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
							<ShoppingBag size={24} />
							<Typography variant="h6">
								{currentShop.name} - {getShopkeeperName(currentShop.id)}
							</Typography>
						</Box>
						{/* 店主對話 */}
						<Box
							sx={{
								p: 2,
								bgcolor: "background.default",
								borderRadius: 1,
								position: "relative",
							}}
						>
							<Typography variant="body2">{dialog.content}</Typography>
						</Box>
					</Box>

					{/* 玩家金幣顯示 */}
					<Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Coins size={20} />
							<Typography>持有金幣: {getCurrencyBalance("gold")}</Typography>
							<Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
								{/* 閒聊按鈕 */}
								<Button
									size="small"
									variant="outlined"
									onClick={() => updateDialog("chat")}
								>
									閒聊
								</Button>
								{/* 測試按鈕 */}
								<Button
									size="small"
									variant="outlined"
									onClick={() => addCurrency("gold", 50)}
								>
									測試: +50金幣
								</Button>
							</Box>
						</Box>
					</Box>

					{/* 購買/販賣切換 */}
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs
							value={currentTab}
							onChange={(_, newValue) => setCurrentTab(newValue)}
							variant="fullWidth"
						>
							<Tab label="購買" value="buy" />
							<Tab label="販賣" value="sell" />
						</Tabs>
					</Box>

					{/* 商品列表區域 */}
					<Box sx={{ flex: 1, overflow: "auto" }}>
						<ShopItemList
							items={
								currentTab === "buy" ? categorizedItems : categorizedInventory
							}
							mode={currentTab}
							onItemClick={handleItemClick}
						/>
					</Box>

					{/* 交易確認對話框 */}
					<ShopItemDialog
						open={!!selectedItem}
						item={selectedItem}
						mode={currentTab}
						onConfirm={handleTradeConfirm}
						onCancel={handleTradeCancel}
					/>
				</Box>

				{/* 背包抽屜 */}
				<Box
					sx={{
						flex: "0 0 400px",
						position: "relative",
						bgcolor: "background.paper",
						borderLeft: 1,
						borderColor: "divider",
					}}
				>
					{/* 展開/收合按鈕 */}
					<Button
						onClick={() => setIsInventoryExpanded(!isInventoryExpanded)}
						sx={{
							position: "absolute",
							left: -40,
							top: "5px",
							// transform: "translateY(-50%)",
							minWidth: "40px",
							width: "40px",
							height: "40px",
							borderRadius: "8px 0 0 8px",
							bgcolor: "background.paper",
							border: 1,
							borderRight: 0,
							borderColor: "divider",
							"&:hover": {
								bgcolor: "action.hover",
							},
						}}
					>
						{isInventoryExpanded ? <ChevronRight /> : <ChevronLeft />}
					</Button>

					{/* 背包內容 */}
					<Box
						sx={{
							width: "400px",
							height: "100%",
							overflow: "hidden",
						}}
					>
						<InventoryPanel />
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default ShopPanel;
