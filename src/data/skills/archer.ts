export const archerSkills: Record<string, Skill[]> = {
    // 弓箭手基礎技能
    archer: [
      {
        id: 'quick_shot',
        name: '快速射擊',
        description: '快速射出一箭',
        type: 'attack',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 2,
        manaCost: 10,
        range: 8,
        damage: {
          base: 20,
          scaling: { dexterity: 0.9 }
        },
        requirements: {
          level: 1,
          weapon: ['bow']
        }
      },
      {
        id: 'aimed_shot',
        name: '瞄準射擊',
        description: '蓄力瞄準，造成高傷害',
        type: 'attack',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 8,
        manaCost: 25,
        castTime: 1.5,
        range: 10,
        damage: {
          base: 45,
          scaling: { dexterity: 1.2 }
        },
        requirements: {
          level: 4,
          weapon: ['bow']
        }
      },
      {
        id: 'multishot',
        name: '多重射擊',
        description: '同時射出多支箭矢',
        type: 'attack',
        damageType: 'physical',
        targetType: 'area',
        cooldown: 12,
        manaCost: 30,
        range: 7,
        area: 4,
        damage: {
          base: 30,
          scaling: { dexterity: 0.7 }
        },
        requirements: {
          level: 8,
          weapon: ['bow']
        }
      }
    ],
  
    // 獵人技能
    ranger: [
      {
        id: 'poisoned_arrow',
        name: '淬毒箭',
        description: '射出淬毒的箭矢',
        type: 'attack',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 3,
        manaCost: 20,
        range: 8,
        damage: {
          base: 25,
          scaling: { dexterity: 0.8 }
        },
        effects: [
          { type: 'poison', value: 15, duration: 5 }
        ],
        requirements: {
          level: 1,
          weapon: ['bow']
        }
      },
      {
        id: 'trap_setting',
        name: '設置陷阱',
        description: '在地面設置陷阱',
        type: 'utility',
        damageType: 'physical',
        targetType: 'area',
        cooldown: 15,
        manaCost: 35,
        range: 5,
        area: 2,
        effects: [
          { type: 'slow', value: 50, duration: 3 },
          { type: 'bleed', value: 20, duration: 4 }
        ],
        requirements: {
          level: 5
        }
      },
      {
        id: 'beast_taming',
        name: '野獸馴服',
        description: '嘗試馴服野生動物',
        type: 'utility',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 60,
        manaCost: 50,
        range: 4,
        requirements: {
          level: 8
        }
      }
    ],
  
    // 狙擊手技能
    sniper: [
      {
        id: 'headshot',
        name: '致命射擊',
        description: '瞄準要害進行攻擊',
        type: 'attack',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 15,
        manaCost: 40,
        castTime: 2,
        range: 12,
        damage: {
          base: 80,
          scaling: { dexterity: 1.5 }
        },
        requirements: {
          level: 1,
          weapon: ['bow']
        }
      },
      {
        id: 'piercing_shot',
        name: '穿透射擊',
        description: '射出可穿透敵人的箭矢',
        type: 'attack',
        damageType: 'physical',
        targetType: 'line',
        cooldown: 10,
        manaCost: 35,
        range: 10,
        damage: {
          base: 45,
          scaling: { dexterity: 1.0 }
        },
        effects: [
          { type: 'defense_down', value: 20, duration: 4 }
        ],
        requirements: {
          level: 5,
          weapon: ['bow']
        }
      },
      {
        id: 'camouflage',
        name: '偽裝',
        description: '進入隱身狀態',
        type: 'buff',
        damageType: 'physical',
        targetType: 'self',
        cooldown: 25,
        manaCost: 45,
        range: 0,
        effects: [
          { type: 'stealth', value: 0, duration: 10 }
        ],
        requirements: {
          level: 8
        }
      }
    ]
  };