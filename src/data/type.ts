
/**
 * 角色狀態介面
 * 定義角色的基本屬性和狀態
 */
export interface CharacterStats {
  level: number;          // 角色等級
  experience: number;     // 當前經驗值
  nextLevelExp: number;   // 下一級所需經驗值
  health: number;         // 生命值
  mana: number;          // 魔力值
  strength: number;      // 力量 - 影響物理攻擊力和負重能力
  dexterity: number;     // 敏捷 - 影響命中率、迴避率和攻擊速度
  intelligence: number;  // 智力 - 影響魔法傷害和魔力值
}

/**
 * 玩家資料介面
 */
export interface PlayerData {
  id: string;                    // 玩家唯一ID
  name: string;                  // 玩家名稱
  characterStats: CharacterStats;// 角色屬性
  currentClassId: string;        // 當前職業ID
  inventory: string[];           // 背包物品ID列表
  equipped: {                    // 已裝備物品
    weapon?: string;            // 武器ID
  };
  locationData: {
    currentFloorId: number;     // 樓層ID
    currentAreaId: string;      // 區域ID
  };
  createdAt: number;            // 創建時間
  lastLoginAt: number;          // 最後登入時間
}

/**
 * 遊戲事件相關型別
 */
export interface GameEventData {
  name: string;           // 玩家輸入的名稱
  classId: string;        // 選擇的職業ID
  isCompleted: boolean;   // 是否完成
}

/**
 * 本地儲存的遊戲資料結構
 */
export interface GameSaveData {
  player: PlayerData;           // 玩家資料
  events: {                     // 事件資料
    tutorial?: GameEventData;   // 新手教學
    [key: string]: any;        // 其他事件
  };
  version: string;             // 存檔版本
}

/**
 * 物品類型
 * 定義遊戲中所有可能的物品類型
 */
export type ItemType = 'consumable' | 'material' | 'quest';

/**
 * 稀有度類型
 * 定義物品和裝備的稀有程度
 */
export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * 遊戲物品介面
 * 定義遊戲中所有物品的基本屬性
 */
export interface Item {
  id: string;                 // 物品唯一識別碼
  name: string;              // 物品名稱
  description: string;       // 物品描述
  type: ItemType;           // 物品類型
  rarity: RarityType;       // 物品稀有度
  stackable: boolean;        // 是否可堆疊
  maxStack?: number;         // 最大堆疊數量，只有當 stackable 為 true 時有效
  effect?: string;           // 物品效果（格式：'效果類型:數值'，例如 'heal:100'）
  value: number;             // 物品價值（遊戲幣）
  weight: number;            // 物品重量（影響角色負重）
  quantity?: number;         // 堆疊數量，運行時使用，不需要在資料定義中設置
}

/**
 * 武器類型
 * 包含基礎和特殊武器類型
 */
export type WeaponType = 
  | 'sword'          // 劍
  | 'bow'            // 弓
  | 'staff'          // 法杖
  | 'dagger'         // 匕首
  | 'axe'            // 斧頭
  | 'mace'           // 錘子
  | 'runic_sword'    // 符文劍
  | 'death_blade'    // 死亡之刃
  | 'rune_blade'     // 符文之刃
  | 'wrench'         // 扳手
  | 'mechanical_arm' // 機械臂
  | 'time_piece'     // 時間裝置
  | 'grimoire'       // 魔導書
  | 'globe';         // 天球儀

  
/**
 * 武器介面
 * 定義武器裝備的屬性和要求
 */
