import {Class} from "../type";

export const supportClasses: Record<string, Class> = {
    // 基礎牧師
    priest: {
      id: 'priest',
      name: '牧師',
      description: '精通治療和神聖魔法的輔助職業，為隊伍提供重要的支援。',
      type: 'beginner',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 90,
        mana: 100,
        strength: 5,
        dexterity: 7,
        intelligence: 14
      },
      growthStats: {
        health: 18,
        mana: 25,
        strength: 1.2,
        dexterity: 1.5,
        intelligence: 3.8
      },
      allowedWeapons: ['staff', 'mace'],
      skills: {
        basic: [
          'holy_smite',      // 2秒CD 神聖懲擊
          'heal'             // 基礎治療
        ],
        advanced: [
          'group_heal',      // 群體治療
          'divine_shield'    // 神聖護盾
        ],
        ultimate: []
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['holy_smite', 'heal'],
          attributeBonus: { intelligence: 3, mana: 30 }
        },
        {
          level: 4,
          unlockedSkills: ['group_heal'],
          attributeBonus: { intelligence: 3, mana: 40 }
        },
        {
          level: 8,
          unlockedSkills: ['divine_shield'],
          attributeBonus: { intelligence: 4, health: 50 }
        }
      ],
      startingEquipment: ['novice_staff', 'priest_robe']
    },
  
    // 主教
    bishop: {
      id: 'bishop',
      name: '主教',
      description: '專精於神聖魔法和團隊增益的牧師進階職業。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 95,
        mana: 120,
        strength: 6,
        dexterity: 8,
        intelligence: 16
      },
      growthStats: {
        health: 20,
        mana: 28,
        strength: 1.4,
        dexterity: 1.8,
        intelligence: 4
      },
      allowedWeapons: ['staff', 'mace'],
      skills: {
        basic: [
          'divine_bolt',     // 2秒CD 神聖箭
          'mass_heal'        // 範圍治療
        ],
        advanced: [
          'resurrection',    // 復活
          'holy_word',      // 神聖之言
          'blessing'        // 祝福
        ],
        ultimate: [
          'divine_intervention' // 神聖干預
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['divine_bolt', 'mass_heal'],
          attributeBonus: { intelligence: 4, mana: 50 }
        },
        {
          level: 5,
          unlockedSkills: ['resurrection'],
          attributeBonus: { intelligence: 4, mana: 60 }
        },
        {
          level: 8,
          unlockedSkills: ['holy_word'],
          attributeBonus: { intelligence: 5, health: 60 }
        },
        {
          level: 12,
          unlockedSkills: ['blessing'],
          attributeBonus: { intelligence: 5, mana: 80 }
        },
        {
          level: 15,
          unlockedSkills: ['divine_intervention'],
          attributeBonus: { intelligence: 7, health: 100 }
        }
      ],
      startingEquipment: ['bishop_staff', 'holy_robe'],
      requirements: {
        baseClass: 'priest',
        level: 20,
        stats: {
          intelligence: 30,
          mana: 500
        }
      }
    },
  
    // 聖騎士
    paladin: {
      id: 'paladin',
      name: '聖騎士',
      description: '結合戰士力量和神聖魔法的混合職業。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 110,
        mana: 80,
        strength: 13,
        dexterity: 8,
        intelligence: 12
      },
      growthStats: {
        health: 25,
        mana: 15,
        strength: 3,
        dexterity: 1.5,
        intelligence: 2.5
      },
      allowedWeapons: ['sword', 'mace'],
      skills: {
        basic: [
          'holy_strike',     // 2秒CD 聖光打擊
          'lay_on_hands'     // 聖療
        ],
        advanced: [
          'divine_storm',    // 神聖風暴
          'consecration',    // 奉獻
          'righteous_shield' // 正義之盾
        ],
        ultimate: [
          'avenging_wrath'   // 復仇之怒
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['holy_strike', 'lay_on_hands'],
          attributeBonus: { strength: 3, intelligence: 2 }
        },
        {
          level: 5,
          unlockedSkills: ['divine_storm'],
          attributeBonus: { strength: 3, intelligence: 3 }
        },
        {
          level: 8,
          unlockedSkills: ['consecration'],
          attributeBonus: { strength: 4, health: 70 }
        },
        {
          level: 12,
          unlockedSkills: ['righteous_shield'],
          attributeBonus: { strength: 4, intelligence: 3 }
        },
        {
          level: 15,
          unlockedSkills: ['avenging_wrath'],
          attributeBonus: { strength: 5, intelligence: 4 }
        }
      ],
      startingEquipment: ['paladin_sword', 'holy_armor'],
      requirements: {
        baseClass: 'priest',
        level: 20,
        stats: {
          strength: 20,
          intelligence: 20
        }
      }
    },
  
    // 占星師
    astrologian: {
      id: 'astrologian',
      name: '占星師',
      description: '通過星象占卜提供獨特增益效果的輔助職業。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 85,
        mana: 110,
        strength: 4,
        dexterity: 9,
        intelligence: 15
      },
      growthStats: {
        health: 16,
        mana: 26,
        strength: 1,
        dexterity: 2,
        intelligence: 3.8
      },
      allowedWeapons: ['staff', 'globe'],
      skills: {
        basic: [
          'malefic',         // 2秒CD 星極射線
          'benefic'          // 星極治療
        ],
        advanced: [
          'draw_card',       // 抽卡
          'celestial_opposition', // 星位對應
          'collective_unconscious' // 命運之輪
        ],
        ultimate: [
          'astral_stasis'    // 星極結界
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['malefic', 'benefic'],
          attributeBonus: { intelligence: 3, dexterity: 2 }
        },
        {
          level: 5,
          unlockedSkills: ['draw_card'],
          attributeBonus: { intelligence: 4, mana: 50 }
        },
        {
          level: 8,
          unlockedSkills: ['celestial_opposition'],
          attributeBonus: { intelligence: 4, dexterity: 3 }
        },
        {
          level: 12,
          unlockedSkills: ['collective_unconscious'],
          attributeBonus: { intelligence: 5, mana: 70 }
        },
        {
          level: 15,
          unlockedSkills: ['astral_stasis'],
          attributeBonus: { intelligence: 6, dexterity: 4 }
        }
      ],
      startingEquipment: ['astrolabe', 'starseeker_robe'],
      requirements: {
        baseClass: 'priest',
        level: 20,
        stats: {
          intelligence: 25,
          dexterity: 15
        }
      }
    },
  
    // 咒術師
    occultist: {
      id: 'occultist',
      name: '咒術師',
      description: '專精於詛咒和虛弱法術的暗系輔助職業。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 88,
        mana: 105,
        strength: 5,
        dexterity: 8,
        intelligence: 16
      },
      growthStats: {
        health: 17,
        mana: 24,
        strength: 1.2,
        dexterity: 1.8,
        intelligence: 3.9
      },
      allowedWeapons: ['staff', 'grimoire'],
      skills: {
        basic: [
          'eldritch_blast',   // 2秒CD 詭異衝擊
          'weakening_curse'   // 衰弱詛咒
        ],
        advanced: [
          'blood_pact',       // 血之契約
          'sacrificial_heal', // 獻祭治療
          'mark_of_doom'      // 厄運印記
        ],
        ultimate: [
          'void_ritual'       // 虛空儀式
        ]
    },
      progression: [
        {
          level: 1,
          unlockedSkills: ['eldritch_blast', 'weakening_curse'],
          attributeBonus: { intelligence: 4, mana: 40 }
        },
        {
          level: 5,
          unlockedSkills: ['blood_pact'],
          attributeBonus: { intelligence: 4, health: 40 }
        },
        {
          level: 8,
          unlockedSkills: ['sacrificial_heal'],
          attributeBonus: { intelligence: 5, mana: 50 }
        },
        {
          level: 12,
          unlockedSkills: ['mark_of_doom'],
          attributeBonus: { intelligence: 5, dexterity: 3 }
        },
        {
          level: 15,
          unlockedSkills: ['void_ritual'],
          attributeBonus: { intelligence: 7, health: 60 }
        }
      ],
      startingEquipment: ['occult_staff', 'dark_robes'],
      requirements: {
        baseClass: 'priest',
        level: 20,
        stats: {
          intelligence: 28,
          health: 400
        }
      }
    }
  };
  