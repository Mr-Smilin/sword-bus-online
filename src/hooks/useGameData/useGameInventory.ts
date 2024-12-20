import { useCallback } from "react";
import {
	PlayerData,
	InventoryState,
	InventoryItem,
	Item,
} from "../../data/type";
import { items } from "../../data/item";
import {
	DEFAULT_INVENTORY_SETTINGS,
	ITEM_TYPE_WEIGHT,
} from "../../data/inventory/settings";

/**
 * 背包系統 Hook
 * @param playerData 玩家資料
 * @param inventoryState 背包狀態
 * @param setInventoryState 更新背包狀態的方法
 * @param onPlayerChange 更新玩家資料的callback
 */
export const useGameInventory = (
	playerData: PlayerData | undefined,
	inventoryState: InventoryState,
	setInventoryState: React.Dispatch<React.SetStateAction<InventoryState>>,
	onPlayerChange?: (newPlayer: PlayerData) => Promise<void>
) => {
	/**
	 * 尋找空的背包格子
	 */
	const findEmptySlot = useCallback((): number => {
		const usedSlots = new Set(inventoryState.items.map((item) => item.slot));
		for (let i = 0; i < DEFAULT_INVENTORY_SETTINGS.defaultMaxSlots; i++) {
			if (!usedSlots.has(i)) return i;
		}
		return -1;
	}, [inventoryState]);

	/**
	 * 將物品添加到背包
	 * @param itemId 物品ID
	 * @param quantity 數量
	 */
	const addToInventory = useCallback(
		async (itemId: string, quantity: number = 1): Promise<boolean> => {
			if (quantity <= 0) return false;

			const item = items.find((i) => i.id === itemId);
			if (!item) return false;

			// 檢查背包是否已滿
			if (inventoryState.items.length >= inventoryState.maxSlots) return false;

			// 創建異步更新函數
			const updateInventory = async () => {
				return new Promise<InventoryState>((resolve) => {
					setInventoryState((prev) => {
						let newItems = [...prev.items];
						let remainingQuantity = quantity;

						// 如果物品可堆疊，先嘗試堆疊到現有物品上
						if (item.stackable) {
							const maxStack =
								DEFAULT_INVENTORY_SETTINGS.maxStackByType[item.type] || 1;

							newItems = newItems.map((existingItem) => {
								if (
									existingItem.itemId !== itemId ||
									existingItem.quantity >= maxStack
								) {
									return existingItem;
								}

								const canAdd = Math.min(
									remainingQuantity,
									maxStack - existingItem.quantity
								);
								remainingQuantity -= canAdd;

								return {
									...existingItem,
									quantity: existingItem.quantity + canAdd,
								};
							});
						}

						// 如果還有剩餘數量，創建新的物品堆疊
						while (remainingQuantity > 0 && newItems.length < prev.maxSlots) {
							const emptySlot = findEmptySlot();
							if (emptySlot === -1) break;

							const maxStack = item.stackable
								? DEFAULT_INVENTORY_SETTINGS.maxStackByType[item.type] || 1
								: 1;
							const stackQuantity = Math.min(remainingQuantity, maxStack);

							newItems.push({
								itemId,
								quantity: stackQuantity,
								slot: emptySlot,
							});

							remainingQuantity -= stackQuantity;
						}

						const newState = {
							...prev,
							items: newItems,
						};

						resolve(newState);
						return newState;
					});
				});
			};

			// 執行庫存更新
			const newState = await updateInventory();

			// 更新玩家資料
			if (onPlayerChange && playerData) {
				await onPlayerChange({
					...playerData,
					inventory: {
						...playerData.inventory,
						state: newState,
						actionHistory: [
							...(playerData.inventory.actionHistory || []),
							{
								type: "add",
								itemId,
								quantity,
								timestamp: Date.now(),
							},
						],
					},
				});
			}

			return true;
		},
		[
			inventoryState,
			findEmptySlot,
			playerData,
			onPlayerChange,
			setInventoryState,
		]
	);

	/**
	 * 從背包移除物品
	 * @param slot 格子位置
	 * @param quantity 數量
	 */
	const removeFromInventory = useCallback(
		async (slot: number, quantity: number = 1): Promise<boolean> => {
			if (quantity <= 0) return false;

			// 創建異步更新函數
			const updateInventory = async () => {
				return new Promise<InventoryState>((resolve) => {
					setInventoryState((prev) => {
						const item = prev.items.find((i) => i.slot === slot);
						if (!item) {
							resolve(prev);
							return prev;
						}

						const newItems = prev.items
							.map((i) => {
								if (i.slot !== slot) return i;

								if (i.quantity <= quantity) {
									return null; // 將會被過濾掉
								}

								return {
									...i,
									quantity: i.quantity - quantity,
								};
							})
							.filter((i): i is InventoryItem => i !== null);

						const newState = {
							...prev,
							items: newItems,
						};

						resolve(newState);
						return newState;
					});
				});
			};

			// 執行庫存更新
			const newState = await updateInventory();

			// 更新玩家資料
			if (onPlayerChange && playerData) {
				await onPlayerChange({
					...playerData,
					inventory: {
						...playerData.inventory,
						state: newState,
						actionHistory: [
							...(playerData.inventory.actionHistory || []),
							{
								type: "remove",
								itemId:
									newState.items.find((i) => i.slot === slot)?.itemId || "",
								quantity,
								fromSlot: slot,
								timestamp: Date.now(),
							},
						],
					},
				});
			}

			return true;
		},
		[inventoryState, playerData, onPlayerChange, setInventoryState]
	);

	/**
	 * 移動背包物品
	 * @param fromSlot 來源格子
	 * @param toSlot 目標格子
	 */
	const moveItem = useCallback(
		async (fromSlot: number, toSlot: number): Promise<boolean> => {
			if (fromSlot === toSlot) return false;

			// 創建異步更新函數
			const updateInventory = async () => {
				return new Promise<InventoryState>((resolve) => {
					setInventoryState((prev) => {
						const fromItem = prev.items.find((i) => i.slot === fromSlot);
						if (!fromItem) {
							resolve(prev);
							return prev;
						}

						let newItems = [...prev.items];
						const toItem = newItems.find((i) => i.slot === toSlot);

						// 檢查是否可以堆疊
						if (
							toItem &&
							toItem.itemId === fromItem.itemId &&
							!!items.find((i) => i.id === toItem.itemId)?.stackable
						) {
							const maxStack =
								DEFAULT_INVENTORY_SETTINGS.maxStackByType[
									items.find((i) => i.id === toItem.itemId)?.type || "misc"
								];
							const totalQuantity = fromItem.quantity + toItem.quantity;

							if (totalQuantity <= maxStack) {
								// 可以完全堆疊
								newItems = newItems.filter((i) => i.slot !== fromSlot);
								newItems = newItems.map((i) =>
									i.slot === toSlot ? { ...i, quantity: totalQuantity } : i
								);
							} else {
								// 部分堆疊
								newItems = newItems.map((i) => {
									if (i.slot === toSlot) {
										return { ...i, quantity: maxStack };
									}
									if (i.slot === fromSlot) {
										return { ...i, quantity: totalQuantity - maxStack };
									}
									return i;
								});
							}
						} else {
							// 直接交換位置
							newItems = newItems.map((i) => {
								if (i.slot === fromSlot) {
									return { ...i, slot: toSlot };
								}
								if (i.slot === toSlot) {
									return { ...i, slot: fromSlot };
								}
								return i;
							});
						}

						const newState = {
							...prev,
							items: newItems,
						};

						resolve(newState);
						return newState;
					});
				});
			};

			// 執行庫存更新
			const newState = await updateInventory();

			// 更新玩家資料
			if (onPlayerChange && playerData) {
				await onPlayerChange({
					...playerData,
					inventory: {
						...playerData.inventory,
						state: newState,
						actionHistory: [
							...(playerData.inventory.actionHistory || []),
							{
								type: "move",
								itemId:
									newState.items.find((i) => i.slot === toSlot)?.itemId || "",
								quantity:
									newState.items.find((i) => i.slot === toSlot)?.quantity || 0,
								fromSlot,
								toSlot,
								timestamp: Date.now(),
							},
						],
					},
				});
			}

			return true;
		},
		[inventoryState, playerData, onPlayerChange, setInventoryState]
	);

	/**
	 * 整理背包
	 * 按照物品類型和ID排序，並自動堆疊
	 */
	const sortInventory = useCallback(async () => {
		// 創建異步更新函數
		const updateInventory = async () => {
			return new Promise<InventoryState>((resolve) => {
				setInventoryState((prev) => {
					// 1. 收集所有物品資訊
					const itemsWithInfo = prev.items
						.map((invItem) => ({
							...invItem,
							itemData: items.find((i) => i.id === invItem.itemId),
						}))
						.filter(
							(item): item is typeof item & { itemData: Item } =>
								!!item.itemData
						);

					// 2. 合併可堆疊物品
					const itemGroups = new Map<string, typeof itemsWithInfo>();
					itemsWithInfo.forEach((item) => {
						const existingGroup = itemGroups.get(item.itemId) || [];
						itemGroups.set(item.itemId, [...existingGroup, item]);
					});

					// 3. 重新分配堆疊和位置
					const newItems: InventoryItem[] = [];
					const sortedIds = Array.from(itemGroups.keys()).sort((a, b) => {
						const itemA = items.find((i) => i.id === a);
						const itemB = items.find((i) => i.id === b);
						if (!itemA || !itemB) return 0;

						// 按類型排序
						const typeCompare =
							ITEM_TYPE_WEIGHT[itemA.type] - ITEM_TYPE_WEIGHT[itemB.type];
						if (typeCompare !== 0) return typeCompare;

						// 同類型按ID排序
						return itemA.id.localeCompare(itemB.id);
					});

					let currentSlot = 0;
					sortedIds.forEach((id) => {
						const group = itemGroups.get(id) || [];
						const itemData = items.find((i) => i.id === id);
						if (!itemData) return;

						if (itemData.stackable) {
							const maxStack =
								DEFAULT_INVENTORY_SETTINGS.maxStackByType[itemData.type];
							let totalQuantity = group.reduce(
								(sum, item) => sum + item.quantity,
								0
							);

							while (totalQuantity > 0 && currentSlot < prev.maxSlots) {
								const stackSize = Math.min(totalQuantity, maxStack);
								newItems.push({
									itemId: id,
									quantity: stackSize,
									slot: currentSlot,
								});
								totalQuantity -= stackSize;
								currentSlot++;
							}
						} else {
							group.forEach((item) => {
								if (currentSlot < prev.maxSlots) {
									newItems.push({
										itemId: id,
										quantity: 1,
										slot: currentSlot,
									});
									currentSlot++;
								}
							});
						}
					});

					const newState = {
						...prev,
						items: newItems,
					};

					resolve(newState);
					return newState;
				});
			});
		};

		// 執行庫存更新
		const newState = await updateInventory();

		// 更新玩家資料
		if (onPlayerChange && playerData) {
			await onPlayerChange({
				...playerData,
				inventory: {
					...playerData.inventory,
					state: newState,
					actionHistory: [
						...(playerData.inventory.actionHistory || []),
						{
							type: "sort",
							itemId: "",
							quantity: 0,
							timestamp: Date.now(),
						},
					],
				},
			});
		}
	}, [inventoryState, playerData, onPlayerChange, setInventoryState]);

	/**
	 * 拆分堆疊
	 * @param fromSlot 來源格子
	 * @param toSlot 目標格子
	 * @param quantity 拆分數量
	 */
	const splitStack = useCallback(
		async (
			fromSlot: number,
			toSlot: number,
			quantity: number
		): Promise<boolean> => {
			if (quantity <= 0) return false;

			// 創建異步更新函數
			const updateInventory = async () => {
				return new Promise<InventoryState>((resolve) => {
					setInventoryState((prev) => {
						const sourceItem = prev.items.find((i) => i.slot === fromSlot);
						if (!sourceItem || sourceItem.quantity <= quantity) {
							resolve(prev);
							return prev;
						}

						const targetItem = prev.items.find((i) => i.slot === toSlot);

						// 如果目標格子有物品，檢查是否可以堆疊
						if (targetItem) {
							if (targetItem.itemId !== sourceItem.itemId) {
								resolve(prev);
								return prev;
							}

							const maxStack =
								DEFAULT_INVENTORY_SETTINGS.maxStackByType[
									items.find((i) => i.id === sourceItem.itemId)?.type || "misc"
								];

							if (targetItem.quantity + quantity > maxStack) {
								resolve(prev);
								return prev;
							}
						}

						// 創建新的物品列表
						const newItems = prev.items.map((item) => {
							if (item.slot === fromSlot) {
								// 減少源堆疊數量
								return {
									...item,
									quantity: item.quantity - quantity,
								};
							}
							if (item.slot === toSlot && targetItem) {
								// 增加目標堆疊數量
								return {
									...item,
									quantity: item.quantity + quantity,
								};
							}
							return item;
						});

						// 如果目標格子是空的，創建新堆疊
						const finalItems = targetItem
							? newItems
							: [
									...newItems,
									{
										itemId: sourceItem.itemId,
										quantity,
										slot: toSlot,
									},
							  ];

						const newState = {
							...prev,
							items: finalItems,
						};

						resolve(newState);
						return newState;
					});
				});
			};

			// 執行庫存更新
			const newState = await updateInventory();

			// 更新玩家資料
			if (onPlayerChange && playerData) {
				await onPlayerChange({
					...playerData,
					inventory: {
						...playerData.inventory,
						state: newState,
						actionHistory: [
							...(playerData.inventory.actionHistory || []),
							{
								type: "split",
								itemId:
									newState.items.find((i) => i.slot === toSlot)?.itemId || "",
								quantity,
								fromSlot,
								toSlot,
								timestamp: Date.now(),
							},
						],
					},
				});
			}

			return true;
		},
		[inventoryState, playerData, onPlayerChange, setInventoryState]
	);

	/**
	 * 檢查物品是否可以堆疊到指定位置
	 * @param sourceItem 來源物品
	 * @param targetSlot 目標格子
	 */
	const canStackWith = useCallback(
		(sourceItem: InventoryItem, targetSlot: number): boolean => {
			const targetItem = inventoryState.items.find(
				(i) => i.slot === targetSlot
			);
			if (!targetItem) return true; // 空格子可以堆疊

			// 檢查是否是同一個物品
			if (sourceItem.itemId !== targetItem.itemId) return false;

			// 獲取物品資料
			const itemData = items.find((i) => i.id === sourceItem.itemId);
			if (!itemData?.stackable) return false;

			// 檢查堆疊上限
			const maxStack = DEFAULT_INVENTORY_SETTINGS.maxStackByType[itemData.type];
			return targetItem.quantity < maxStack;
		},
		[inventoryState.items]
	);

	/**
	 * 使用物品
	 * @param slot 格子位置
	 */
	const useItem = useCallback(
		async (slot: number): Promise<boolean> => {
			// 創建異步更新函數
			const updateInventory = async () => {
				return new Promise<InventoryState>((resolve) => {
					setInventoryState((prev) => {
						const item = prev.items.find((i) => i.slot === slot);
						if (!item) {
							resolve(prev);
							return prev;
						}

						// 檢查物品是否可以使用
						const itemData = items.find((i) => i.id === item.itemId);
						if (!itemData?.usable) {
							resolve(prev);
							return prev;
						}

						// 創建新的物品列表，數量減1
						const newItems = prev.items
							.map((i) => {
								if (i.slot === slot) {
									if (i.quantity <= 1) {
										return null; // 將會被過濾掉
									}
									return {
										...i,
										quantity: i.quantity - 1,
									};
								}
								return i;
							})
							.filter((i): i is InventoryItem => i !== null);

						const newState = {
							...prev,
							items: newItems,
						};

						resolve(newState);
						return newState;
					});
				});
			};

			// 執行庫存更新
			const newState = await updateInventory();

			// 更新玩家資料
			if (onPlayerChange && playerData) {
				await onPlayerChange({
					...playerData,
					inventory: {
						...playerData.inventory,
						state: newState,
						actionHistory: [
							...(playerData.inventory.actionHistory || []),
							{
								type: "use",
								itemId:
									newState.items.find((i) => i.slot === slot)?.itemId || "",
								quantity: 1,
								fromSlot: slot,
								timestamp: Date.now(),
							},
						],
					},
				});
			}

			return true;
		},
		[inventoryState, playerData, onPlayerChange, setInventoryState]
	);

	/**
	 * 批量丟棄物品
	 * @param slots 要丟棄的格子編號列表
	 */
	const discardItems = useCallback(
		async (slots: number[]): Promise<boolean> => {
			if (slots.length === 0) return false;

			// 創建異步更新函數
			const updateInventory = async () => {
				return new Promise<InventoryState>((resolve) => {
					setInventoryState((prev) => {
						// 過濾掉不存在的格子
						const validSlots = slots.filter((slot) =>
							prev.items.some((item) => item.slot === slot)
						);

						if (validSlots.length === 0) {
							resolve(prev);
							return prev;
						}

						// 創建新的物品列表，排除要丟棄的物品
						const newItems = prev.items.filter(
							(item) => !validSlots.includes(item.slot)
						);

						const newState = {
							...prev,
							items: newItems,
						};

						// 記錄要丟棄的物品資訊，用於歷史記錄
						const discardedItems = prev.items.filter((item) =>
							validSlots.includes(item.slot)
						);

						resolve(newState);
						return newState;
					});
				});
			};

			// 執行庫存更新
			const newState = await updateInventory();

			// 更新玩家資料
			if (onPlayerChange && playerData) {
				await onPlayerChange({
					...playerData,
					inventory: {
						...playerData.inventory,
						state: newState,
						actionHistory: [
							...(playerData.inventory.actionHistory || []),
							...newState.items
								.filter((item) => slots.includes(item.slot))
								.map((item) => ({
									type: "remove" as const,
									itemId: item.itemId,
									quantity: item.quantity,
									fromSlot: item.slot,
									timestamp: Date.now(),
								})),
						],
					},
				});
			}

			return true;
		},
		[inventoryState, playerData, onPlayerChange, setInventoryState]
	);

	return {
		findEmptySlot,
		addToInventory,
		removeFromInventory,
		moveItem,
		splitStack,
		sortInventory,
		useItem,
		canStackWith,
		discardItems,
	};
};
