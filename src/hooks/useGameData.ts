import { useState, useCallback } from "react";
import { PlayerData, InventoryState } from "../data/type";
import { useUpdateQueue } from "./useUpdateQueue";

// 導入所有子系統
import { useGameCharacter } from "./useGameData/useGameCharacter";
import { useGameInventory } from "./useGameData/useGameInventory";
import { useGameCurrency } from "./useGameData/useGameCurrency";
import { useGameEquipment } from "./useGameData/useGameEquipment";
import { useGameSkill } from "./useGameData/useGameSkill";
import { useGameEffect } from "./useGameData/useGameEffect";
import { DEFAULT_INVENTORY_SETTINGS } from "../data/inventory/settings";

type PlayerDataUpdater = PlayerData | ((prev: PlayerData) => PlayerData);

/**
 * 遊戲核心數據 Hook
 * @param playerData 玩家資料
 * @param onPlayerChange 更新玩家資料的callback
 */
export const useGameData = (
	playerData: PlayerData | undefined,
	onPlayerChange?: (newPlayer: PlayerData) => void
) => {
	// 初始化更新佇列
	const { update } = useUpdateQueue<PlayerData>(playerData, onPlayerChange);

	// 背包狀態管理
	const [inventoryState, setInventoryState] = useState<InventoryState>(() => ({
		items: playerData?.inventory?.state?.items || [],
		maxSlots:
			playerData?.inventory?.state?.maxSlots ||
			DEFAULT_INVENTORY_SETTINGS.defaultMaxSlots,
	}));

	// 初始化所有子系統
	const {
		updateCurrentHealth,
		updateCurrentMana,
		updatePlayerByLevel,
		gainExperience,
		getExpPercentage,
	} = useGameCharacter(playerData, update);

	const {
		findEmptySlot,
		addToInventory,
		removeFromInventory,
		moveItem,
		splitStack,
		sortInventory,
		useItem,
		canStackWith,
		discardItems,
	} = useGameInventory(playerData, inventoryState, setInventoryState, update);

	const {
		addCurrency,
		deductCurrency,
		hasSufficientCurrency,
		getCurrencyBalance,
	} = useGameCurrency(playerData, update);

	const {
		equipment,
		canEquipWeapon,
		equipWeapon,
		unequipWeapon,
		calculateEquipmentBonus,
		hasEquippedWeaponType,
		getEquippedWeapon,
	} = useGameEquipment(playerData, update);

	const {
		canUseSkill,
		useSkill,
		getSkillCooldown,
		isEffectActive: isSkillEffectActive,
		getAvailableSkills,
		isClassSkillAvailable,
	} = useGameSkill(playerData, getEquippedWeapon()?.type, update);

	const {
		addEffect,
		removeEffect,
		clearEffects,
		hasEffect,
		getEffectDuration,
		calculateEffectStats,
		activeEffects,
	} = useGameEffect(playerData, update);

	return {
		// 背包相關
		inventoryState,
		findEmptySlot,
		addToInventory,
		removeFromInventory,
		moveItem,
		splitStack,
		sortInventory,
		useItem,
		canStackWith,
		discardItems,

		// 角色相關
		updateCurrentHealth,
		updateCurrentMana,
		updatePlayerByLevel,
		gainExperience,
		getExpPercentage,

		// 貨幣相關
		addCurrency,
		deductCurrency,
		hasSufficientCurrency,
		getCurrencyBalance,

		// 裝備相關
		equipment,
		canEquipWeapon,
		equipWeapon,
		unequipWeapon,
		calculateEquipmentBonus,
		hasEquippedWeaponType,
		getEquippedWeapon,

		// 技能相關
		canUseSkill,
		useSkill,
		getSkillCooldown,
		isClassSkillAvailable,
		getAvailableSkills,

		// 效果相關
		addEffect,
		removeEffect,
		clearEffects,
		hasEffect,
		getEffectDuration,
		calculateEffectStats,
		activeEffects,
		isSkillEffectActive,
	};
};
