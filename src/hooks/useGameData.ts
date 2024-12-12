import { useCallback, useState, useEffect } from "react";
import {
	BaseCharacterStats,
	CharacterStats,
	PlayerData,
	Item,
	InventoryState,
	InventoryItem,
	Weapon,
	Class,
	Skill,
	WeaponType,
	EffectType,
	CurrencyType,
	CurrencyData,
} from "../data/type";
import { items } from "../data/item";
import { weapons } from "../data/weapons";
import { classes, classMap } from "../data/classes/";
import { skills, skillsByClass, skillMap } from "../data/skills/";
import {
	DEFAULT_INVENTORY_SETTINGS,
	ITEM_TYPE_WEIGHT,
} from "../data/inventory/settings";

/**
 * 角色裝備欄位類型定義
 */
interface EquipmentSlots {
	weapon: Weapon | null;
}

/**
 * 計算下一等級所需經驗值
 * @param level 當前等級
 * @returns 升級所需經驗值
 */
const calculateExpToNextLevel = (level: number): number => {
	return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * 計算角色成長屬性
 * @param baseStats 基礎屬性
 * @param growthStats 成長係數
 * @param level 當前等級
 * @returns 計算後的屬性值
 */
const calculateStatGrowth = (
	baseStats: BaseCharacterStats,
	growthStats: Class["growthStats"],
	level: number
): CharacterStats => {
	return {
		...baseStats,
		level,
		experience: 0,
		nextLevelExp: calculateExpToNextLevel(level),
		health: Math.floor(baseStats.health + growthStats.health * (level - 1)),
		currentHealth: Math.floor(
			baseStats.health + growthStats.health * (level - 1)
		),
		mana: Math.floor(baseStats.mana + growthStats.mana * (level - 1)),
		currentMana: Math.floor(baseStats.mana + growthStats.mana * (level - 1)),
		strength: Math.floor(
			baseStats.strength + growthStats.strength * (level - 1)
		),
		dexterity: Math.floor(
			baseStats.dexterity + growthStats.dexterity * (level - 1)
		),
		intelligence: Math.floor(
			baseStats.intelligence + growthStats.intelligence * (level - 1)
		),
	};
};

/**
 * 遊戲數據管理 Hook
 * @param playerData 玩家資料
 * @param onPlayerChange 角色情報更新回調
 * @returns 遊戲數據和操作方法
 */
export const useGameData = (
	playerData?: PlayerData,
	onPlayerChange?: (newPlayer: PlayerData) => void
) => {
	// 當前職業資訊
	const [currentClass, setCurrentClass] = useState<Class | null>(null);

	// 背包系統
	const [inventoryState, setInventoryState] = useState<InventoryState>({
		items: [],
		maxSlots: DEFAULT_INVENTORY_SETTINGS.defaultMaxSlots,
	});

	// 裝備系統
	const [equipment, setEquipment] = useState<EquipmentSlots>({
		weapon: null,
	});

	// 技能冷卻系統
	const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>(
		{}
	);

	// 角色效果系統
	const [activeEffects, setActiveEffects] = useState<
		Record<EffectType, number>
	>({} as Record<EffectType, number>);

	/**
	 * 初始化職業系統
	 */
	const initializeClassSystem = useCallback((data: PlayerData) => {
		if (!!data.currentClassId) {
			setCurrentClass(classes[data.currentClassId]);
		}
	}, []);

	/**
	 * 初始化背包系統
	 */
	const initializeInventorySystem = useCallback((data: PlayerData) => {
		if (!!data.inventory?.state) {
			setInventoryState(data.inventory.state);
		} else {
			// 如果沒有背包狀態，則設置預設狀態
			setInventoryState({
				items: [],
				maxSlots: DEFAULT_INVENTORY_SETTINGS.defaultMaxSlots,
			});
		}
	}, []);

	/**
	 * 初始化裝備系統
	 */
	const initializeEquipmentSystem = useCallback((data: PlayerData) => {
		if (!!data.equipped) {
			const weapon = data.equipped.weapon
				? weapons.find((w) => w.id === data.equipped.weapon)
				: null;
			setEquipment({ weapon });
		}
	}, []);

	/**
	 * 初始化效果系統
	 */
	const initializeEffectSystem = useCallback((data: PlayerData) => {
		// 重置效果系統
		setActiveEffects({} as Record<EffectType, number>);
		setSkillCooldowns({});
	}, []);

	/**
	 * 初始化
	 */
	useEffect(() => {
		if (!playerData) return;

		try {
			// 職業系統初始化
			initializeClassSystem(playerData);

			// 背包系統初始化
			initializeInventorySystem(playerData);

			// 裝備系統初始化
			initializeEquipmentSystem(playerData);

			// 效果系統初始化
			initializeEffectSystem(playerData);
		} catch (error) {
			console.error("Failed to initialize game systems:", error);
			// 可以在這裡添加錯誤處理邏輯
		}
	}, [
		playerData,
		initializeClassSystem,
		initializeInventorySystem,
		initializeEquipmentSystem,
		initializeEffectSystem,
	]);

	// 更新當前生命值
	const updateCurrentHealth = useCallback(
		(amount: number) => {
			if (!playerData?.characterStats) return;
			const maxHealth = playerData.characterStats.health;
			const newStats = {
				...playerData,
				characterStats: {
					...playerData.characterStats,
					currentHealth: Math.min(
						Math.max(0, playerData.characterStats.currentHealth + amount),
						maxHealth
					),
				},
			};
			onPlayerChange?.(newStats);
		},
		[playerData, onPlayerChange]
	);

	// 更新當前魔力值
	const updateCurrentMana = useCallback(
		(amount: number) => {
			if (!playerData?.characterStats) return;
			const maxMana = playerData.characterStats.mana;
			const newStats = {
				...playerData,
				characterStats: {
					...playerData.characterStats,
					currentMana: Math.min(
						Math.max(0, playerData.characterStats.currentHealth + amount),
						maxMana
					),
				},
			};
			onPlayerChange?.(newStats);
		},
		[playerData, onPlayerChange]
	);

	// 根據等級更新當前狀態
	const updatePlayerByLevel = useCallback(
		(level: number, doUpdate: boolean = true) => {
			if (!level || level <= 0 || !playerData?.characterStats || !currentClass)
				return;

			// 先計算基礎屬性成長
			const baseStats = calculateStatGrowth(
				currentClass.baseStats,
				currentClass.growthStats,
				level
			);

			// 計算升級所需經驗值
			const nextLevelExp = calculateExpToNextLevel(level);

			// 檢查職業進階獎勵
			const levelBonuses = currentClass.progression
				.filter((prog) => prog.level <= level)
				.reduce(
					(acc, prog) => ({
						strength: (acc.strength || 0) + (prog.attributeBonus.strength || 0),
						dexterity:
							(acc.dexterity || 0) + (prog.attributeBonus.dexterity || 0),
						intelligence:
							(acc.intelligence || 0) + (prog.attributeBonus.intelligence || 0),
						health: (acc.health || 0) + (prog.attributeBonus.health || 0),
						mana: (acc.mana || 0) + (prog.attributeBonus.mana || 0),
					}),
					{
						strength: 0,
						dexterity: 0,
						intelligence: 0,
						health: 0,
						mana: 0,
					}
				);

			// 合併基礎屬性和獎勵
			const finalStats = {
				...baseStats,
				level,
				nextLevelExp,
				health: baseStats.health + (levelBonuses.health || 0),
				currentHealth: baseStats.health + (levelBonuses.health || 0), // 升級時回滿血量
				mana: baseStats.mana + (levelBonuses.mana || 0),
				currentMana: baseStats.mana + (levelBonuses.mana || 0), // 升級時回滿魔力
				strength: baseStats.strength + (levelBonuses.strength || 0),
				dexterity: baseStats.dexterity + (levelBonuses.dexterity || 0),
				intelligence: baseStats.intelligence + (levelBonuses.intelligence || 0),
				experience: 0, // 升級後經驗歸零
			};

			// 檢查當前等級可以解鎖的技能
			const classProgression = currentClass.progression.find(
				(prog) => prog.level === level
			);

			// 取得已解鎖技能列表
			const currentUnlockedSkills = new Set(
				playerData.classProgress?.[currentClass.id]?.unlockedSkills || []
			);

			// 將新技能加入集合中 (Set 會自動去除重複項目)
			classProgression?.unlockedSkills.forEach((skillId) => {
				currentUnlockedSkills.add(skillId);
			});

			// 建立新的玩家資料
			const newPlayer = {
				...playerData,
				characterStats: finalStats,
				classProgress: {
					...playerData.classProgress,
					[currentClass.id]: {
						...playerData.classProgress?.[currentClass.id],
						unlockedSkills: Array.from(currentUnlockedSkills),
					},
				},
			};

			// 根據 doUpdate 決定是更新還是返回
			if (doUpdate) {
				onPlayerChange?.(newPlayer);
			} else {
				return newPlayer;
			}
		},
		[playerData, currentClass, onPlayerChange]
	);

	/**
	 * 增加經驗值並處理升級
	 */
	const gainExperience = useCallback(
		(amount: number): void => {
			if (!playerData?.characterStats || !currentClass) return;
			const characterStats = playerData.characterStats;

			const newStats = (() => {
				let newExp = characterStats.experience + amount;
				let newLevel = characterStats.level;
				let newNextLevelExp = characterStats.nextLevelExp;

				// 檢查是否升級
				while (newExp >= newNextLevelExp) {
					newExp -= newNextLevelExp;
					newLevel++;
					newNextLevelExp = calculateExpToNextLevel(newLevel);
				}

				// 如果升級了才計算新的屬性值
				if (newLevel > characterStats.level) {
					const newPlayer = updatePlayerByLevel(newLevel, false);
					return {
						...newPlayer,
						characterStats: {
							...newPlayer.characterStats,
							experience: newExp,
						},
					};
				}

				// 沒升級就只更新經驗值
				return {
					...playerData,
					characterStats: {
						...characterStats,
						experience: newExp,
						nextLevelExp: newNextLevelExp,
					},
				};
			})();

			onPlayerChange?.(newStats);
		},
		[playerData, currentClass, onPlayerChange, updatePlayerByLevel]
	);

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
	 */
	const addToInventory = useCallback(
		(itemId: string, quantity: number = 1): boolean => {
			// 基礎檢查
			if (quantity <= 0) return false;

			const item = items.find((i) => i.id === itemId);
			if (!item) return false;

			// 檢查背包是否已滿
			if (inventoryState.items.length >= inventoryState.maxSlots) return false;

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

				// 更新玩家資料
				if (onPlayerChange && playerData) {
					onPlayerChange({
						...playerData,
						inventory: {
							...playerData.inventory,
							state: newState,
							// 添加操作歷史
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

				return newState;
			});

			return true;
		},
		[inventoryState, findEmptySlot, onPlayerChange, playerData]
	);

	/**
	 * 從背包移除物品
	 */
	const removeFromInventory = useCallback(
		(slot: number, quantity: number = 1): boolean => {
			if (quantity <= 0) return false;

			setInventoryState((prev) => {
				const item = prev.items.find((i) => i.slot === slot);
				if (!item) return prev;

				let newItems = [...prev.items];
				if (item.quantity <= quantity) {
					newItems = newItems.filter((i) => i.slot !== slot);
				} else {
					newItems = newItems.map((i) =>
						i.slot === slot ? { ...i, quantity: i.quantity - quantity } : i
					);
				}

				const newState = {
					...prev,
					items: newItems,
				};

				// 更新玩家資料
				if (onPlayerChange && playerData) {
					onPlayerChange({
						...playerData,
						inventory: {
							...playerData.inventory,
							state: newState,
							actionHistory: [
								...(playerData.inventory.actionHistory || []),
								{
									type: "remove",
									itemId: item.itemId,
									quantity,
									fromSlot: slot,
									timestamp: Date.now(),
								},
							],
						},
					});
				}

				return newState;
			});

			return true;
		},
		[onPlayerChange, playerData]
	);

	/**
	 * 移動背包物品
	 */
	const moveItem = useCallback(
		(fromSlot: number, toSlot: number): boolean => {
			if (fromSlot === toSlot) return false;

			setInventoryState((prev) => {
				const fromItem = prev.items.find((i) => i.slot === fromSlot);
				if (!fromItem) return prev;

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

				// 更新玩家資料
				if (onPlayerChange && playerData) {
					onPlayerChange({
						...playerData,
						inventory: {
							...playerData.inventory,
							state: newState,
							actionHistory: [
								...(playerData.inventory.actionHistory || []),
								{
									type: "move",
									itemId: fromItem.itemId,
									quantity: fromItem.quantity,
									fromSlot,
									toSlot,
									timestamp: Date.now(),
								},
							],
						},
					});
				}

				return newState;
			});

			return true;
		},
		[onPlayerChange, playerData]
	);

	/**
	 * 整理背包
	 * 按照物品類型和ID排序，並自動堆疊
	 */
	const sortInventory = useCallback(() => {
		setInventoryState((prev) => {
			// 1. 收集所有物品資訊
			const itemsWithInfo = prev.items
				.map((invItem) => {
					const itemData = items.find((i) => i.id === invItem.itemId);
					return {
						...invItem,
						itemData,
					};
				})
				.filter((item) => !!item.itemData);

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

			// 更新玩家資料
			if (onPlayerChange && playerData) {
				onPlayerChange({
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

			return newState;
		});
	}, [onPlayerChange, playerData]);

	/**
	 * 拆分堆疊
	 * @param fromSlot 要拆分的物品所在格子
	 * @param toSlot 目標格子
	 * @param quantity 要拆分的數量
	 */
	const splitStack = useCallback(
		(fromSlot: number, toSlot: number, quantity: number): boolean => {
			if (quantity <= 0) return false;

			setInventoryState((prev) => {
				// 檢查源物品
				const sourceItem = prev.items.find((i) => i.slot === fromSlot);
				if (!sourceItem || sourceItem.quantity <= quantity) return prev;

				// 檢查目標格子
				const targetItem = prev.items.find((i) => i.slot === toSlot);

				// 如果目標格子有物品，檢查是否可以堆疊
				if (targetItem) {
					if (targetItem.itemId !== sourceItem.itemId) return prev;

					const maxStack =
						DEFAULT_INVENTORY_SETTINGS.maxStackByType[
							items.find((i) => i.id === sourceItem.itemId)?.type || "misc"
						];

					if (targetItem.quantity + quantity > maxStack) return prev;
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
				if (!targetItem) {
					newItems.push({
						itemId: sourceItem.itemId,
						quantity,
						slot: toSlot,
					});
				}

				const newState = {
					...prev,
					items: newItems,
				};

				// 更新玩家資料
				if (onPlayerChange && playerData) {
					onPlayerChange({
						...playerData,
						inventory: {
							...playerData.inventory,
							state: newState,
							actionHistory: [
								...(playerData.inventory.actionHistory || []),
								{
									type: "split",
									itemId: sourceItem.itemId,
									quantity,
									fromSlot,
									toSlot,
									timestamp: Date.now(),
								},
							],
						},
					});
				}

				return newState;
			});

			return true;
		},
		[onPlayerChange, playerData]
	);

	/**
	 * 使用物品
	 * @param slot 要使用的物品所在格子
	 */
	const useItem = useCallback(
		(slot: number): boolean => {
			setInventoryState((prev) => {
				const item = prev.items.find((i) => i.slot === slot);
				if (!item) return prev;

				// 檢查物品是否可以使用
				const itemData = items.find((i) => i.id === item.itemId);
				if (!itemData?.usable) return prev;

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

				// 更新玩家資料
				if (onPlayerChange && playerData) {
					onPlayerChange({
						...playerData,
						inventory: {
							...playerData.inventory,
							state: newState,
							actionHistory: [
								...(playerData.inventory.actionHistory || []),
								{
									type: "use",
									itemId: item.itemId,
									quantity: 1,
									fromSlot: slot,
									timestamp: Date.now(),
								},
							],
						},
					});
				}

				return newState;
			});

			return true;
		},
		[onPlayerChange, playerData]
	);

	/**
	 * 檢查物品是否可以堆疊到指定位置
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
	 * 批量丟棄物品
	 * @param slots 要丟棄的格子編號列表
	 */
	const discardItems = useCallback(
		(slots: number[]): boolean => {
			if (slots.length === 0) return false;

			setInventoryState((prev) => {
				// 過濾掉不存在的格子
				const validSlots = slots.filter((slot) =>
					prev.items.some((item) => item.slot === slot)
				);

				if (validSlots.length === 0) return prev;

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

				// 更新玩家資料
				if (onPlayerChange && playerData) {
					onPlayerChange({
						...playerData,
						inventory: {
							...playerData.inventory,
							state: newState,
							actionHistory: [
								...(playerData.inventory.actionHistory || []),
								...discardedItems.map((item) => ({
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

				return newState;
			});

			return true;
		},
		[onPlayerChange, playerData]
	);

	/**
	 * 檢查是否可以裝備武器
	 */
	const canEquipWeapon = useCallback(
		(weapon: Weapon): boolean => {
			if (!currentClass || !playerData?.characterStats) return false;
			const characterStats = playerData.characterStats;

			if (!currentClass.allowedWeapons.includes(weapon.type)) return false;

			if (weapon.requirements) {
				const { requirements } = weapon;
				if (
					(requirements.level && characterStats.level < requirements.level) ||
					(requirements.strength &&
						characterStats.strength < requirements.strength) ||
					(requirements.dexterity &&
						characterStats.dexterity < requirements.dexterity) ||
					(requirements.intelligence &&
						characterStats.intelligence < requirements.intelligence)
				) {
					return false;
				}
			}

			return true;
		},
		[currentClass, playerData?.characterStats]
	);

	/**
	 * 裝備武器
	 */
	const equipWeapon = useCallback(
		(weapon: Weapon): boolean => {
			if (!canEquipWeapon(weapon)) return false;

			setEquipment((prev) => ({
				...prev,
				weapon,
			}));

			return true;
		},
		[canEquipWeapon]
	);

	/**
	 * 使用技能
	 */
	const useSkill = useCallback(
		(skillId: string): boolean => {
			const skill = skillMap.get(skillId);
			if (!skill || !playerData?.characterStats) return false;
			const characterStats = playerData.characterStats;

			const now = Date.now();

			if (skillCooldowns[skillId] && now < skillCooldowns[skillId]) {
				return false;
			}

			if (characterStats.mana < skill.manaCost) {
				return false;
			}

			if (
				skill.requirements?.weapon &&
				(!equipment.weapon ||
					!skill.requirements.weapon.includes(equipment.weapon.type))
			) {
				return false;
			}

			setSkillCooldowns((prev) => ({
				...prev,
				[skillId]: now + skill.cooldown * 1000,
			}));

			// 更新魔力值
			const newStats = {
				...playerData,
				characterStats: {
					...characterStats,
					mana: characterStats.mana - skill.manaCost,
				},
			};
			onPlayerChange?.(newStats);

			// 處理技能效果
			if (skill.effects) {
				setActiveEffects((prev) => {
					const newEffects = { ...prev };
					skill.effects?.forEach((effect) => {
						if (Math.random() * 100 <= (effect.chance || 100)) {
							newEffects[effect.type] = now + effect.duration * 1000;
						}
					});
					return newEffects;
				});
			}

			return true;
		},
		[playerData, equipment.weapon, skillCooldowns, onPlayerChange]
	);

	/**
	 * 獲取技能冷卻時間
	 */
	const getSkillCooldown = useCallback(
		(skillId: string): number => {
			const endTime = skillCooldowns[skillId];
			if (!endTime) return 0;

			const remainingTime = Math.max(0, endTime - Date.now()) / 1000;
			return Math.round(remainingTime * 10) / 10;
		},
		[skillCooldowns]
	);

	/**
	 * 檢查效果是否活動中
	 */
	const isEffectActive = useCallback(
		(effectType: EffectType): boolean => {
			const endTime = activeEffects[effectType];
			return endTime ? Date.now() < endTime : false;
		},
		[activeEffects]
	);

	/**
	 * 檢查職業是否擁有該技能
	 */
	const isClassSkillAvailable = useCallback(
		(classId: string, skillId: string): boolean =>
			skillsByClass[classId]?.some((skill) => skill.id === skillId) ?? false,
		[]
	);

	/**
	 * 獲取所有當前職業已學習/未學習技能
	 */
	const getAvailableSkills = useCallback(() => {
		if (!playerData?.currentClassId || !currentClass)
			return {
				active: [],
				locked: [],
			};

		const checkRequirements = (skill: Skill): boolean => {
			if (!skill.requirements) return true;

			const { level, weapon } = skill.requirements;
			if (level && playerData.characterStats.level < level) return false;

			if (weapon && playerData.equipped.weapon) {
				const equippedWeaponType = weapons.find(
					(w) => w.id === playerData.equipped.weapon
				)?.type;
				return equippedWeaponType && weapon.includes(equippedWeaponType);
			}
			return true;
		};

		// 所有基礎/進階/終極技能ID
		const classSkillIds = [
			...currentClass.skills.basic,
			...currentClass.skills.advanced,
			...currentClass.skills.ultimate,
		];

		// 當前職業可學技能列表
		const classSkillList = skillsByClass[playerData.currentClassId] || [];

		// 額外已學技能列表
		const unlockedSkills =
			playerData.classProgress?.[playerData.currentClassId]?.unlockedSkills ||
			[];

		const skillsMap = {
			active: [] as Skill[],
			locked: [] as Skill[],
		};

		let useSkillIds = new Set<string>();

		// 處理職業技能
		classSkillList.forEach((skill) => {
			if (classSkillIds.includes(skill.id)) {
				if (!useSkillIds.has(skill.id)) {
					if (checkRequirements(skill)) {
						skillsMap.active.push(skill);
					} else {
						skillsMap.locked.push(skill);
					}
					useSkillIds.add(skill.id);
				}
			}
		});

		// 處理額外技能
		unlockedSkills.forEach((skillId) => {
			const skill = skillMap.get(skillId);
			if (skill && checkRequirements(skill) && !useSkillIds.has(skill.id)) {
				skillsMap.active.push(skill);
				useSkillIds.add(skill.id);
			}
		});

		return skillsMap;
	}, [playerData, currentClass]);

	/**
	 * 獲取當前經驗值百分比
	 */
	const getExpPercentage = useCallback((): number => {
		if (!playerData?.characterStats) return 0;
		const { experience, nextLevelExp } = playerData.characterStats;
		return (experience / nextLevelExp) * 100;
	}, [playerData?.characterStats]);

	/**
	 * 增加指定類型的貨幣
	 * @param type 貨幣類型
	 * @param amount 金額(需為正數)
	 */
	const addCurrency = useCallback(
		(type: CurrencyType, amount: number): boolean => {
			if (!playerData || amount <= 0) return false;

			const newPlayer = {
				...playerData,
				currency: {
					...playerData.currency,
					[type]: (playerData.currency[type] || 0) + amount,
				},
			};

			onPlayerChange?.(newPlayer);
			return true;
		},
		[playerData, onPlayerChange]
	);

	/**
	 * 扣除指定類型的貨幣
	 * @param type 貨幣類型
	 * @param amount 金額(需為正數)
	 * @returns 是否扣除成功
	 */
	const deductCurrency = useCallback(
		(type: CurrencyType, amount: number): boolean => {
			if (!playerData || amount <= 0) return false;

			// 檢查餘額是否足夠
			if ((playerData.currency[type] || 0) < amount) return false;

			const newPlayer = {
				...playerData,
				currency: {
					...playerData.currency,
					[type]: (playerData.currency[type] || 0) - amount,
				},
			};

			onPlayerChange?.(newPlayer);
			return true;
		},
		[playerData, onPlayerChange]
	);

	/**
	 * 檢查指定類型的貨幣是否足夠
	 * @param type 貨幣類型
	 * @param amount 要檢查的金額
	 */
	const hasSufficientCurrency = useCallback(
		(type: CurrencyType, amount: number): boolean => {
			if (!playerData || amount <= 0) return false;
			return (playerData.currency[type] || 0) >= amount;
		},
		[playerData]
	);

	/**
	 * 獲取指定類型的貨幣餘額
	 * @param type 貨幣類型
	 */
	const getCurrencyBalance = useCallback(
		(type: CurrencyType): number => {
			if (!playerData) return 0;
			return playerData.currency[type] || 0;
		},
		[playerData]
	);

	return {
		// 角色狀態相關
		updateCurrentHealth,
		updateCurrentMana,
		updatePlayerByLevel,

		// 背包相關
		inventoryState, // 背包狀態
		addToInventory, // 添加物品
		removeFromInventory, // 移除物品
		moveItem, // 移動物品
		splitStack, // 拆分堆疊
		sortInventory, // 整理背包
		useItem, // 使用物品
		canStackWith, // 檢查堆疊
		discardItems, // 批量丟棄

		// 裝備相關
		canEquipWeapon,
		equipWeapon,

		// 技能相關
		activeEffects,
		useSkill,
		getSkillCooldown,
		getAvailableSkills,
		isEffectActive,
		isClassSkillAvailable,

		// 經驗值相關
		gainExperience,
		getExpPercentage,

		// 貨幣相關
		addCurrency,
		deductCurrency,
		hasSufficientCurrency,
		getCurrencyBalance,
	};
};
