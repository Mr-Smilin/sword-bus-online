import { Item } from "../type";

export const items: Item[] = [
    // 消耗品 - 生命藥水系列
    {
      id: 'small-health-potion',
      name: '小型生命藥水',
      description: '恢復少量生命值（50點）',
      type: 'consumable',
      rarity: 'common',
      stackable: true,
      maxStack: 99,
      effect: 'heal:50',
      value: 25,
      weight: 0.1
    },
    {
      id: 'medium-health-potion',
      name: '中型生命藥水',
      description: '恢復中量生命值（150點）',
      type: 'consumable',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 99,
      effect: 'heal:150',
      value: 75,
      weight: 0.2
    },
    {
      id: 'large-health-potion',
      name: '大型生命藥水',
      description: '恢復大量生命值（300點）',
      type: 'consumable',
      rarity: 'rare',
      stackable: true,
      maxStack: 99,
      effect: 'heal:300',
      value: 150,
      weight: 0.3
    },
    
    // 消耗品 - 魔力藥水系列
    {
      id: 'small-mana-potion',
      name: '小型魔力藥水',
      description: '恢復少量魔力值（30點）',
      type: 'consumable',
      rarity: 'common',
      stackable: true,
      maxStack: 99,
      effect: 'mana:30',
      value: 25,
      weight: 0.1
    },
    {
      id: 'medium-mana-potion',
      name: '中型魔力藥水',
      description: '恢復中量魔力值（80點）',
      type: 'consumable',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 99,
      effect: 'mana:80',
      value: 75,
      weight: 0.2
    },
    {
      id: 'large-mana-potion',
      name: '大型魔力藥水',
      description: '恢復大量魔力值（150點）',
      type: 'consumable',
      rarity: 'rare',
      stackable: true,
      maxStack: 99,
      effect: 'mana:150',
      value: 150,
      weight: 0.3
    },
  
    // 消耗品 - 狀態藥水
    {
      id: 'antidote',
      name: '解毒劑',
      description: '解除中毒狀態',
      type: 'consumable',
      rarity: 'common',
      stackable: true,
      maxStack: 30,
      effect: 'cure:poison',
      value: 50,
      weight: 0.1
    },
    {
      id: 'status-cure',
      name: '狀態解除藥',
      description: '解除大部分負面狀態',
      type: 'consumable',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 20,
      effect: 'cure:all',
      value: 150,
      weight: 0.2
    },
    {
      id: 'elixir',
      name: '萬能藥劑',
      description: '恢復所有HP和MP，解除所有負面狀態',
      type: 'consumable',
      rarity: 'epic',
      stackable: true,
      maxStack: 5,
      effect: 'restore:all',
      value: 1000,
      weight: 0.3
    },
  
    // 材料 - 礦物
    {
      id: 'copper-ore',
      name: '銅礦石',
      description: '常見的礦物，可用於基礎裝備製作',
      type: 'material',
      rarity: 'common',
      stackable: true,
      maxStack: 999,
      value: 5,
      weight: 0.5
    },
    {
      id: 'iron-ore',
      name: '鐵礦石',
      description: '優質的礦物，用於製作中級裝備',
      type: 'material',
      rarity: 'common',
      stackable: true,
      maxStack: 999,
      value: 10,
      weight: 0.8
    },
    {
      id: 'silver-ore',
      name: '銀礦石',
      description: '珍貴的礦物，具有魔法親和性',
      type: 'material',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 999,
      value: 25,
      weight: 0.6
    },
    {
      id: 'gold-ore',
      name: '金礦石',
      description: '稀有的礦物，可用於高級裝備製作',
      type: 'material',
      rarity: 'rare',
      stackable: true,
      maxStack: 999,
      value: 50,
      weight: 1
    },
    {
      id: 'mithril-ore',
      name: '秘銀礦石',
      description: '傳說中的礦物，具有極強的魔法親和性',
      type: 'material',
      rarity: 'epic',
      stackable: true,
      maxStack: 999,
      value: 200,
      weight: 0.4
    },
  
    // 材料 - 木材
    {
      id: 'common-wood',
      name: '普通木材',
      description: '常見的木材，用於基礎物品製作',
      type: 'material',
      rarity: 'common',
      stackable: true,
      maxStack: 999,
      value: 3,
      weight: 0.5
    },
    {
      id: 'hard-wood',
      name: '硬木',
      description: '較為堅韌的木材，適合製作武器',
      type: 'material',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 999,
      value: 15,
      weight: 0.6
    },
    {
      id: 'ancient-wood',
      name: '古木',
      description: '蘊含魔力的古老木材',
      type: 'material',
      rarity: 'rare',
      stackable: true,
      maxStack: 999,
      value: 100,
      weight: 0.4
    },
  
    // 材料 - 布料
    {
      id: 'linen-cloth',
      name: '亞麻布',
      description: '基礎的布料材料',
      type: 'material',
      rarity: 'common',
      stackable: true,
      maxStack: 999,
      value: 5,
      weight: 0.1
    },
    {
      id: 'silk',
      name: '絲綢',
      description: '高級布料，適合製作法師裝備',
      type: 'material',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 999,
      value: 25,
      weight: 0.1
    },
    {
      id: 'magic-cloth',
      name: '魔法布料',
      description: '注入魔力的特殊布料',
      type: 'material',
      rarity: 'rare',
      stackable: true,
      maxStack: 999,
      value: 80,
      weight: 0.1
    },
  
    // 材料 - 獸皮
    {
      id: 'leather',
      name: '獸皮',
      description: '基礎的皮革材料',
      type: 'material',
      rarity: 'common',
      stackable: true,
      maxStack: 999,
      value: 8,
      weight: 0.3
    },
    {
      id: 'thick-leather',
      name: '厚重獸皮',
      description: '高品質的皮革，適合製作護甲',
      type: 'material',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 999,
      value: 20,
      weight: 0.4
    },
    {
      id: 'dragon-scale',
      name: '龍鱗',
      description: '極其珍貴的材料，可製作頂級護甲',
      type: 'material',
      rarity: 'legendary',
      stackable: true,
      maxStack: 999,
      value: 1000,
      weight: 0.5
    },
  
    // 任務物品
    {
      id: 'ancient-scroll',
      name: '古老卷軸',
      description: '記載著神秘文字的卷軸',
      type: 'quest',
      rarity: 'uncommon',
      stackable: false,
      value: 0,
      weight: 0.1
    },
    {
      id: 'kings-seal',
      name: '國王印璽',
      description: '代表王室權威的重要物品',
      type: 'quest',
      rarity: 'epic',
      stackable: false,
      value: 0,
      weight: 0.5
    },
    {
      id: 'dragon-egg',
      name: '龍蛋',
      description: '蘊含著強大生命力的龍蛋',
      type: 'quest',
      rarity: 'legendary',
      stackable: false,
      value: 0,
      weight: 5.0
    },
  
    // 消耗品 - 卷軸
    {
      id: 'teleport-scroll',
      name: '傳送卷軸',
      description: '可以傳送到已到訪過的城市',
      type: 'consumable',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 10,
      effect: 'teleport:town',
      value: 100,
      weight: 0.1
    },
    {
      id: 'identify-scroll',
      name: '鑑定卷軸',
      description: '可以鑑定未知物品',
      type: 'consumable',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 30,
      effect: 'identify',
      value: 50,
      weight: 0.1
    },
  
    // 消耗品 - 食物
    {
      id: 'bread',
      name: '麵包',
      description: '普通的食物，恢復少量生命值',
      type: 'consumable',
      rarity: 'common',
      stackable: true,
      maxStack: 99,
      effect: 'heal:10',
      value: 5,
      weight: 0.2
    },
    {
      id: 'meat-stew',
      name: '肉湯',
      description: '美味的料理，恢復生命值並暫時提升力量',
      type: 'consumable',
      rarity: 'uncommon',
      stackable: true,
      maxStack: 10,
      effect: 'heal:30;buff:strength:5:300',
      value: 25,
      weight: 0.5
    }
  ];