export interface Weapon {
  id: string;               // 武器唯一識別碼
  name: string;             // 武器名稱
  description: string;      // 武器描述
  type: WeaponType;        // 武器類型
  rarity: RarityType;      // 武器稀有度
  damage: {                 // 武器傷害範圍
    min: number;           // 最小傷害
    max: number;           // 最大傷害
  };
  attributes: {             // 武器附加屬性
    strength?: number;     // 力量加成
    dexterity?: number;    // 敏捷加成
    intelligence?: number; // 智力加成
  };
  requirements?: {          // 裝備需求
    level: number;         // 等級需求
    strength?: number;     // 力量需求
    dexterity?: number;    // 敏捷需求
    intelligence?: number; // 智力需求
  };
  durability: {            // 耐久度系統
    current: number;       // 當前耐久
    max: number;          // 最大耐久
  };
  value: number;           // 武器價值
  weight: number;          // 武器重量
}

/**
 * 職業等級類型
 * 定義職業的階級
 */
export type ClassType = 'beginner' | 'advanced' | 'master';

/**
 * 職業進階系統介面
 * 定義職業升級時的獎勵和解鎖內容
 */
export interface ClassProgression {
  level: number;            // 達到此等級時
  unlockedSkills: string[]; // 解鎖的技能ID列表
  attributeBonus: {         // 獲得的屬性獎勵
    strength?: number;     // 力量獎勵
    dexterity?: number;    // 敏捷獎勵
    intelligence?: number; // 智力獎勵
    health?: number;       // 生命值獎勵
    mana?: number;         // 魔力值獎勵
  };
}

/**
 * 職業介面
 * 定義職業的所有特性和要求
 */
export interface Class {
  id: string;              // 職業唯一識別碼
  name: string;            // 職業名稱
  description: string;     // 職業描述
  type: ClassType;         // 職業等級
  baseStats: CharacterStats; // 基礎屬性
  growthStats: {           // 成長屬性（每級增加）
    health: number;       // 生命值成長
    mana: number;         // 魔力值成長
    strength: number;     // 力量成長
    dexterity: number;    // 敏捷成長
    intelligence: number; // 智力成長
  };
  allowedWeapons: WeaponType[]; // 可使用武器類型列表
  skills: {               // 技能配置
    basic: string[];      // 基礎技能ID列表
    advanced: string[];   // 進階技能ID列表
    ultimate: string[];   // 終極技能ID列表
  };
  progression: ClassProgression[]; // 職業進階配置
  startingEquipment: string[];    // 起始裝備ID列表
  requirements?: {        // 進階職業的要求
    baseClass?: string;   // 需要的基礎職業ID
    level?: number;       // 需要的等級
    stats?: {            // 需要的屬性要求
      strength?: number;
      dexterity?: number;
      intelligence?: number;
    };
    items?: string[];    // 需要的道具ID列表
  };
}

/**
 * 技能類型
 * 定義技能的基本類別
 */
export type SkillType = 'attack' | 'buff' | 'debuff' | 'heal' | 'utility';

/**
 * 傷害類型
 * 定義技能造成的傷害類型
 */
export type DamageType = 
  | 'physical'   // 物理傷害
  | 'magic'      // 魔法傷害
  | 'pure'       // 純粹傷害
  | 'fire'       // 火焰傷害
  | 'ice'        // 冰霜傷害
  | 'lightning'  // 閃電傷害
  | 'holy'       // 神聖傷害
  | 'dark'       // 暗影傷害
  | 'nature';    // 自然傷害

/**
 * 目標類型
 * 定義技能的目標類型
 */
export type TargetType = 
  | 'single'     // 單一目標
  | 'area'       // 區域效果
  | 'line'       // 直線效果
  | 'self'       // 自身效果
  | 'ally';      // 友方目標

  /**
 * 效果類型
 * 定義技能可能造成的效果
 */
