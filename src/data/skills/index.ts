import { Skill } from '../type';
import { warriorSkills } from './warrior';
import { mageSkills } from './mage';
import { archerSkills } from './archer';

/**
 * 合併所有技能資料
 * 將 Record<string, Skill[]> 轉換為扁平的技能列表
 */
export const skills: Skill[] = [
    ...Object.values(warriorSkills).flat(),
    ...Object.values(mageSkills).flat(),
    ...Object.values(archerSkills).flat()
  ];


/**
 * 以職業為鍵的技能查找表
 * 用於快速查找某個職業的所有技能
 */
export const skillsByClass: Record<string, Skill[]> = {
    // 戰士系
    warrior: warriorSkills.warrior,
    knight: warriorSkills.knight,
    berserker: warriorSkills.berserker,
  
    // 法師系
    mage: mageSkills.mage,
    elementalist: mageSkills.elementalist,
    warlock: mageSkills.warlock,
  
    // 弓箭手系
    archer: archerSkills.archer,
    ranger: archerSkills.ranger,
    sniper: archerSkills.sniper,
    
    // ... 其他職業的技能
  };

  // 可選：創建一個快速查找的 Map
export const skillMap = new Map(skills.map(skill => [skill.id, skill]));