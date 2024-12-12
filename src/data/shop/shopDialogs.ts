/**
 * 店主對話類型
 */
export type ShopDialogType =
	| "welcome" // 進入商店時
	| "introduce" // 查看商品時
	| "farewell" // 關閉商店時
	| "thanks" // 購買完成時
	| "poorLeave" // 金錢不足關閉時
	| "chat"; // 閒聊時

/**
 * 店主對話介面
 */
export interface ShopkeeperDialog {
	name: string; // 店主名稱
	welcome: string[]; // 歡迎語，隨機選一個
	introduce: string[]; // 介紹商品語
	farewell: string[]; // 道別語
	thanks: string[]; // 感謝購買語
	poorLeave: string[]; // 金錢不足時的吐槽
	chat: string[]; // 閒聊時
}

/**
 * 預設店主對話
 */
export const DEFAULT_DIALOGS: ShopkeeperDialog = {
	name: "店主",
	welcome: [
		"歡迎光臨！需要些什麼嗎？",
		"這裡應有盡有，請隨便看看。",
		"來得正好，最近進了一批好貨。",
	],
	introduce: [
		"這個可是我們店裡的熱銷品。",
		"保證物超所值！",
		"品質絕對有保證。",
	],
	farewell: ["下次再來！", "路上小心。", "期待您的再次光臨。"],
	thanks: ["謝謝惠顧！", "這是個明智的選擇。", "希望您會喜歡。"],
	poorLeave: [
		"看來您的錢包有點乾癟呢...",
		"存好錢再來吧。",
		"唉...還是先去賺錢吧。",
	],
	chat: [
		"最近的生意還不錯，冒險者們都需要補給。",
		"你知道嗎？每個城鎮的物價都不太一樣，要貨比三家啊。",
		"我這行做了二十多年了，見過不少冒險者...唉，可惜有些再也沒回來。",
		"聽說北方的迷霧最近特別濃，要去那邊的話一定要準備充足。",
		"這些商品可都是我親自挑選的，保證品質沒問題！",
		"最近物價漲得厲害，我也很無奈啊...",
		"要是能找到穩定的商品供應商就好了，你有興趣嗎？開玩笑的！",
	],
};

/**
 * 商店店主對話配置
 */
export const shopDialogs: Record<string, ShopkeeperDialog> = {
	// 新手村商店
	"f1-store": {
		name: "艾瑪",
		welcome: ["新手冒險者？來得正好！", "需要些基礎裝備嗎？這裡應有盡有。"],
		introduce: [
			"這些都是新手冒險者最需要的物品。",
			"品質雖然普通，但絕對耐用！",
		],
		farewell: [
			"路上要小心，這一帶的野獸有點兇。",
			"去打獵的話記得帶足補給品！",
		],
		thanks: ["東西都檢查過了，保證沒問題。", "希望這些能幫助你的冒險。"],
		poorLeave: [
			"新手不容易啊...要不要去接點任務？",
			"附近的野外探索也能賺到一些錢。",
		],
		chat: [
			"新手村雖然平靜，但野外的魔物可不好對付。",
			"你是第一次冒險嗎？要好好準備裝備啊。",
			"聽說城外的狼群最近特別活躍，要小心。",
			"這裡的生活很平靜，就是偶爾會想去冒險呢...",
			"我家就在店後面，方便照顧生意。",
			"有時候會想從冒險者那裡收購一些特別的物品...",
			"你知道嗎？這家店是我爺爺開的，已經傳了三代了。",
		],
	},

	// 迷霧之村商店
	"f2-store": {
		name: "奧斯卡",
		welcome: ["是從初始之村來的冒險者嗎？", "這裡的迷霧很危險，要做好準備。"],
		introduce: [
			"這些都是在迷霧中探索的必需品。",
			"雖然價格高了點，但在迷霧中可是保命的東西。",
		],
		farewell: ["迷霧中小心那些影子...", "如果遇到危險，記得及時使用道具。"],
		thanks: [
			"這些都是我特地從各地收集來的好東西。",
			"在迷霧中一定會派上用場。",
		],
		poorLeave: [
			"看來你還不太適應這裡的物價呢...",
			"要不要試試迷霧森林的深處？聽說有寶物。",
		],
		chat: [
			"迷霧中藏著很多秘密，但也充滿危險。",
			"這裡的居民都習慣了迷霧，但外來者常常會迷路。",
			"我收藏了一些在迷霧中發現的奇特物品...",
			"有時在夜晚，能聽到迷霧中傳來奇怪的聲音。",
			"這家店以前是個驛站，後來才改成商店的。",
			"迷霧似乎在變得越來越濃...",
			"你相信迷霧中有古老的遺跡嗎？我聽說過一些傳聞...",
		],
	},
};

/**
 * 取得店主對話
 */
export const getShopDialog = (shopId: string, type: ShopDialogType): string => {
	const dialog = shopDialogs[shopId] || DEFAULT_DIALOGS;
	const dialogList = dialog[type];
	return dialogList[Math.floor(Math.random() * dialogList.length)];
};

/**
 * 取得店主名稱
 */
export const getShopkeeperName = (shopId: string): string => {
	return (shopDialogs[shopId] || DEFAULT_DIALOGS).name;
};
