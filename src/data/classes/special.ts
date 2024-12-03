import { Class } from '../type';

export const specialClasses: Record<string, Class> = {
    // 召喚師
    summoner: {
      id: 'summoner',
      name: '召喚師',
      description: '通過召喚元素精靈和魔獸作戰的特殊職業，可同時控制多個召喚物。',
      type: 'advanced',
      baseStats: {
        level: 1,
        nextLevelExp: 100,
        health: 85,
        mana: 110,
        strength: 5,
        dexterity: 8,
        intelligence: 15
      },
      growthStats: {
        health: 17,
        mana: 25,
        strength: 1,
        dexterity: 2,
        intelligence: 3.8
      },
      allowedWeapons: ['staff', 'grimoire'],
      skills: {
        basic: [
          'spirit_bolt',      // 2秒CD 精靈彈
          'summon_elemental'  // 召喚元素精靈
        ],
        advanced: [
          'summon_beast',     // 召喚魔獸
          'essence_drain',    // 精華吸取
          'command_fury'      // 指揮狂暴
        ],
        ultimate: [
          'primal_avatar'     // 太古獸王
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['spirit_bolt', 'summon_elemental'],
          attributeBonus: { intelligence: 3, mana: 40 }
        },
        {
          level: 5,
          unlockedSkills: ['summon_beast'],
          attributeBonus: { intelligence: 4, mana: 50 }
        },
        {
          level: 8,
          unlockedSkills: ['essence_drain'],
          attributeBonus: { intelligence: 4, dexterity: 2 }
        },
        {
          level: 12,
          unlockedSkills: ['command_fury'],
          attributeBonus: { intelligence: 5, mana: 60 }
        },
        {
          level: 15,
          unlockedSkills: ['primal_avatar'],
          attributeBonus: { intelligence: 6, mana: 80 }
        }
      ],
      startingEquipment: ['summoning_staff', 'beast_tamer_robe'],
      requirements: {
        baseClass: 'mage',
        level: 20,
        stats: {
          intelligence: 25
        }
      }
    },
  
    // 時空法師
    chronomancer: {
      id: 'chronomancer',
      name: '時空法師',
      description: '操控時間和空間的特殊法師，能夠加速、減速和倒退時間。',
      type: 'advanced',
      baseStats: {
        level: 1,
        nextLevelExp: 100,
        health: 80,
        mana: 120,
        strength: 4,
        dexterity: 9,
        intelligence: 16
      },
      growthStats: {
        health: 15,
        mana: 28,
        strength: 1,
        dexterity: 2.2,
        intelligence: 4
      },
      allowedWeapons: ['staff', 'time_piece'],
      skills: {
        basic: [
          'temporal_bolt',    // 2秒CD 時間箭
          'haste'             // 加速
        ],
        advanced: [
          'time_stop',        // 時間停止
          'rewind',           // 時間倒流
          'paradox_field'     // 矛盾領域
        ],
        ultimate: [
          'temporal_collapse' // 時空崩壞
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['temporal_bolt', 'haste'],
          attributeBonus: { intelligence: 4, dexterity: 2 }
        },
        {
          level: 5,
          unlockedSkills: ['time_stop'],
          attributeBonus: { intelligence: 4, mana: 50 }
        },
        {
          level: 8,
          unlockedSkills: ['rewind'],
          attributeBonus: { intelligence: 5, dexterity: 3 }
        },
        {
          level: 12,
          unlockedSkills: ['paradox_field'],
          attributeBonus: { intelligence: 5, mana: 70 }
        },
        {
          level: 15,
          unlockedSkills: ['temporal_collapse'],
          attributeBonus: { intelligence: 7, dexterity: 4 }
        }
      ],
      startingEquipment: ['temporal_staff', 'time_warden_robes'],
      requirements: {
        baseClass: 'mage',
        level: 25,
        stats: {
          intelligence: 30,
          dexterity: 15
        },
        items: ['chronograph_crystal']
      }
    },
  
    // 死靈騎士
    death_knight: {
      id: 'death_knight',
      name: '死靈騎士',
      description: '結合戰士力量和死亡魔法的黑暗戰士，能夠操控亡靈。',
      type: 'advanced',
      baseStats: {
        level: 1,
        nextLevelExp: 100,
        health: 110,
        mana: 90,
        strength: 14,
        dexterity: 8,
        intelligence: 10
      },
      growthStats: {
        health: 24,
        mana: 15,
        strength: 3.5,
        dexterity: 1.8,
        intelligence: 2.5
      },
      allowedWeapons: ['runic_sword', 'death_blade'],
      skills: {
        basic: [
          'death_strike',     // 2秒CD 死亡打擊
          'raise_dead'        // 召喚骷髏
        ],
        advanced: [
          'death_grip',       // 死亡之握
          'blood_boil',       // 血液沸騰
          'frost_presence'    // 冰霜領域
        ],
        ultimate: [
          'army_of_dead'      // 亡靈大軍
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['death_strike', 'raise_dead'],
          attributeBonus: { strength: 3, intelligence: 2 }
        },
        {
          level: 5,
          unlockedSkills: ['death_grip'],
          attributeBonus: { strength: 4, health: 50 }
        },
        {
          level: 8,
          unlockedSkills: ['blood_boil'],
          attributeBonus: { strength: 4, intelligence: 3 }
        },
        {
          level: 12,
          unlockedSkills: ['frost_presence'],
          attributeBonus: { strength: 5, health: 70 }
        },
        {
          level: 15,
          unlockedSkills: ['army_of_dead'],
          attributeBonus: { strength: 6, intelligence: 4 }
        }
      ],
      startingEquipment: ['runic_blade', 'death_knight_armor'],
      requirements: {
        baseClass: 'warrior',
        level: 25,
        stats: {
          strength: 25,
          intelligence: 15
        },
        items: ['death_rune']
      }
    },
  
    // 元素使
    runeblade: {
      id: 'runeblade',
      name: '符文劍士',
      description: '將魔法符文注入武器的特殊戰士，可以釋放強大的符文魔法。',
      type: 'advanced',
      baseStats: {
        level: 1,
        nextLevelExp: 100,
        health: 100,
        mana: 100,
        strength: 12,
        dexterity: 10,
        intelligence: 12
      },
      growthStats: {
        health: 20,
        mana: 20,
        strength: 2.8,
        dexterity: 2.2,
        intelligence: 2.8
      },
      allowedWeapons: ['runic_sword', 'rune_blade'],
      skills: {
        basic: [
          'rune_strike',      // 2秒CD 符文斬擊
          'enchant_weapon'    // 武器附魔
        ],
        advanced: [
          'rune_burst',       // 符文爆發
          'elemental_blade',  // 元素之刃
          'runic_shield'      // 符文護盾
        ],
        ultimate: [
          'blade_tempest'     // 符文風暴
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['rune_strike', 'enchant_weapon'],
          attributeBonus: { strength: 3, intelligence: 3 }
        },
        {
          level: 5,
          unlockedSkills: ['rune_burst'],
          attributeBonus: { strength: 3, intelligence: 3 }
        },
        {
          level: 8,
          unlockedSkills: ['elemental_blade'],
          attributeBonus: { strength: 4, dexterity: 2 }
        },
        {
          level: 12,
          unlockedSkills: ['runic_shield'],
          attributeBonus: { strength: 4, intelligence: 4 }
        },
        {
          level: 15,
          unlockedSkills: ['blade_tempest'],
          attributeBonus: { strength: 5, intelligence: 5 }
        }
      ],
      startingEquipment: ['apprentice_runeblade', 'runic_armor'],
      requirements: {
        baseClass: 'warrior',
        level: 20,
        stats: {
          strength: 20,
          intelligence: 20
        },
        items: ['ancient_rune']
      }
    },
  
    // 機械師
    engineer: {
      id: 'engineer',
      name: '機械師',
      description: '運用科技和魔法結合的發明家，可以部署機械裝置和砲塔。',
      type: 'advanced',
      baseStats: {
        level: 1,
        nextLevelExp: 100,
        health: 95,
        mana: 85,
        strength: 8,
        dexterity: 12,
        intelligence: 13
      },
      growthStats: {
        health: 18,
        mana: 18,
        strength: 1.5,
        dexterity: 2.8,
        intelligence: 3.2
      },
      allowedWeapons: ['wrench', 'mechanical_arm'],
      skills: {
        basic: [
          'repair_bot',       // 2秒CD 修理機器人
          'deploy_turret'     // 部署砲塔
        ],
        advanced: [
          'energy_shield',    // 能量護盾
          'rocket_barrage',   // 火箭彈幕
          'overclock'         // 超頻
        ],
        ultimate: [
          'mechanical_army'   // 機械軍團
        ]
      },
      progression: [
        {
          level: 1,
          unlockedSkills: ['repair_bot', 'deploy_turret'],
          attributeBonus: { intelligence: 3, dexterity: 2 }
        },
        {
          level: 5,
          unlockedSkills: ['energy_shield'],
          attributeBonus: { intelligence: 3, dexterity: 3 }
        },
        {
          level: 8,
          unlockedSkills: ['rocket_barrage'],
          attributeBonus: { intelligence: 4, dexterity: 3 }
        },
        {
          level: 12,
          unlockedSkills: ['overclock'],
          attributeBonus: { intelligence: 4, dexterity: 4 }
        },
        {
          level: 15,
          unlockedSkills: ['mechanical_army'],
          attributeBonus: { intelligence: 5, dexterity: 5 }
        }
      ],
      startingEquipment: ['basic_wrench', 'engineer_goggles'],
      requirements: {
        baseClass: 'archer',
        level: 20,
        stats: {
          intelligence: 20,
          dexterity: 20
        },
        items: ['advanced_toolkit']
      }
    }
  };