export type EffectType = 
| 'stun'           // 暈眩 - 無法行動
| 'bleed'          // 流血 - 持續傷害
| 'burn'           // 燃燒 - 火焰持續傷害
| 'freeze'         // 冰凍 - 無法移動
| 'poison'         // 中毒 - 持續傷害和減速
| 'slow'           // 減速 - 降低移動速度
| 'silence'        // 沉默 - 無法使用技能
| 'blind'          // 致盲 - 降低命中率
| 'weakness'       // 虛弱 - 降低攻擊力
| 'defense_down'   // 降低防禦 - 降低防禦力
| 'attack_up'      // 提升攻擊 - 提升攻擊力
| 'defense_up'     // 提升防禦 - 提升防禦力
| 'speed_up'       // 提升速度 - 提升移動和攻擊速度
| 'regeneration'   // 恢復生命 - 持續回復生命
| 'mana_regen'     // 恢復魔力 - 持續回復魔力
| 'immune'         // 免疫 - 免疫控制效果
| 'stealth'        // 隱身 - 進入隱身狀態
| 'taunt'          // 嘲諷 - 強制目標攻擊自己
| 'reflect'        // 反射傷害 - 反彈部分傷害
| 'life_steal'     // 生命偷取 - 將傷害轉換為生命值
| 'ignore_defense' // 無視防禦 - 傷害無視目標防禦力
| 'shield';        // 護盾 - 提供額外生命值

/**
 * 技能效果介面
 * 定義技能效果的具體屬性
 */
export interface SkillEffect {
  type: EffectType;    // 效果類型
  value: number;       // 效果數值
  duration: number;    // 持續時間（秒）
  chance?: number;     // 觸發機率（百分比）
}

/**
 * 技能介面
 * 定義技能的完整屬性
 */
export interface Skill {
  id: string;                // 技能唯一識別碼
  name: string;              // 技能名稱
  description: string;       // 技能描述
  type: SkillType;          // 技能類型
  damageType: DamageType;   // 傷害類型
  targetType: TargetType;   // 目標類型
  cooldown: number;         // 冷卻時間（秒）
  manaCost: number;         // 魔力消耗
  castTime?: number;        // 施法時間（秒）
  range: number;            // 施法範圍（碼）
  area?: number;            // 影響範圍（碼）
  damage?: {                // 技能傷害
    base: number;          // 基礎傷害
    scaling: {             // 屬性加成係數
      strength?: number;   // 力量係數
      dexterity?: number;  // 敏捷係數
      intelligence?: number; // 智力係數
    };
  };
  effects?: SkillEffect[];  // 技能效果列表
  requirements?: {          // 技能要求
    level: number;         // 等級要求
    weapon?: WeaponType[]; // 武器要求
  };
}

// 區域類型定義
export type AreaType = 'town' | 'wild' | 'dungeon';

// 座標位置
export interface Position {
  x: number;
  y: number;
}

// 區域資訊
export interface Area {
  id: string;                    // 區域識別碼 例如: "1f-town"
  name: string;                  // 區域名稱
  type: AreaType;               // 區域類型
  position: Position;           // 區域在地圖上的位置
  description: string;          // 區域描述
  connections: string[];        // 可直接到達的區域ID
  requiredExploration?: number; // 需要的最大探索度 (解鎖條件)
  maxExploration: number;       // 最大探索度上限
  maxDungeonExploration?: number; // 迷宮專屬: 地域探索度上限
}

// 樓層資訊
export interface Floor {
  id: number;                 // 樓層編號
  name: string;              // 樓層名稱
  description: string;       // 樓層描述
  requiredBoss?: string;     // 需要擊敗的BOSS ID (解鎖下一層條件)
  areas: Area[];            // 該樓層的所有區域
  backgroundImage?: string;  // 樓層地圖背景圖片
}

// 探索進度
export interface AreaProgress {
  currentExploration: number;  // 當前探索度
  maxExploration: number;      // 已達到的最大探索度
  dungeonExploration?: number; // 迷宮專屬: 當前地域探索度
}

// 地圖存檔資料
export interface MapSaveData {
  currentFloor: number;           // 當前樓層
  currentArea: string;           // 當前區域ID
  areaProgress: Record<string, AreaProgress>;  // 各區域探索進度
  unlockedAreas: string[];      // 已解鎖的區域ID
  defeatedBosses: string[];     // 已擊敗的BOSS ID
}