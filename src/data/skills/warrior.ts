import {Skill} from '../type';

export const warriorSkills: Record<string, Skill[]> = {
    // 戰士基礎技能
    warrior: [
      {
        id: 'slash',
        name: '斬擊',
        description: '基礎劍術攻擊，對單一目標造成物理傷害',
        type: 'attack',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 2,
        manaCost: 10,
        range: 2,
        damage: {
          base: 20,
          scaling: { strength: 0.8 }
        },
        requirements: {
          level: 1,
          weapon: ['sword', 'axe']
        }
      },
      {
        id: 'defensive_stance',
        name: '防禦姿態',
        description: '進入防禦姿態，提升防禦力但降低移動速度',
        type: 'buff',
        damageType: 'physical',
        targetType: 'self',
        cooldown: 15,
        manaCost: 20,
        range: 0,
        effects: [
          { type: 'defense_up', value: 30, duration: 10 },
          { type: 'slow', value: 20, duration: 10 }
        ],
        requirements: {
          level: 3
        }
      },
      {
        id: 'intimidating_shout',
        name: '威嚇怒吼',
        description: '發出威嚇怒吼，降低周圍敵人的攻擊力',
        type: 'debuff',
        damageType: 'physical',
        targetType: 'area',
        cooldown: 20,
        manaCost: 25,
        range: 0,
        area: 5,
        effects: [
          { type: 'weakness', value: 20, duration: 8 }
        ],
        requirements: {
          level: 5
        }
      },
      {
        id: 'whirlwind',
        name: '旋風斬',
        description: '快速旋轉攻擊周圍敵人',
        type: 'attack',
        damageType: 'physical',
        targetType: 'area',
        cooldown: 12,
        manaCost: 30,
        range: 0,
        area: 3,
        damage: {
          base: 40,
          scaling: { strength: 0.6 }
        },
        requirements: {
          level: 8,
          weapon: ['sword', 'axe']
        }
      }
    ],
  
    // 騎士技能
    knight: [
      {
        id: 'shield_bash',
        name: '盾牌猛擊',
        description: '用盾牌攻擊敵人，有機會造成暈眩',
        type: 'attack',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 3,
        manaCost: 15,
        range: 2,
        damage: {
          base: 15,
          scaling: { strength: 0.6 }
        },
        effects: [
          { type: 'stun', value: 0, duration: 2, chance: 20 }
        ],
        requirements: {
          level: 1
        }
      },
      {
        id: 'holy_protection',
        name: '神聖守護',
        description: '召喚神聖護盾保護自己和附近隊友',
        type: 'buff',
        damageType: 'holy',
        targetType: 'area',
        cooldown: 25,
        manaCost: 35,
        range: 0,
        area: 4,
        effects: [
          { type: 'shield', value: 100, duration: 8 },
          { type: 'defense_up', value: 20, duration: 8 }
        ],
        requirements: {
          level: 5
        }
      },
      {
        id: 'provoke',
        name: '挑釁',
        description: '嘲諷目標，強制其攻擊自己',
        type: 'utility',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 8,
        manaCost: 20,
        range: 6,
        effects: [
          { type: 'taunt', value: 0, duration: 3 }
        ],
        requirements: {
          level: 3
        }
      },
      {
        id: 'righteous_strike',
        name: '正義打擊',
        description: '注入神聖之力的強力一擊',
        type: 'attack',
        damageType: 'holy',
        targetType: 'single',
        cooldown: 10,
        manaCost: 25,
        range: 2,
        damage: {
          base: 45,
          scaling: { strength: 0.9 }
        },
        effects: [
          { type: 'weakness', value: 15, duration: 4 }
        ],
        requirements: {
          level: 8,
          weapon: ['sword']
        }
      }
    ],
  
    // 狂戰士技能
    berserker: [
      {
        id: 'wild_swing',
        name: '狂野揮擊',
        description: '毫無章法的猛烈攻擊，無視部分防禦力',
        type: 'attack',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 3,
        manaCost: 20,
        range: 2,
        damage: {
          base: 30,
          scaling: { strength: 1.0 }
        },
        effects: [
          { type: 'ignore_defense', value: 30, duration: 0 }
        ],
        requirements: {
          level: 1,
          weapon: ['axe']
        }
      },
      {
        id: 'battle_rage',
        name: '戰鬥狂怒',
        description: '進入狂暴狀態，提升攻擊力但降低防禦',
        type: 'buff',
        damageType: 'physical',
        targetType: 'self',
        cooldown: 30,
        manaCost: 40,
        range: 0,
        effects: [
          { type: 'attack_up', value: 50, duration: 12 },
          { type: 'defense_down', value: 30, duration: 12 }
        ],
        requirements: {
          level: 5
        }
      },
      {
        id: 'bloodthirst',
        name: '嗜血',
        description: '攻擊帶有生命偷取效果',
        type: 'buff',
        damageType: 'physical',
        targetType: 'self',
        cooldown: 20,
        manaCost: 30,
        range: 0,
        effects: [
          { type: 'life_steal', value: 20, duration: 8 }
        ],
        requirements: {
          level: 8
        }
      },
      {
        id: 'brutal_strike',
        name: '殘暴打擊',
        description: '蓄力重擊，造成大量傷害並使目標流血',
        type: 'attack',
        damageType: 'physical',
        targetType: 'single',
        cooldown: 15,
        manaCost: 35,
        castTime: 1,
        range: 2,
        damage: {
          base: 70,
          scaling: { strength: 1.2 }
        },
        effects: [
          { type: 'bleed', value: 10, duration: 5 }
        ],
        requirements: {
          level: 12,
          weapon: ['axe']
        }
      }
    ]
  };