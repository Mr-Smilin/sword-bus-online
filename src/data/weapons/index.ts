import { Weapon } from "../type";

export const weapons: Weapon[] = [
    // 劍類武器 - 單手劍
    {
      id: 'training-sword',
      name: '訓練用劍',
      description: '新手練習用的木劍',
      type: 'sword',
      rarity: 'common',
      damage: {
        min: 5,
        max: 8
      },
      attributes: {
        strength: 1
      },
      requirements: {
        level: 1
      },
      durability: {
        current: 50,
        max: 50
      },
      value: 50,
      weight: 2
    },
    {
      id: 'copper-sword',
      name: '銅劍',
      description: '銅製的基礎劍類武器',
      type: 'sword',
      rarity: 'common',
      damage: {
        min: 8,
        max: 12
      },
      attributes: {
        strength: 2
      },
      requirements: {
        level: 3,
        strength: 5
      },
      durability: {
        current: 80,
        max: 80
      },
      value: 100,
      weight: 2.5
    },
    {
      id: 'iron-sword',
      name: '鐵劍',
      description: '鐵製的標準劍類武器',
      type: 'sword',
      rarity: 'common',
      damage: {
        min: 12,
        max: 18
      },
      attributes: {
        strength: 3
      },
      requirements: {
        level: 5,
        strength: 8
      },
      durability: {
        current: 100,
        max: 100
      },
      value: 200,
      weight: 3
    },
    {
      id: 'silver-sword',
      name: '銀劍',
      description: '對魔物特別有效的銀劍',
      type: 'sword',
      rarity: 'uncommon',
      damage: {
        min: 15,
        max: 22
      },
      attributes: {
        strength: 4,
        intelligence: 2
      },
      requirements: {
        level: 10,
        strength: 12
      },
      durability: {
        current: 90,
        max: 90
      },
      value: 500,
      weight: 2.8
    },
    {
      id: 'mithril-sword',
      name: '秘銀劍',
      description: '由稀有金屬打造的魔法劍',
      type: 'sword',
      rarity: 'rare',
      damage: {
        min: 25,
        max: 35
      },
      attributes: {
        strength: 6,
        intelligence: 4
      },
      requirements: {
        level: 20,
        strength: 18
      },
      durability: {
        current: 150,
        max: 150
      },
      value: 2000,
      weight: 2.2
    },
    {
      id: 'dragon-slayer',
      name: '屠龍劍',
      description: '傳說中能夠斬殺龍族的魔劍',
      type: 'sword',
      rarity: 'legendary',
      damage: {
        min: 45,
        max: 60
      },
      attributes: {
        strength: 12,
        dexterity: 5,
        intelligence: 5
      },
      requirements: {
        level: 40,
        strength: 35
      },
      durability: {
        current: 200,
        max: 200
      },
      value: 10000,
      weight: 4
    },
  
    // 弓箭類武器
    {
      id: 'short-bow',
      name: '短弓',
      description: '基礎的遠程武器',
      type: 'bow',
      rarity: 'common',
      damage: {
        min: 6,
        max: 10
      },
      attributes: {
        dexterity: 2
      },
      requirements: {
        level: 1,
        dexterity: 5
      },
      durability: {
        current: 60,
        max: 60
      },
      value: 100,
      weight: 1.5
    },
    {
      id: 'long-bow',
      name: '長弓',
      description: '射程更遠的弓',
      type: 'bow',
      rarity: 'uncommon',
      damage: {
        min: 10,
        max: 16
      },
      attributes: {
        dexterity: 4
      },
      requirements: {
        level: 8,
        dexterity: 12
      },
      durability: {
        current: 80,
        max: 80
      },
      value: 300,
      weight: 2
    },
    {
      id: 'elven-bow',
      name: '精靈弓',
      description: '精靈工匠打造的精美弓箭',
      type: 'bow',
      rarity: 'rare',
      damage: {
        min: 18,
        max: 28
      },
      attributes: {
        dexterity: 8,
        intelligence: 3
      },
      requirements: {
        level: 15,
        dexterity: 20
      },
      durability: {
        current: 100,
        max: 100
      },
      value: 1500,
      weight: 1.8
    },
    {
      id: 'storm-bow',
      name: '風暴之弓',
      description: '蘊含風暴之力的傳說之弓',
      type: 'bow',
      rarity: 'legendary',
      damage: {
        min: 35,
        max: 50
      },
      attributes: {
        dexterity: 15,
        intelligence: 8
      },
      requirements: {
        level: 35,
        dexterity: 40
      },
      durability: {
        current: 120,
        max: 120
      },
      value: 8000,
      weight: 1.6
    },
  
    // 法杖類武器
    {
      id: 'apprentice-staff',
      name: '學徒法杖',
      description: '適合初學者使用的法杖',
      type: 'staff',
      rarity: 'common',
      damage: {
        min: 4,
        max: 7
      },
      attributes: {
        intelligence: 3
      },
      requirements: {
        level: 1,
        intelligence: 5
      },
      durability: {
        current: 40,
        max: 40
      },
      value: 100,
      weight: 1.5
    },
    {
      id: 'magic-staff',
      name: '魔導法杖',
      description: '蘊含魔力的法杖',
      type: 'staff',
      rarity: 'uncommon',
      damage: {
        min: 8,
        max: 14
      },
      attributes: {
        intelligence: 6
      },
      requirements: {
        level: 10,
        intelligence: 15
      },
      durability: {
        current: 60,
        max: 60
      },
      value: 500,
      weight: 1.8
    },
    {
      id: 'arch-mage-staff',
      name: '大法師之杖',
      description: '強大法師使用的法杖',
      type: 'staff',
      rarity: 'rare',
      damage: {
        min: 15,
        max: 25
      },
      attributes: {
        intelligence: 12
      },
      requirements: {
        level: 25,
        intelligence: 30
      },
      durability: {
        current: 80,
        max: 80
      },
      value: 2500,
      weight: 2
    },
    {
      id: 'staff-of-elements',
      name: '元素之杖',
      description: '掌控元素之力的傳說法杖',
      type: 'staff',
      rarity: 'legendary',
      damage: {
        min: 30,
        max: 45
      },
      attributes: {
        intelligence: 20
      },
      requirements: {
        level: 40,
        intelligence: 45
      },
      durability: {
        current: 100,
        max: 100
      },
      value: 9000,
      weight: 2.2
    },
  
    // 匕首類武器
    {
      id: 'simple-dagger',
      name: '簡易匕首',
      description: '基礎的匕首',
      type: 'dagger',
      rarity: 'common',
      damage: {
        min: 3,
        max: 6
      },
      attributes: {
        dexterity: 1
      },
      requirements: {
        level: 1
      },
      durability: {
        current: 40,
        max: 40
      },
      value: 50,
      weight: 0.5
    },
    {
      id: 'poison-dagger',
      name: '淬毒匕首',
      description: '塗抹毒藥的匕首',
      type: 'dagger',
      rarity: 'uncommon',
      damage: {
        min: 7,
        max: 12
      },
      attributes: {
        dexterity: 4
      },
      requirements: {
        level: 8,
        dexterity: 12
      },
      durability: {
        current: 50,
        max: 50
      },
      value: 400,
      weight: 0.6
    },
    {
      id: 'assassins-blade',
      name: '刺客之刃',
      description: '專業刺客使用的武器',
      type: 'dagger',
      rarity: 'rare',
      damage: {
        min: 15,
        max: 22
      },
      attributes: {
        dexterity: 8,
        strength: 3
      },
      requirements: {
        level: 20,
        dexterity: 25
      },
      durability: {
        current: 70,
        max: 70
      },
      value: 1800,
      weight: 0.7
    },
    {
      id: 'shadow-fang',
      name: '暗影之牙',
      description: '傳說中的暗殺武器',
      type: 'dagger',
      rarity: 'legendary',
      damage: {
        min: 28,
        max: 38
      },
      attributes: {
        dexterity: 15,
        strength: 5,
        intelligence: 5
      },
      requirements: {
        level: 35,
        dexterity: 40
      },
      durability: {
        current: 90,
        max: 90
      },
      value: 7500,
      weight: 0.8
    },
  
    // 斧頭類武器
    {
      id: 'hand-axe',
      name: '手斧',
      description: '單手使用的基礎斧頭',
      type: 'axe',
      rarity: 'common',
      damage: {
        min: 7,
        max: 12
      },
      attributes: {
        strength: 2
      },
      requirements: {
        level: 1,
        strength: 6
      },
      durability: {
        current: 70,
        max: 70
      },
      value: 100,
      weight: 2.5
    },
    {
      id: 'battle-axe',
      name: '戰斧',
      description: '戰場上常見的重型斧頭',
      type: 'axe',
      rarity: 'uncommon',
      damage: {
        min: 14,
        max: 22
      },
      attributes: {
        strength: 5
      },
      requirements: {
        level: 10,
        strength: 15
      },
      durability: {
        current: 90,
        max: 90
      },
      value: 400,
      weight: 3.5
    },
    {
      id: 'berserker-axe',
      name: '狂戰士之斧',
      description: '蘊含狂暴之力的斧頭',
      type: 'axe',
      rarity: 'rare',
      damage: {
        min: 25,
        max: 38
      },
      attributes: {
        strength: 10,
        dexterity: 3
      },
      requirements: {
        level: 25,
        strength: 30
      },
      durability: {
        current: 120,
        max: 120
      },
      value: 2200,
      weight: 4
    },
    {
      id: 'thunder-cleaver',
      name: '雷霆劈斧',
      description: '傳說中能引動雷霆之力的巨斧',
      type: 'axe',
      rarity: 'legendary',
      damage: {
        min: 40,
        max: 60
      },
      attributes: {
        strength: 18,
        dexterity: 5,
        intelligence: 5
      },
      requirements: {
        level: 40,
        strength: 45
      },
      durability: {
        current: 150,
        max: 150
      },
      value: 8500,
      weight: 4.5
    }
  ];