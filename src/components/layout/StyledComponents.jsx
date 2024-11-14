import { styled } from "@mui/material";
import { Drawer, ListItemText, IconButton } from "@mui/material";

/**
 * 自定義帶有過渡效果的抽屜組件
 */
export const TransitionDrawer = styled(Drawer)(({ theme, width }) => ({
	width: width,
	flexShrink: 0,
	whiteSpace: "nowrap",
	"& .MuiDrawer-paper": {
		width: width,
		transition: theme.transitions.create(["width", "transform"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.standard,
		}),
		overflowX: "hidden",
		backgroundColor: theme.palette.background.default,
	},
}));

/**
 * 可折疊的選單文字組件
 */
export const CollapsibleText = styled(ListItemText, {
	shouldForwardProp: (prop) => prop !== "isexpanded",
})(({ isexpanded = "false" }) => ({
	opacity: isexpanded === "true" ? 1 : 0,
	transition: "opacity 0.2s",
	whiteSpace: "nowrap",
}));

/**
 * 固定按鈕組件
 */
export const PinButton = styled(IconButton)(({ theme }) => ({
	position: "absolute",
	bottom: 16,
	right: 16,
	width: 32,
	height: 32,
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[2],
	"&:hover": {
		backgroundColor: theme.palette.action.hover,
	},
	transition: theme.transitions.create(["transform", "background-color"], {
		duration: theme.transitions.duration.shorter,
	}),
}));
