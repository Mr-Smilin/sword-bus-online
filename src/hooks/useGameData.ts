import { useState, useCallback, useEffect } from 'react';
import { 
    CharacterStats, 
    Item, 
    Weapon, 
    Class, 
    Skill,
    WeaponType,
    EffectType
  }  from '../data/type';
import { items } from '../data/item';
import { weapons } from '../data/weapons';
import { classes, classMap } from '../data/classes/';
import { skills, skillsByClass ,skillMap } from '../data/skills/';

/**
 * 角色裝備欄位類型定義
 */
interface EquipmentSlots {
  weapon: Weapon | null;
}

/**
 * 背包物品類型定義，繼承自 Item 並添加額外屬性
 */
interface InventoryItem extends Item {
  quantity: number;
  slot: number;
}

/**
 * 遊戲數據管理 Hook
 * 管理角色狀態、物品、裝備和技能等遊戲核心數據
 * 
 * @param initialClassId - 初始職業ID（可選）
 * @returns 遊戲數據和操作方法
 */
export const useGameData = (initialClassId?: string) => {
  // 角色基礎狀態
  const [characterStats, setCharacterStats] = useState<CharacterStats | null>(null);
  
  // 當前職業資訊
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  
  // 背包系統 - 使用 slot 來管理物品位置
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  // 裝備系統
  const [equipment, setEquipment] = useState<EquipmentSlots>({
    weapon: null
  });

  // 技能冷卻系統 - 記錄每個技能的冷卻結束時間
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});

  // 角色效果系統 - 記錄每個效果的結束時間
  const [activeEffects, setActiveEffects] = useState<Record<EffectType, number>>({} as Record<EffectType, number>);

  /**
   * 初始化角色
   * 如果提供了初始職業ID，則自動選擇該職業
   */
  useEffect(() => {
    if (initialClassId) {
      selectClass(initialClassId);
    }
  }, [initialClassId]);

  /**
   * 選擇職業
   * 設置基礎屬性並初始化裝備和技能
   * 
   * @param classId - 職業ID
   * @returns 是否成功選擇職業
   */
  const selectClass = useCallback((classId: string): boolean => {
    const classData = classMap.get(classId);
    if (!classData) return false;

    // 檢查職業要求
    if (classData.requirements) {
      const { requirements } = classData;
      if (requirements.baseClass && (!currentClass || currentClass.id !== requirements.baseClass)) {
        return false;
      }
      if (requirements.level && (!characterStats || characterStats.level < requirements.level)) {
        return false;
      }
      if (requirements.stats && characterStats) {
        const { stats } = requirements;
        if (
          (stats.strength && characterStats.strength < stats.strength) ||
          (stats.dexterity && characterStats.dexterity < stats.dexterity) ||
          (stats.intelligence && characterStats.intelligence < stats.intelligence)
        ) {
          return false;
        }
      }
    }

    // 初始化角色狀態
    setCurrentClass(classData);
    setCharacterStats(classData.baseStats);
    setEquipment({ weapon: null });
    setInventory([]);
    setSkillCooldowns({});
    setActiveEffects({} as Record<EffectType, number>);

    // 裝備初始裝備
    classData.startingEquipment.forEach(itemId => {
      const weapon = weapons.find(w => w.id === itemId);
      if (weapon) {
        equipWeapon(weapon);
      } else {
        const item = items.find(i => i.id === itemId);
        if (item) {
          addToInventory(item.id);
        }
      }
    });

    return true;
  }, [currentClass, characterStats]);

  /**
   * 將物品添加到背包
   * 處理物品堆疊和背包空間檢查
   * 
   * @param itemId - 物品ID
   * @param quantity - 數量（默認為1）
   * @returns 是否成功添加物品
   */
  const addToInventory = useCallback((itemId: string, quantity: number = 1): boolean => {
    const item = items.find(i => i.id === itemId);
    if (!item) return false;

    setInventory(prev => {
      if (item.stackable) {
        // 尋找可堆疊的位置
        const existingItem = prev.find(i => i.id === itemId && i.quantity < (item.maxStack || Infinity));
        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            item.maxStack || Infinity
          );
          return prev.map(i => 
            i.slot === existingItem.slot
              ? { ...i, quantity: newQuantity }
              : i
          );
        }
      }

      // 找到新的空位
      const nextSlot = prev.length > 0 
        ? Math.max(...prev.map(i => i.slot)) + 1 
        : 0;

      return [...prev, {
        ...item,
        quantity,
        slot: nextSlot
      }];
    });

    return true;
  }, []);

  /**
   * 檢查是否可以裝備武器
   * 檢查職業限制和屬性要求
   * 
   * @param weapon - 要檢查的武器
   * @returns 是否可以裝備
   */
  const canEquipWeapon = useCallback((weapon: Weapon): boolean => {
    if (!currentClass || !characterStats) return false;

    // 檢查職業武器限制
    if (!currentClass.allowedWeapons.includes(weapon.type)) return false;

    // 檢查需求
    if (weapon.requirements) {
      const { requirements } = weapon;
      if (
        (requirements.level && characterStats.level < requirements.level) ||
        (requirements.strength && characterStats.strength < requirements.strength) ||
        (requirements.dexterity && characterStats.dexterity < requirements.dexterity) ||
        (requirements.intelligence && characterStats.intelligence < requirements.intelligence)
      ) {
        return false;
      }
    }

    return true;
  }, [currentClass, characterStats]);

  /**
   * 裝備武器
   * 
   * @param weapon - 要裝備的武器
   * @returns 是否成功裝備
   */
  const equipWeapon = useCallback((weapon: Weapon): boolean => {
    if (!canEquipWeapon(weapon)) return false;

    setEquipment(prev => ({
      ...prev,
      weapon
    }));

    return true;
  }, [canEquipWeapon]);

  /**
   * 使用技能
   * 檢查冷卻、消耗和要求
   * 
   * @param skillId - 技能ID
   * @returns 是否成功使用技能
   */
  const useSkill = useCallback((skillId: string): boolean => {
    const skill = skillMap.get(skillId);
    if (!skill || !characterStats) return false;

    const now = Date.now();

    // 檢查冷卻
    if (skillCooldowns[skillId] && now < skillCooldowns[skillId]) {
      return false;
    }

    // 檢查魔力消耗
    if (characterStats.mana < skill.manaCost) {
      return false;
    }

    // 檢查武器要求
    if (
      skill.requirements?.weapon &&
      (!equipment.weapon || !skill.requirements.weapon.includes(equipment.weapon.type))
    ) {
      return false;
    }

    // 更新冷卻
    setSkillCooldowns(prev => ({
      ...prev,
      [skillId]: now + (skill.cooldown * 1000)
    }));

    // 消耗魔力
    setCharacterStats(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        mana: prev.mana - skill.manaCost
      };
    });

    // 應用效果
    if (skill.effects) {
      setActiveEffects(prev => {
        const newEffects = { ...prev };
        skill.effects?.forEach(effect => {
          if (Math.random() * 100 <= (effect.chance || 100)) {
            newEffects[effect.type] = now + (effect.duration * 1000);
          }
        });
        return newEffects;
      });
    }

    return true;
  }, [characterStats, equipment.weapon]);

  /**
   * 獲取技能的剩餘冷卻時間
   * 
   * @param skillId - 技能ID
   * @returns 剩餘冷卻時間（秒）
   */
  const getSkillCooldown = useCallback((skillId: string): number => {
    const endTime = skillCooldowns[skillId];
    if (!endTime) return 0;

    const remainingTime = Math.max(0, endTime - Date.now()) / 1000;
    return Math.round(remainingTime * 10) / 10;
  }, [skillCooldowns]);

  /**
   * 檢查效果是否處於活動狀態
   * 
   * @param effectType - 效果類型
   * @returns 是否活動中
   */
  const isEffectActive = useCallback((effectType: EffectType): boolean => {
    const endTime = activeEffects[effectType];
    return endTime ? Date.now() < endTime : false;
  }, [activeEffects]);

  return {
    // 狀態
    characterStats,
    currentClass,
    inventory,
    equipment,
    activeEffects,

    // 操作方法
    selectClass,
    addToInventory,
    equipWeapon,
    useSkill,

    // 查詢方法
    getSkillCooldown,
    isEffectActive,
    canEquipWeapon,

    // 遊戲數據
    classes: Object.values(classes),
    skills,
    skillsByClass,

    // 工具方法
    isClassSkillAvailable: (classId: string, skillId: string) => 
      skillsByClass[classId]?.some(skill => skill.id === skillId) ?? false
  };
};