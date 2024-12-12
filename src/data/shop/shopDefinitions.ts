import { ShopDefinition, ShopItem } from "../type";
import { items } from "../item";

/**
 * 商店配置表
 * 根據地圖ID對應到該區域的商店列表
 */
export const shopsByArea: Record<string, ShopDefinition[]> = {
	// 新手村商店
	"f1-town": [
		{
			id: "f1-store",
			name: "冒險者商店",
			type: "store",
			description: "販售基本冒險用品",
			items: [
				// 消耗品
				{
					itemId: "small-health-potion",
					basePrice: 50,
					buyPrice: 25,
				},
				{
					itemId: "small-mana-potion",
					basePrice: 50,
					buyPrice: 25,
				},
				{
					itemId: "bread",
					basePrice: 10,
					buyPrice: 5,
				},
				// 武器
				{
					itemId: "training-sword",
					basePrice: 100,
					buyPrice: 50,
				},
				{
					itemId: "short-bow",
					basePrice: 100,
					buyPrice: 50,
				},
				{
					itemId: "apprentice-staff",
					basePrice: 100,
					buyPrice: 50,
				},
			],
		},
	],

	// 迷霧之村商店
	"f2-town": [
		{
			id: "f2-store",
			name: "迷霧商店",
			type: "store",
			description: "販售進階冒險用品",
			items: [
				// 消耗品
				{
					itemId: "medium-health-potion",
					basePrice: 150,
					buyPrice: 75,
				},
				{
					itemId: "medium-mana-potion",
					basePrice: 150,
					buyPrice: 75,
				},
				{
					itemId: "antidote",
					basePrice: 100,
					buyPrice: 50,
				},
				// 武器
				{
					itemId: "iron-sword",
					basePrice: 500,
					buyPrice: 250,
					requiredLevel: 10,
				},
				{
					itemId: "long-bow",
					basePrice: 500,
					buyPrice: 250,
					requiredLevel: 10,
				},
				{
					itemId: "magic-staff",
					basePrice: 500,
					buyPrice: 250,
					requiredLevel: 10,
				},
			],
		},
	],
};

/**
 * 取得指定區域的商店列表
 * @param areaId 區域ID
 */
export const getShopsByArea = (areaId: string): ShopDefinition[] => {
	return shopsByArea[areaId] || [];
};

/**
 * 取得商店的當前商品列表
 * @param shopId 商店ID
 * @param areaId 區域ID
 */
export const getShopItems = (shopId: string, areaId: string): ShopItem[] => {
	const shops = getShopsByArea(areaId);
	const shop = shops.find((s) => s.id === shopId);
	return shop?.items || [];
};
