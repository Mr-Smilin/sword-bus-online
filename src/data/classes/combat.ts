import {Class} from "../type";

export const combatClasses: Record<string, Class> = {
    // 基礎戰士
    warrior: {
      id: 'warrior',
      name: '戰士',
      description: '精通近戰武器的戰鬥專家，擅長正面對抗。',
      type: 'beginner',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 120,
        mana: 40,
        strength: 12,
        dexterity: 8,
        intelligence: 5
      },
      growthStats: {
        health: 25,
        mana: 5,
        strength: 3.5,
        dexterity: 2,
        intelligence: 1
      },
      allowedWeapons: ['sword', 'axe'],
      skills: {
        basic: [
          'slash',           // 2秒CD 基礎斬擊
          'defensive_stance' // 防禦姿態
        ],
        advanced: [
          'whirlwind',        // 旋風斬
          'intimidating_shout' // 威嚇怒吼
        ],
        ultimate: []
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['slash'],
          attributeBonus: { strength: 2 }
        },
        {
          level: 3,
          unlockedSkills: ['defensive_stance'],
          attributeBonus: { health: 50 }
        },
        {
          level: 5,
          unlockedSkills: ['intimidating_shout'],
          attributeBonus: { strength: 3 }
        },
        {
          level: 8,
          unlockedSkills: ['whirlwind'],
          attributeBonus: { strength: 3, dexterity: 2 }
        }
      ],
      startingEquipment: ['training_sword', 'leather_armor']
    },
  
    // 重裝騎士
    knight: {
      id: 'knight',
      name: '重裝騎士',
      description: '重裝戰士的進階職業，專精於防禦和控制。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 150,
        mana: 50,
        strength: 15,
        dexterity: 8,
        intelligence: 6
      },
      growthStats: {
        health: 30,
        mana: 8,
        strength: 4,
        dexterity: 1.5,
        intelligence: 1.2
      },
      allowedWeapons: ['sword', 'axe'],
      skills: {
        basic: [
          'shield_bash',     // 3秒CD 盾牌打擊
          'provoke'          // 嘲諷
        ],
        advanced: [
          'holy_protection', // 神聖守護
          'shield_wall'      // 盾牆
        ],
        ultimate: [
          'aegis_of_light'  // 聖光之盾
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['shield_bash', 'provoke'],
          attributeBonus: { strength: 3, health: 50 }
        },
        {
          level: 5,
          unlockedSkills: ['holy_protection'],
          attributeBonus: { strength: 3, intelligence: 2 }
        },
        {
          level: 10,
          unlockedSkills: ['shield_wall'],
          attributeBonus: { health: 100, strength: 4 }
        },
        {
          level: 15,
          unlockedSkills: ['aegis_of_light'],
          attributeBonus: { strength: 5, intelligence: 3 }
        }
      ],
      startingEquipment: ['iron_sword', 'knight_shield'],
      requirements: {
        baseClass: 'warrior',
        level: 20,
        stats: {
          strength: 25
        }
      }
    },
  
    // 狂戰士
    berserker: {
      id: 'berserker',
      name: '狂戰士',
      description: '狂暴的戰士進階職業，犧牲防禦換取極高的攻擊力。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 130,
        mana: 30,
        strength: 18,
        dexterity: 10,
        intelligence: 4
      },
      growthStats: {
        health: 22,
        mana: 4,
        strength: 4.5,
        dexterity: 2.5,
        intelligence: 0.8
      },
      allowedWeapons: ['axe', 'sword'],
      skills: {
        basic: [
          'wild_swing',      // 2秒CD 狂野揮擊
          'battle_cry'       // 戰吼
        ],
        advanced: [
          'rage',           // 狂暴
          'brutal_strike'   // 殘暴打擊
        ],
        ultimate: [
          'unstoppable'     // 無法阻擋
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['wild_swing', 'battle_cry'],
          attributeBonus: { strength: 4 }
        },
        {
          level: 5,
          unlockedSkills: ['rage'],
          attributeBonus: { strength: 5, dexterity: 2 }
        },
        {
          level: 10,
          unlockedSkills: ['brutal_strike'],
          attributeBonus: { strength: 6 }
        },
        {
          level: 15,
          unlockedSkills: ['unstoppable'],
          attributeBonus: { strength: 8, health: 100 }
        }
      ],
      startingEquipment: ['battle_axe', 'berserker_armor'],
      requirements: {
        baseClass: 'warrior',
        level: 20,
        stats: {
          strength: 30
        }
      }
    },
  
    // 基礎法師
    mage: {
      id: 'mage',
      name: '法師',
      description: '精通元素魔法的施法者，具有強大的範圍傷害能力。',
      type: 'beginner',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 80,
        mana: 120,
        strength: 4,
        dexterity: 6,
        intelligence: 15
      },
      growthStats: {
        health: 15,
        mana: 30,
        strength: 1,
        dexterity: 1.5,
        intelligence: 4
      },
      allowedWeapons: ['staff'],
      skills: {
        basic: [
          'magic_missile',   // 2秒CD 魔法飛彈
          'mana_shield'      // 法力護盾
        ],
        advanced: [
          'fireball',        // 火球術
          'frost_nova'       // 冰霜新星
        ],
        ultimate: []
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['magic_missile'],
          attributeBonus: { intelligence: 2, mana: 20 }
        },
        {
          level: 3,
          unlockedSkills: ['mana_shield'],
          attributeBonus: { intelligence: 2, mana: 30 }
        },
        {
          level: 5,
          unlockedSkills: ['fireball'],
          attributeBonus: { intelligence: 3, mana: 40 }
        },
        {
          level: 8,
          unlockedSkills: ['frost_nova'],
          attributeBonus: { intelligence: 4, mana: 50 }
        }
      ],
      startingEquipment: ['apprentice_staff', 'magic_robe']
    },
  
    // 元素師
    elementalist: {
      id: 'elementalist',
      name: '元素師',
      description: '專精於操控自然元素的法師進階職業。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 85,
        mana: 150,
        strength: 4,
        dexterity: 8,
        intelligence: 18
      },
      growthStats: {
        health: 16,
        mana: 35,
        strength: 1,
        dexterity: 2,
        intelligence: 4.5
      },
      allowedWeapons: ['staff'],
      skills: {
        basic: [
          'elemental_bolt',    // 2秒CD 元素彈
          'element_shift'      // 元素切換
        ],
        advanced: [
          'chain_lightning',   // 連鎖閃電
          'frozen_orb',        // 寒冰球
          'flame_pillar'       // 火焰柱
        ],
        ultimate: [
          'elemental_mastery'  // 元素掌控
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['elemental_bolt', 'element_shift'],
          attributeBonus: { intelligence: 4, mana: 50 }
        },
        {
          level: 5,
          unlockedSkills: ['chain_lightning'],
          attributeBonus: { intelligence: 4, dexterity: 2 }
        },
        {
          level: 8,
          unlockedSkills: ['frozen_orb'],
          attributeBonus: { intelligence: 5, mana: 60 }
        },
        {
          level: 12,
          unlockedSkills: ['flame_pillar'],
          attributeBonus: { intelligence: 6 }
        },
        {
          level: 15,
          unlockedSkills: ['elemental_mastery'],
          attributeBonus: { intelligence: 8, mana: 100 }
        }
      ],
      startingEquipment: ['elemental_staff', 'elemental_robe'],
      requirements: {
        baseClass: 'mage',
        level: 20,
        stats: {
          intelligence: 30
        }
      }
    },
  
    // 術士
    warlock: {
      id: 'warlock',
      name: '術士',
      description: '操控黑暗力量的法師進階職業，專精於詛咒和生命汲取。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 90,
        mana: 140,
        strength: 5,
        dexterity: 7,
        intelligence: 17
      },
      growthStats: {
        health: 18,
        mana: 32,
        strength: 1.2,
        dexterity: 1.8,
        intelligence: 4.2
      },
      allowedWeapons: ['staff'],
      skills: {
        basic: [
          'shadow_bolt',     // 2秒CD 暗影箭
          'life_tap'         // 生命轉換
        ],
        advanced: [
          'drain_life',      // 生命汲取
          'curse_of_agony',  // 痛苦詛咒
          'demonic_circle'   // 惡魔傳送陣
        ],
        ultimate: [
          'demonic_transformation'  // 惡魔化身
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['shadow_bolt', 'life_tap'],
          attributeBonus: { intelligence: 4, health: 30 }
        },
        {
          level: 5,
          unlockedSkills: ['drain_life'],
          attributeBonus: { intelligence: 4, mana: 50 }
        },
        {
          level: 8,
          unlockedSkills: ['curse_of_agony'],
          attributeBonus: { intelligence: 5 }
        },
        {
          level: 12,
          unlockedSkills: ['demonic_circle'],
          attributeBonus: { intelligence: 5, health: 50 }
        },
        {
          level: 15,
          unlockedSkills: ['demonic_transformation'],
          attributeBonus: { intelligence: 7, health: 70 }
        }
      ],
      startingEquipment: ['dark_staff', 'warlock_robe'],
      requirements: {
        baseClass: 'mage',
        level: 20,
        stats: {
          intelligence: 28
        }
      }
    }
  };