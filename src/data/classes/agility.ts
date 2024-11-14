import {Class} from "../type";

export const agilityClasses: Record<string, Class> = {
    // 基礎弓箭手
    archer: {
      id: 'archer',
      name: '弓箭手',
      description: '精通遠程攻擊的射手，擅長持續輸出和風箭術。',
      type: 'beginner',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 90,
        mana: 60,
        strength: 7,
        dexterity: 15,
        intelligence: 8
      },
      growthStats: {
        health: 18,
        mana: 12,
        strength: 2,
        dexterity: 4,
        intelligence: 2
      },
      allowedWeapons: ['bow'],
      skills: {
        basic: [
          'quick_shot',      // 1.5秒CD 快速射擊
          'wind_step'        // 風行疾步
        ],
        advanced: [
          'multishot',       // 多重射擊
          'eagle_eye'        // 鷹眼
        ],
        ultimate: []
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['quick_shot'],
          attributeBonus: { dexterity: 3 }
        },
        {
          level: 3,
          unlockedSkills: ['wind_step'],
          attributeBonus: { dexterity: 2 }
        },
        {
          level: 5,
          unlockedSkills: ['multishot'],
          attributeBonus: { dexterity: 3 }
        },
        {
          level: 8,
          unlockedSkills: ['eagle_eye'],
          attributeBonus: { dexterity: 4, intelligence: 2 }
        }
      ],
      startingEquipment: ['training_bow', 'leather_armor']
    },
  
    // 遊俠
    ranger: {
      id: 'ranger',
      name: '遊俠',
      description: '精通追蹤和陷阱的弓箭手進階職業，可以馴服野獸。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 100,
        mana: 80,
        strength: 8,
        dexterity: 17,
        intelligence: 10
      },
      growthStats: {
        health: 20,
        mana: 15,
        strength: 2.2,
        dexterity: 4.2,
        intelligence: 2.5
      },
      allowedWeapons: ['bow'],
      skills: {
        basic: [
          'precise_shot',    // 2秒CD 精準射擊
          'trap_setting'     // 設置陷阱
        ],
        advanced: [
          'beast_taming',    // 野獸馴服
          'nature_shot',     // 自然之箭
          'camouflage'       // 偽裝
        ],
        ultimate: [
          'call_of_wild'     // 野性呼喚
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['precise_shot', 'trap_setting'],
          attributeBonus: { dexterity: 4, intelligence: 2 }
        },
        {
          level: 5,
          unlockedSkills: ['beast_taming'],
          attributeBonus: { dexterity: 3, intelligence: 3 }
        },
        {
          level: 8,
          unlockedSkills: ['nature_shot'],
          attributeBonus: { dexterity: 4 }
        },
        {
          level: 12,
          unlockedSkills: ['camouflage'],
          attributeBonus: { dexterity: 5 }
        },
        {
          level: 15,
          unlockedSkills: ['call_of_wild'],
          attributeBonus: { dexterity: 6, intelligence: 4 }
        }
      ],
      startingEquipment: ['ranger_bow', 'ranger_cloak'],
      requirements: {
        baseClass: 'archer',
        level: 20,
        stats: {
          dexterity: 30,
          intelligence: 15
        }
      }
    },
  
    // 狙擊手
    sniper: {
      id: 'sniper',
      name: '狙擊手',
      description: '專精於致命一擊的弓箭手進階職業，擅長遠距離狙殺。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 85,
        mana: 70,
        strength: 7,
        dexterity: 20,
        intelligence: 9
      },
      growthStats: {
        health: 17,
        mana: 13,
        strength: 1.8,
        dexterity: 4.8,
        intelligence: 2.2
      },
      allowedWeapons: ['bow'],
      skills: {
        basic: [
          'steady_shot',     // 2秒CD 穩固射擊
          'take_aim'         // 瞄準
        ],
        advanced: [
          'headshot',        // 爆頭射擊
          'piercing_arrow',  // 穿透箭
          'concussive_shot'  // 震盪射擊
        ],
        ultimate: [
          'deadly_shot'      // 致命狙擊
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['steady_shot', 'take_aim'],
          attributeBonus: { dexterity: 5 }
        },
        {
          level: 5,
          unlockedSkills: ['headshot'],
          attributeBonus: { dexterity: 4, intelligence: 2 }
        },
        {
          level: 8,
          unlockedSkills: ['piercing_arrow'],
          attributeBonus: { dexterity: 5 }
        },
        {
          level: 12,
          unlockedSkills: ['concussive_shot'],
          attributeBonus: { dexterity: 6 }
        },
        {
          level: 15,
          unlockedSkills: ['deadly_shot'],
          attributeBonus: { dexterity: 8 }
        }
      ],
      startingEquipment: ['marksman_bow', 'sniper_gear'],
      requirements: {
        baseClass: 'archer',
        level: 20,
        stats: {
          dexterity: 35
        }
      }
    },
  
    // 基礎盜賊
    rogue: {
      id: 'rogue',
      name: '盜賊',
      description: '精通匕首和潛行的敏捷型職業，擅長突襲和暴擊。',
      type: 'beginner',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 85,
        mana: 50,
        strength: 8,
        dexterity: 15,
        intelligence: 7
      },
      growthStats: {
        health: 17,
        mana: 10,
        strength: 2,
        dexterity: 4,
        intelligence: 1.8
      },
      allowedWeapons: ['dagger'],
      skills: {
        basic: [
          'quick_stab',      // 1.5秒CD 快速刺擊
          'stealth'          // 潛行
        ],
        advanced: [
          'backstab',        // 背刺
          'poison_blade'     // 淬毒之刃
        ],
        ultimate: []
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['quick_stab'],
          attributeBonus: { dexterity: 3 }
        },
        {
          level: 3,
          unlockedSkills: ['stealth'],
          attributeBonus: { dexterity: 2 }
        },
        {
          level: 5,
          unlockedSkills: ['backstab'],
          attributeBonus: { dexterity: 4 }
        },
        {
          level: 8,
          unlockedSkills: ['poison_blade'],
          attributeBonus: { dexterity: 3, intelligence: 2 }
        }
      ],
      startingEquipment: ['iron_dagger', 'leather_armor']
    },
  
    // 刺客
    assassin: {
      id: 'assassin',
      name: '刺客',
      description: '專精於潛行暗殺的盜賊進階職業，擅長一擊必殺。',
      type: 'advanced',
      baseStats: {
        level: 1,
        experience: 0,
        nextLevelExp: 100,
        health: 90,
        mana: 60,
        strength: 9,
        dexterity: 18,
        intelligence: 8
      },
      growthStats: {
        health: 18,
        mana: 12,
        strength: 2.2,
        dexterity: 4.5,
        intelligence: 2
      },
      allowedWeapons: ['dagger'],
      skills: {
        basic: [
          'shadow_strike',   // 2秒CD 暗影突襲
          'vanish'          // 消失
        ],
        advanced: [
          'death_mark',     // 死亡印記
          'venom_blade',    // 劇毒之刃
          'shadow_step'     // 暗影步
        ],
        ultimate: [
          'assassination'   // 暗殺
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['shadow_strike', 'vanish'],
          attributeBonus: { dexterity: 5 }
        },
        {
          level: 5,
          unlockedSkills: ['death_mark'],
          attributeBonus: { dexterity: 4, strength: 2 }
        },
        {
          level: 8,
          unlockedSkills: ['venom_blade'],
          attributeBonus: { dexterity: 5 }
        },
        {
          level: 12,
          unlockedSkills: ['shadow_step'],
          attributeBonus: { dexterity: 6 }
        },
        {
          level: 15,
          unlockedSkills: ['assassination'],
          attributeBonus: { dexterity: 8 }
        }
      ],
      startingEquipment: ['assassin_blade', 'shadow_armor'],
      requirements: {
        baseClass: 'rogue',
        level: 20,
        stats: {
          dexterity: 35
        }
      }
    }
  };