import { Class } from '../type';
import { combatClasses } from './combat';
import { agilityClasses } from './agility';
import { supportClasses } from './support';
import { specialClasses } from './special';

/**
 * 合併所有職業資料
 */
export const classes: Record<string, Class> = {
    ...combatClasses,
    ...agilityClasses,
    ...supportClasses,
    ...specialClasses
  };

  
export const classMap = new Map(Object.entries(classes));