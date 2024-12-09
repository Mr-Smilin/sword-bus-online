import { InventorySettings } from "../type";

export const DEFAULT_INVENTORY_SETTINGS: InventorySettings = {
	defaultMaxSlots: 999, // 預設20格
	maxStackByType: {
		consumable: 64, // 消耗品最多64個
		material: 255, // 材料最多255個
		misc: 255, // 雜物最多255個
	},
};

/**
 * 物品排序權重表
 * 用於整理背包時的排序優先級
 */
export const ITEM_TYPE_WEIGHT = {
	weapon: 1, // 武器優先
	armor: 2, // 其次防具
	accessory: 3, // 再來配飾
	consumable: 4, // 接著消耗品
	material: 5, // 然後材料
	misc: 6, // 最後雜物
	quest: 7, // 任務物品最底
} as const;
