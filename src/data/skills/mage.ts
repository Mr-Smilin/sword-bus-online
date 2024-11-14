import {Skill} from '../type';

export const mageSkills: Record<string, Skill[]> = {
    // 法師基礎技能
    mage: [
      {
        id: 'magic_missile',
        name: '魔法飛彈',
        description: '發射一枚追蹤魔法飛彈，必中目標',
        type: 'attack',
        damageType: 'magic',
        targetType: 'single',
        cooldown: 2,
        manaCost: 15,
        range: 8,
        damage: {
          base: 25,
          scaling: { intelligence: 0.9 }
        },
        requirements: {
          level: 1,
          weapon: ['staff']
        }
      },
      {
        id: 'frost_bolt',
        name: '寒冰箭',
        description: '發射冰冷的魔法箭，減緩目標移動速度',
        type: 'attack',
        damageType: 'ice',
        targetType: 'single',
        cooldown: 4,
        manaCost: 20,
        range: 8,
        damage: {
          base: 30,
          scaling: { intelligence: 0.8 }
        },
        effects: [
          { type: 'slow', value: 30, duration: 3 }
        ],
        requirements: {
          level: 3,
          weapon: ['staff']
        }
      },
      {
        id: 'mana_shield',
        name: '法力護盾',
        description: '將魔力轉換為護盾，吸收傷害',
        type: 'buff',
        damageType: 'magic',
        targetType: 'self',
        cooldown: 15,
        manaCost: 40,
        range: 0,
        effects: [
          { type: 'shield', value: 150, duration: 10 }
        ],
        requirements: {
          level: 5
        }
      },
      {
        id: 'fireball',
        name: '火球術',
        description: '發射大火球，造成範圍傷害和燃燒效果',
        type: 'attack',
        damageType: 'fire',
        targetType: 'area',
        cooldown: 8,
        manaCost: 35,
        range: 7,
        area: 3,
        damage: {
          base: 45,
          scaling: { intelligence: 1.0 }
        },
        effects: [
          { type: 'burn', value: 10, duration: 4 }
        ],
        requirements: {
          level: 8,
          weapon: ['staff']
        }
      }
    ],
  
    // 元素師技能
    elementalist: [
      {
        id: 'elemental_surge',
        name: '元素迸發',
        description: '釋放隨機元素能量進行攻擊',
        type: 'attack',
        damageType: 'magic',
        targetType: 'single',
        cooldown: 3,
        manaCost: 20,
        range: 8,
        damage: {
          base: 35,
          scaling: { intelligence: 1.0 }
        },
        requirements: {
          level: 1,
          weapon: ['staff']
        }
      },
      {
        id: 'chain_lightning',
        name: '連鎖閃電',
        description: '釋放會跳躍的閃電，最多連擊3個目標',
        type: 'attack',
        damageType: 'lightning',
        targetType: 'single',
        cooldown: 10,
        manaCost: 45,
        range: 7,
        damage: {
          base: 40,
          scaling: { intelligence: 0.9 }
        },
        requirements: {
          level: 5,
          weapon: ['staff']
        }
      },
      {
        id: 'frost_nova',
        name: '寒冰新星',
        description: '釋放冰霜能量，凍結周圍敵人',
        type: 'attack',
        damageType: 'ice',
        targetType: 'area',
        cooldown: 15,
        manaCost: 50,
        range: 0,
        area: 4,
        damage: {
          base: 35,
          scaling: { intelligence: 0.7 }
        },
        effects: [
          { type: 'freeze', value: 0, duration: 2 }
        ],
        requirements: {
          level: 8,
          weapon: ['staff']
        }
      },
      {
        id: 'meteor_strike',
        name: '隕石術',
        description: '召喚巨大隕石砸向目標區域',
        type: 'attack',
        damageType: 'fire',
        targetType: 'area',
        cooldown: 25,
        manaCost: 80,
        castTime: 2,
        range: 10,
        area: 5,
        damage: {
          base: 120,
          scaling: { intelligence: 1.5 }
        },
        effects: [
          { type: 'burn', value: 20, duration: 5 }
        ],
        requirements: {
          level: 12,
          weapon: ['staff']
        }
      }
    ],
  
    // 術士技能
    warlock: [
      {
        id: 'shadow_bolt',
        name: '暗影箭',
        description: '發射暗影能量，造成持續傷害',
        type: 'attack',
        damageType: 'dark',
        targetType: 'single',
        cooldown: 3,
        manaCost: 25,
        range: 8,
        damage: {
          base: 30,
          scaling: { intelligence: 0.8 }
        },
        effects: [
          { type: 'weakness', value: 15, duration: 4 }
        ],
        requirements: {
          level: 1,
          weapon: ['staff']
        }
      },
      {
        id: 'life_drain',
        name: '生命汲取',
        description: '吸取目標生命值回復自身',
        type: 'attack',
        damageType: 'dark',
        targetType: 'single',
        cooldown: 8,
        manaCost: 35,
        range: 6,
        damage: {
          base: 40,
          scaling: { intelligence: 0.9 }
        },
        effects: [
          { type: 'life_steal', value: 100, duration: 0 }
        ],
        requirements: {
          level: 5,
          weapon: ['staff']
        }
      },
      {
        id: 'curse_of_weakness',
        name: '衰弱詛咒',
        description: '詛咒目標，降低其攻擊力和防禦力',
        type: 'debuff',
        damageType: 'dark',
        targetType: 'single',
        cooldown: 15,
        manaCost: 45,
        range: 7,
        effects: [
          { type: 'weakness', value: 25, duration: 8 },
          { type: 'defense_down', value: 25, duration: 8 }
        ],
        requirements: {
          level: 8
        }
      },
      {
        id: 'death_coil',
        name: '死亡纏繞',
        description: '釋放強大的暗影能量，造成巨大傷害並恢復自身生命',
        type: 'attack',
        damageType: 'dark',
        targetType: 'single',
        cooldown: 20,
        manaCost: 70,
        range: 6,
        damage: {
          base: 90,
          scaling: { intelligence: 1.3 }
        },
        effects: [
          { type: 'life_steal', value: 50, duration: 0 },
          { type: 'silence', value: 0, duration: 2 }
        ],
        requirements: {
          level: 12,
          weapon: ['staff']
        }
      },
      {
        id: 'summon_demon',
        name: '惡魔召喚',
        description: '召喚強大的惡魔為你作戰',
        type: 'utility',
        damageType: 'dark',
        targetType: 'self',
        cooldown: 60,
        manaCost: 100,
        range: 0,
        requirements: {
          level: 15
        }
      }
    ]
  };