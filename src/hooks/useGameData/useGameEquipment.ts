import { useCallback, useState, useEffect } from "react";
import {
	PlayerData,
	Weapon,
	WeaponType,
	EquipmentSlots,
	Class,
} from "../../data/type";
import { weapons } from "../../data/weapons";
import { classes } from "../../data/classes";

/**
 * 裝備系統 Hook
 * @param playerData 玩家資料
 * @param onPlayerChange 更新玩家資料的callback
 */
export const useGameEquipment = (
	playerData: PlayerData | undefined,
	onPlayerChange?: (newPlayer: PlayerData) => Promise<void>
) => {
	// 裝備狀態
	const [equipment, setEquipment] = useState<EquipmentSlots>({
		weapon: null,
	});

	// 當前職業資料
	const [currentClass, setCurrentClass] = useState<Class | null>(null);

	// 初始化
	useEffect(() => {
		if (!!playerData) {
			// 初始化現有裝備
			if (!!playerData.equipped.weapon) {
				const weapon = weapons.find((w) => w.id === playerData.equipped.weapon);
				setEquipment((prev) => ({
					...prev,
					weapon: weapon || null,
				}));
			}

			// 初始化職業資料
			if (!!playerData.currentClassId) {
				setCurrentClass(classes[playerData.currentClassId]);
			}
		}
	}, [playerData]);

	/**
	 * 檢查是否可以裝備武器
	 * @param weapon 要檢查的武器
	 * @returns 是否可以裝備
	 */
	const canEquipWeapon = useCallback(
		(weapon: Weapon): boolean => {
			if (!currentClass || !playerData?.characterStats) return false;

			// 檢查職業是否可以使用該武器類型
			if (!currentClass.allowedWeapons.includes(weapon.type)) return false;

			// 檢查各項需求
			if (weapon.requirements) {
				const { requirements } = weapon;
				const { characterStats } = playerData;

				// 等級需求
				if (requirements.level && characterStats.level < requirements.level) {
					return false;
				}

				// 力量需求
				if (
					requirements.strength &&
					characterStats.strength < requirements.strength
				) {
					return false;
				}

				// 敏捷需求
				if (
					requirements.dexterity &&
					characterStats.dexterity < requirements.dexterity
				) {
					return false;
				}

				// 智力需求
				if (
					requirements.intelligence &&
					characterStats.intelligence < requirements.intelligence
				) {
					return false;
				}
			}

			return true;
		},
		[currentClass, playerData?.characterStats]
	);

	/**
	 * 計算裝備提供的屬性加成
	 * @returns 裝備屬性加成值
	 */
	const calculateEquipmentBonus = useCallback(() => {
		const bonus = {
			strength: 0,
			dexterity: 0,
			intelligence: 0,
		};

		if (equipment.weapon?.attributes) {
			const { attributes } = equipment.weapon;
			if (attributes.strength) bonus.strength += attributes.strength;
			if (attributes.dexterity) bonus.dexterity += attributes.dexterity;
			if (attributes.intelligence)
				bonus.intelligence += attributes.intelligence;
		}

		return bonus;
	}, [equipment]);

	/**
	 * 裝備武器
	 * @param weapon 要裝備的武器
	 */
	const equipWeapon = useCallback(
		async (weapon: Weapon): Promise<boolean> => {
			if (!canEquipWeapon(weapon)) return false;

			// 更新裝備狀態
			setEquipment((prev) => ({
				...prev,
				weapon,
			}));

			// 更新玩家資料
			if (onPlayerChange && playerData) {
				await onPlayerChange({
					...playerData,
					equipped: {
						...playerData.equipped,
						weapon: weapon.id,
					},
				});
			}

			return true;
		},
		[canEquipWeapon, playerData, onPlayerChange]
	);

	/**
	 * 移除武器裝備
	 */
	const unequipWeapon = useCallback(async () => {
		// 更新裝備狀態
		setEquipment((prev) => ({
			...prev,
			weapon: null,
		}));

		// 更新玩家資料
		if (onPlayerChange && playerData) {
			await onPlayerChange({
				...playerData,
				equipped: {
					...playerData.equipped,
					weapon: undefined,
				},
			});
		}

		return true;
	}, [playerData, onPlayerChange]);

	/**
	 * 檢查是否裝備了指定類型的武器
	 * @param type 武器類型
	 */
	const hasEquippedWeaponType = useCallback(
		(type: WeaponType): boolean => {
			return equipment.weapon?.type === type;
		},
		[equipment.weapon]
	);

	/**
	 * 檢查裝備的耐久度並在必要時進行維修
	 * @param threshold 觸發維修的耐久度閾值(百分比)
	 */
	const checkAndRepairEquipment = useCallback(
		(threshold: number = 20): void => {
			if (!equipment.weapon) return;

			const durabilityPercentage =
				(equipment.weapon.durability.current /
					equipment.weapon.durability.max) *
				100;

			if (durabilityPercentage <= threshold) {
				// TODO: 實現修理邏輯
				// 需要考慮:
				// 1. 修理費用
				// 2. 是否在城鎮
				// 3. 是否有修理道具
			}
		},
		[equipment.weapon]
	);

	/**
	 * 獲取已裝備的武器資訊
	 */
	const getEquippedWeapon = useCallback(
		(): Weapon | null => equipment.weapon,
		[equipment.weapon]
	);

	return {
		equipment,
		canEquipWeapon,
		equipWeapon,
		unequipWeapon,
		calculateEquipmentBonus,
		hasEquippedWeaponType,
		checkAndRepairEquipment,
		getEquippedWeapon,
	};
};
