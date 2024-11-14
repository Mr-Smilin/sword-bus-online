import {
	Person as PersonIcon,
	Backpack as BackpackIcon,
	AutoAwesome as SkillsIcon,
	Map as MapIcon,
} from "@mui/icons-material";

/**
 * 選單項目配置
 */
export const menuItems = [
	{ text: "角色資訊", id: "character", icon: <PersonIcon />, isModal: false },
	{ text: "背包道具", id: "inventory", icon: <BackpackIcon />, isModal: false },
	{ text: "技能列表", id: "skills", icon: <SkillsIcon />, isModal: false },
	{ text: "地圖", id: "map", icon: <MapIcon />, isModal: true },
];

/**
 * 取得選單項目樣式
 */
export const getMenuItemStyle = (itemId, isSelected, theme) => ({
	"&.MuiListItem-root": {
		backgroundColor: isSelected
			? theme.palette.mode === "light"
				? theme.palette.success.light
				: theme.palette.primary.light
			: "transparent",
		color: isSelected
			? theme.palette.mode === "light"
				? theme.palette.success.contrastText
				: theme.palette.primary.contrastText
			: theme.palette.text.primary,
		"&:hover": {
			backgroundColor: isSelected
				? theme.palette.mode === "light"
					? theme.palette.success.light
					: theme.palette.primary.dark
				: theme.palette.mode === "light"
				? theme.palette.success.light
				: theme.palette.primary.light,
		},
	},
});
