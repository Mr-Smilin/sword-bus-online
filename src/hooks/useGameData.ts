import { useState, useCallback } from "react";
import { flushSync } from "react-dom";
import { toast } from "../utils/toast";
import {
    GameSaveData,
    PlayerData,
    CurrencyType,
    Item,
    InventoryItem,
    InventoryState,
    Weapon,
    Class,
    Skill,
    WeaponType,
    EffectType,
} from "../data/type";
import { items } from "../data/item";
import { weapons } from "../data/weapons";
import { classes } from "../data/classes";
import { skills, skillsByClass } from "../data/skills";
import { DEFAULT_INVENTORY_SETTINGS } from "../data/inventory/settings";
import { GameAction } from "../reducers/actionTypes";

/**
 * 遊戲數據管理 Hook
 * @param saveData 遊戲存檔資料
 * @param dispatch Reducer 的 dispatch 方法
 */
export const useGameData = (
    saveData: GameSaveData | null,
    dispatch: React.Dispatch<GameAction>,
) => {
    const playerData = saveData?.player;
    const inventoryState = playerData?.inventory.state;

    //#region 貨幣系統

    /**
     * 添加指定類型的貨幣
     * @param type 貨幣類型
     * @param amount 金額(需為正數)
     * @returns 是否添加成功
     */
    const addCurrency = useCallback(
        (type: CurrencyType, amount: number): boolean => {
            if (!playerData || amount <= 0) return false;

            dispatch({
                type: "UPDATE_CURRENCY",
                payload: {
                    type,
                    amount: (playerData.currency[type] || 0) + amount,
                },
            });

            return true;
        },
        [playerData, dispatch],
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

            dispatch({
                type: "UPDATE_CURRENCY",
                payload: {
                    type,
                    amount: (playerData.currency[type] || 0) - amount,
                },
            });

            return true;
        },
        [playerData, dispatch],
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
        [playerData],
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
        [playerData],
    );

    //#endregion

    //#region 背包系統

    /**
     * 尋找空的背包格子
     * @returns 找到的空格索引，找不到返回-1
     */
    const findEmptySlot = useCallback((): number => {
        if (!inventoryState) return -1;
        const usedSlots = new Set(
            inventoryState.items.map((item) => item.slot),
        );
        for (let i = 0; i < DEFAULT_INVENTORY_SETTINGS.defaultMaxSlots; i++) {
            if (!usedSlots.has(i)) return i;
        }
        return -1;
    }, [inventoryState]);

    /**
     * 將物品添加到背包
     * @param itemId 物品ID
     * @param quantity 數量
     * @returns 是否添加成功
     */
    const addToInventory = useCallback(
        (itemId: string, quantity: number = 1): boolean => {
            // 基礎檢查
            if (!inventoryState || quantity <= 0) return false;
            const item = items.find((i) => i.id === itemId);
            if (!item) return false;

            // 檢查背包是否已滿
            if (inventoryState.items.length >= inventoryState.maxSlots)
                return false;

            // 更新背包
            dispatch({
                type: "UPDATE_INVENTORY",
                payload: {
                    items: (() => {
                        let newItems = [...inventoryState.items];
                        let remainingQuantity = quantity;

                        // 如果物品可堆疊，先嘗試堆疊到現有物品上
                        if (item.stackable) {
                            const maxStack =
                                DEFAULT_INVENTORY_SETTINGS.maxStackByType[
                                    item.type
                                ] || 1;

                            newItems = newItems.map((existingItem) => {
                                if (
                                    existingItem.itemId === itemId &&
                                    existingItem.quantity < maxStack
                                ) {
                                    const canAdd = Math.min(
                                        remainingQuantity,
                                        maxStack - existingItem.quantity,
                                    );
                                    remainingQuantity -= canAdd;

                                    return {
                                        ...existingItem,
                                        quantity:
                                            existingItem.quantity + canAdd,
                                    };
                                }
                                return existingItem;
                            });
                        }

                        // 如果還有剩餘數量，創建新的物品堆疊
                        while (
                            remainingQuantity > 0 &&
                            newItems.length < inventoryState.maxSlots
                        ) {
                            const emptySlot = findEmptySlot();
                            if (emptySlot === -1) break;

                            const maxStack = item.stackable
                                ? DEFAULT_INVENTORY_SETTINGS.maxStackByType[
                                      item.type
                                  ] || 1
                                : 1;
                            const stackQuantity = Math.min(
                                remainingQuantity,
                                maxStack,
                            );

                            newItems.push({
                                itemId,
                                quantity: stackQuantity,
                                slot: emptySlot,
                            });

                            remainingQuantity -= stackQuantity;
                        }

                        return newItems;
                    })(),
                    historyAction: {
                        type: "add",
                        itemId,
                        quantity,
                        timestamp: Date.now(),
                    },
                },
            });

            return true;
        },
        [inventoryState, findEmptySlot, dispatch],
    );

    /**
     * 從背包移除物品
     * @param slot 格子位置
     * @param quantity 數量
     * @returns 是否移除成功
     */
    const removeFromInventory = useCallback(
        (slot: number, quantity: number = 1): boolean => {
            if (!inventoryState || quantity <= 0) return false;

            const item = inventoryState.items.find((i) => i.slot === slot);
            if (!item || item.quantity < quantity) return false;

            dispatch({
                type: "UPDATE_INVENTORY",
                payload: {
                    items:
                        item.quantity <= quantity
                            ? inventoryState.items.filter(
                                  (i) => i.slot !== slot,
                              )
                            : inventoryState.items.map((i) =>
                                  i.slot === slot
                                      ? {
                                            ...i,
                                            quantity: i.quantity - quantity,
                                        }
                                      : i,
                              ),
                    historyAction: {
                        type: "remove",
                        itemId: item.itemId,
                        quantity,
                        fromSlot: slot,
                        timestamp: Date.now(),
                    },
                },
            });

            return true;
        },
        [inventoryState, dispatch],
    );

    /**
     * 移動背包物品
     * @param fromSlot 來源格子
     * @param toSlot 目標格子
     * @returns 是否移動成功
     */
    const moveItem = useCallback(
        (fromSlot: number, toSlot: number): boolean => {
            if (!inventoryState || fromSlot === toSlot) return false;

            const fromItem = inventoryState.items.find(
                (i) => i.slot === fromSlot,
            );
            if (!fromItem) return false;

            const toItem = inventoryState.items.find((i) => i.slot === toSlot);

            // 檢查是否可以堆疊
            if (toItem && toItem.itemId === fromItem.itemId) {
                const itemData = items.find((i) => i.id === toItem.itemId);
                if (itemData?.stackable) {
                    const maxStack =
                        DEFAULT_INVENTORY_SETTINGS.maxStackByType[
                            itemData.type
                        ];
                    const totalQuantity = fromItem.quantity + toItem.quantity;

                    if (totalQuantity <= maxStack) {
                        // 可以完全堆疊
                        dispatch({
                            type: "UPDATE_INVENTORY",
                            payload: {
                                items: inventoryState.items
                                    .filter((i) => i.slot !== fromSlot)
                                    .map((i) =>
                                        i.slot === toSlot
                                            ? { ...i, quantity: totalQuantity }
                                            : i,
                                    ),
                                historyAction: {
                                    type: "move",
                                    itemId: fromItem.itemId,
                                    quantity: fromItem.quantity,
                                    fromSlot,
                                    toSlot,
                                    timestamp: Date.now(),
                                },
                            },
                        });
                        return true;
                    }
                }
            }

            // 直接交換位置
            dispatch({
                type: "UPDATE_INVENTORY",
                payload: {
                    items: inventoryState.items.map((i) => {
                        if (i.slot === fromSlot) return { ...i, slot: toSlot };
                        if (i.slot === toSlot) return { ...i, slot: fromSlot };
                        return i;
                    }),
                    historyAction: {
                        type: "move",
                        itemId: fromItem.itemId,
                        quantity: fromItem.quantity,
                        fromSlot,
                        toSlot,
                        timestamp: Date.now(),
                    },
                },
            });

            return true;
        },
        [inventoryState, dispatch],
    );

    /**
     * 拆分堆疊
     * @param fromSlot 來源格子
     * @param toSlot 目標格子
     * @param quantity 拆分數量
     * @returns 是否拆分成功
     */
    const splitStack = useCallback(
        (fromSlot: number, toSlot: number, quantity: number): boolean => {
            if (!inventoryState || quantity <= 0) return false;

            const sourceItem = inventoryState.items.find(
                (i) => i.slot === fromSlot,
            );
            if (!sourceItem || sourceItem.quantity <= quantity) return false;

            const targetItem = inventoryState.items.find(
                (i) => i.slot === toSlot,
            );
            if (targetItem) {
                // 目標格有物品時，檢查堆疊
                if (targetItem.itemId !== sourceItem.itemId) return false;

                const itemData = items.find((i) => i.id === sourceItem.itemId);
                if (!itemData?.stackable) return false;

                const maxStack =
                    DEFAULT_INVENTORY_SETTINGS.maxStackByType[itemData.type];
                if (targetItem.quantity + quantity > maxStack) return false;
            }

            dispatch({
                type: "UPDATE_INVENTORY",
                payload: {
                    items: targetItem
                        ? inventoryState.items.map((item) => {
                              if (item.slot === fromSlot) {
                                  return {
                                      ...item,
                                      quantity: item.quantity - quantity,
                                  };
                              }
                              if (item.slot === toSlot) {
                                  return {
                                      ...item,
                                      quantity: item.quantity + quantity,
                                  };
                              }
                              return item;
                          })
                        : [
                              ...inventoryState.items.map((item) =>
                                  item.slot === fromSlot
                                      ? {
                                            ...item,
                                            quantity: item.quantity - quantity,
                                        }
                                      : item,
                              ),
                              {
                                  itemId: sourceItem.itemId,
                                  quantity,
                                  slot: toSlot,
                              },
                          ],
                    historyAction: {
                        type: "split",
                        itemId: sourceItem.itemId,
                        quantity,
                        fromSlot,
                        toSlot,
                        timestamp: Date.now(),
                    },
                },
            });

            return true;
        },
        [inventoryState, dispatch],
    );

    /**
     * 整理背包
     */
    const sortInventory = useCallback(() => {
        if (!inventoryState) return;

        // 收集所有物品資訊
        const itemsWithInfo = inventoryState.items
            .map((invItem) => {
                const itemData = items.find((i) => i.id === invItem.itemId);
                return {
                    ...invItem,
                    itemData,
                };
            })
            .filter((item) => !!item.itemData);

        // 合併可堆疊物品
        const itemGroups = new Map<string, typeof itemsWithInfo>();
        itemsWithInfo.forEach((item) => {
            const existingGroup = itemGroups.get(item.itemId) || [];
            itemGroups.set(item.itemId, [...existingGroup, item]);
        });

        // 重新分配堆疊和位置
        const newItems: InventoryItem[] = [];
        let currentSlot = 0;

        // 按類型和ID排序
        Array.from(itemGroups.keys())
            .sort((a, b) => {
                const itemA = items.find((i) => i.id === a);
                const itemB = items.find((i) => i.id === b);
                if (!itemA || !itemB) return 0;
                return (
                    itemA.type.localeCompare(itemB.type) ||
                    itemA.id.localeCompare(itemB.id)
                );
            })
            .forEach((id) => {
                const group = itemGroups.get(id) || [];
                const itemData = items.find((i) => i.id === id);
                if (!itemData) return;

                if (itemData.stackable) {
                    const maxStack =
                        DEFAULT_INVENTORY_SETTINGS.maxStackByType[
                            itemData.type
                        ];
                    let totalQuantity = group.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                    );

                    while (
                        totalQuantity > 0 &&
                        currentSlot < inventoryState.maxSlots
                    ) {
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
                        if (currentSlot < inventoryState.maxSlots) {
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

        dispatch({
            type: "UPDATE_INVENTORY",
            payload: {
                items: newItems,
                historyAction: {
                    type: "sort",
                    itemId: "",
                    quantity: 0,
                    timestamp: Date.now(),
                },
            },
        });
    }, [inventoryState, dispatch]);

    //#endregion

    //#region 角色狀態系統

    /**
     * 更新當前生命值
     * @param amount 變動量，正數增加，負數減少
     */
    const updateCurrentHealth = useCallback(
        (amount: number) => {
            if (!playerData?.characterStats) return;

            const maxHealth = playerData.characterStats.health;
            dispatch({
                type: "UPDATE_STATS",
                payload: {
                    currentHealth: Math.min(
                        Math.max(
                            0,
                            playerData.characterStats.currentHealth + amount,
                        ),
                        maxHealth,
                    ),
                },
            });
        },
        [playerData, dispatch],
    );

    /**
     * 更新當前魔力值
     * @param amount 變動量，正數增加，負數減少
     */
    const updateCurrentMana = useCallback(
        (amount: number) => {
            if (!playerData?.characterStats) return;

            const maxMana = playerData.characterStats.mana;
            dispatch({
                type: "UPDATE_STATS",
                payload: {
                    currentMana: Math.min(
                        Math.max(
                            0,
                            playerData.characterStats.currentHealth + amount,
                        ),
                        maxMana,
                    ),
                },
            });
        },
        [playerData, dispatch],
    );

    /**
     * 根據等級更新角色狀態
     * @param level 新等級
     * @param doUpdate 是否執行更新，false 時只返回新的狀態
     */
    const updatePlayerByLevel = useCallback(
        (level: number, doUpdate = true) => {
            if (
                !level ||
                level <= 0 ||
                !playerData?.characterStats ||
                !playerData.currentClassId
            )
                return;

            const currentClass = classes[playerData.currentClassId];
            if (!currentClass) return;

            // 計算基礎屬性成長
            const baseStats = {
                ...currentClass.baseStats,
                level,
                health: Math.floor(
                    currentClass.baseStats.health +
                        currentClass.growthStats.health * (level - 1),
                ),
                mana: Math.floor(
                    currentClass.baseStats.mana +
                        currentClass.growthStats.mana * (level - 1),
                ),
                strength: Math.floor(
                    currentClass.baseStats.strength +
                        currentClass.growthStats.strength * (level - 1),
                ),
                dexterity: Math.floor(
                    currentClass.baseStats.dexterity +
                        currentClass.growthStats.dexterity * (level - 1),
                ),
                intelligence: Math.floor(
                    currentClass.baseStats.intelligence +
                        currentClass.growthStats.intelligence * (level - 1),
                ),
                nextLevelExp: Math.floor(100 * Math.pow(1.5, level - 1)),
            };

            // 檢查職業進階獎勵
            const levelBonuses = currentClass.progression
                .filter((prog) => prog.level <= level)
                .reduce(
                    (acc, prog) => ({
                        strength:
                            (acc.strength || 0) +
                            (prog.attributeBonus.strength || 0),
                        dexterity:
                            (acc.dexterity || 0) +
                            (prog.attributeBonus.dexterity || 0),
                        intelligence:
                            (acc.intelligence || 0) +
                            (prog.attributeBonus.intelligence || 0),
                        health:
                            (acc.health || 0) +
                            (prog.attributeBonus.health || 0),
                        mana: (acc.mana || 0) + (prog.attributeBonus.mana || 0),
                    }),
                    {
                        strength: 0,
                        dexterity: 0,
                        intelligence: 0,
                        health: 0,
                        mana: 0,
                    },
                );

            // 合併基礎屬性和獎勵
            const finalStats = {
                ...baseStats,
                health: baseStats.health + (levelBonuses.health || 0),
                currentHealth: baseStats.health + (levelBonuses.health || 0),
                mana: baseStats.mana + (levelBonuses.mana || 0),
                currentMana: baseStats.mana + (levelBonuses.mana || 0),
                strength: baseStats.strength + (levelBonuses.strength || 0),
                dexterity: baseStats.dexterity + (levelBonuses.dexterity || 0),
                intelligence:
                    baseStats.intelligence + (levelBonuses.intelligence || 0),
                experience: 0,
            };

            // 檢查當前等級可以解鎖的技能
            const classProgression = currentClass.progression.find(
                (prog) => prog.level === level,
            );

            // 取得已解鎖技能列表
            const currentUnlockedSkills = new Set(
                playerData.classProgress?.[currentClass.id]?.unlockedSkills ||
                    [],
            );

            // 將新技能加入集合中
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

            if (doUpdate) {
                dispatch({
                    type: "UPDATE_PLAYER",
                    payload: newPlayer,
                });
            } else {
                return newPlayer;
            }
        },
        [playerData, dispatch],
    );

    /**
     * 增加經驗值並處理升級
     * @param amount 經驗值數量
     */
    const gainExperience = useCallback(
        (amount: number): void => {
            if (!playerData?.characterStats || !playerData.currentClassId)
                return;

            const stats = playerData.characterStats;
            let newExp = stats.experience + amount;
            let newLevel = stats.level;
            let newNextLevelExp = stats.nextLevelExp;

            // 檢查是否升級
            while (newExp >= newNextLevelExp) {
                newExp -= newNextLevelExp;
                newLevel++;
                newNextLevelExp = Math.floor(100 * Math.pow(1.5, newLevel - 1));
            }

            // 如果升級了才計算新的屬性值
            if (newLevel > stats.level) {
                const newPlayer = updatePlayerByLevel(newLevel, false);
                if (newPlayer) {
                    dispatch({
                        type: "UPDATE_PLAYER",
                        payload: {
                            ...newPlayer,
                            characterStats: {
                                ...newPlayer.characterStats,
                                experience: newExp,
                            },
                        },
                    });
                }
            } else {
                // 沒升級就只更新經驗值
                dispatch({
                    type: "UPDATE_STATS",
                    payload: {
                        experience: newExp,
                        nextLevelExp: newNextLevelExp,
                    },
                });
            }
        },
        [playerData, updatePlayerByLevel, dispatch],
    );

    /**
     * 獲取當前經驗值百分比
     */
    const getExpPercentage = useCallback((): number => {
        if (!playerData?.characterStats) return 0;
        const { experience, nextLevelExp } = playerData.characterStats;
        return (experience / nextLevelExp) * 100;
    }, [playerData?.characterStats]);

    //#endregion

    //#region 技能系統

    // 技能冷卻和效果系統狀態
    const initialEffects: Record<EffectType, number> = {
        stun: 0,
        bleed: 0,
        burn: 0,
        freeze: 0,
        poison: 0,
        slow: 0,
        silence: 0,
        blind: 0,
        weakness: 0,
        defense_down: 0,
        attack_up: 0,
        defense_up: 0,
        speed_up: 0,
        regeneration: 0,
        mana_regen: 0,
        immune: 0,
        stealth: 0,
        taunt: 0,
        reflect: 0,
        life_steal: 0,
        ignore_defense: 0,
        shield: 0,
    };
    const [skillCooldowns, setSkillCooldowns] = useState<
        Record<string, number>
    >({});
    const [activeEffects, setActiveEffects] =
        useState<Record<EffectType, number>>(initialEffects);

    /**
     * 檢查技能是否擁有該技能
     */
    const isClassSkillAvailable = useCallback(
        (classId: string, skillId: string): boolean =>
            skillsByClass[classId]?.some((skill) => skill.id === skillId) ??
            false,
        [],
    );

    /**
     * 檢查效果是否活動中
     */
    const isEffectActive = useCallback(
        (effectType: EffectType): boolean => {
            const endTime = activeEffects[effectType];
            return endTime ? Date.now() < endTime : false;
        },
        [activeEffects],
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
        [skillCooldowns],
    );

    /**
     * 獲取所有當前職業已學習/未學習技能
     */
    const getAvailableSkills = useCallback(() => {
        if (!playerData?.currentClassId) return { active: [], locked: [] };

        const currentClass = classes[playerData.currentClassId];
        if (!currentClass) return { active: [], locked: [] };

        const checkRequirements = (skill: Skill): boolean => {
            if (!skill.requirements) return true;

            const { level, weapon } = skill.requirements;
            const stats = playerData.characterStats;

            if (level && (!stats || stats.level < level)) return false;

            if (weapon && playerData.equipped.weapon) {
                const equippedWeaponType = weapons.find(
                    (w) => w.id === playerData.equipped.weapon,
                )?.type;
                return (
                    !!equippedWeaponType && weapon.includes(equippedWeaponType)
                );
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
            playerData.classProgress?.[playerData.currentClassId]
                ?.unlockedSkills || [];

        const skillsMap = {
            active: [] as Skill[],
            locked: [] as Skill[],
        };

        let usedSkillIds = new Set<string>();

        // 處理職業技能
        classSkillList.forEach((skill) => {
            if (classSkillIds.includes(skill.id)) {
                if (!usedSkillIds.has(skill.id)) {
                    if (checkRequirements(skill)) {
                        skillsMap.active.push(skill);
                    } else {
                        skillsMap.locked.push(skill);
                    }
                    usedSkillIds.add(skill.id);
                }
            }
        });

        // 處理額外技能
        unlockedSkills.forEach((skillId) => {
            const skill = skills.find((s) => s.id === skillId);
            if (
                skill &&
                checkRequirements(skill) &&
                !usedSkillIds.has(skill.id)
            ) {
                skillsMap.active.push(skill);
                usedSkillIds.add(skill.id);
            }
        });

        return skillsMap;
    }, [playerData]);

    /**
     * 使用技能
     */
    const useSkill = useCallback(
        (skillId: string): boolean => {
            if (!playerData?.characterStats) return false;

            const skill = skills.find((s) => s.id === skillId);
            if (!skill) return false;

            const now = Date.now();

            if (skillCooldowns[skillId] && now < skillCooldowns[skillId]) {
                return false;
            }

            if (playerData.characterStats.currentMana < skill.manaCost) {
                return false;
            }

            if (
                skill.requirements?.weapon &&
                (!playerData.equipped.weapon ||
                    !skill.requirements.weapon.includes(
                        weapons.find((w) => w.id === playerData.equipped.weapon)
                            ?.type as WeaponType,
                    ))
            ) {
                return false;
            }

            // 設置冷卻
            setSkillCooldowns((prev) => ({
                ...prev,
                [skillId]: now + skill.cooldown * 1000,
            }));

            // 扣除魔力
            dispatch({
                type: "UPDATE_STATS",
                payload: {
                    currentMana:
                        playerData.characterStats.currentMana - skill.manaCost,
                },
            });

            // 處理技能效果
            if (skill.effects) {
                setActiveEffects((prev) => {
                    const newEffects = { ...prev };
                    skill.effects?.forEach((effect) => {
                        if (Math.random() * 100 <= (effect.chance || 100)) {
                            newEffects[effect.type] =
                                now + effect.duration * 1000;
                        }
                    });
                    return newEffects;
                });
            }

            return true;
        },
        [playerData, skillCooldowns, dispatch],
    );

    //#endregion

    //#region 裝備系統

    /**
     * 檢查是否可以裝備武器
     */
    const canEquipWeapon = useCallback(
        (weapon: Weapon): boolean => {
            if (!playerData?.currentClassId || !playerData?.characterStats)
                return false;

            const currentClass = classes[playerData.currentClassId];
            if (!currentClass) return false;

            if (!currentClass.allowedWeapons.includes(weapon.type))
                return false;

            const stats = playerData.characterStats;
            if (weapon.requirements) {
                const { requirements } = weapon;
                if (
                    (requirements.level && stats.level < requirements.level) ||
                    (requirements.strength &&
                        stats.strength < requirements.strength) ||
                    (requirements.dexterity &&
                        stats.dexterity < requirements.dexterity) ||
                    (requirements.intelligence &&
                        stats.intelligence < requirements.intelligence)
                ) {
                    return false;
                }
            }

            return true;
        },
        [playerData],
    );

    /**
     * 裝備武器
     */
    const equipWeapon = useCallback(
        (weapon: Weapon): boolean => {
            if (!canEquipWeapon(weapon)) return false;

            dispatch({
                type: "UPDATE_PLAYER",
                payload: {
                    equipped: {
                        ...(playerData?.equipped || {}),
                        weapon: weapon.id,
                    },
                },
            });

            return true;
        },
        [canEquipWeapon, playerData, dispatch],
    );

    //#endregion

    return {
        // 貨幣相關
        addCurrency,
        deductCurrency,
        hasSufficientCurrency,
        getCurrencyBalance,

        // 背包相關
        inventoryState,
        addToInventory,
        removeFromInventory,
        moveItem,
        splitStack,
        sortInventory,
        canStackWith: findEmptySlot,

        // 角色狀態相關
        updateCurrentHealth,
        updateCurrentMana,
        updatePlayerByLevel,
        gainExperience,
        getExpPercentage,

        // 技能相關
        skillCooldowns,
        activeEffects,
        useSkill,
        getSkillCooldown,
        getAvailableSkills,
        isEffectActive,
        isClassSkillAvailable,

        // 裝備相關
        canEquipWeapon,
        equipWeapon,
    };
};
