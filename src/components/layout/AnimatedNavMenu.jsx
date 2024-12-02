import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import { Person, Backpack, AutoAwesome, Map, Help } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// 背景遮罩
const NavBackground = styled("div")(({ theme, show }) => ({
	position: "fixed",
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	backgroundColor: "rgba(0, 0, 0, 0.8)",
	zIndex: theme.zIndex.drawer - 1,
	opacity: 0,
	visibility: "hidden",
	transition: "opacity 1s cubic-bezier(0.645, 0.045, 0.355, 1), visibility 1s",
	...(show && {
		opacity: 1,
		visibility: "visible",
	}),
}));

// 選單按鈕
const MenuButton = styled("button")(({ theme, open }) => ({
	cursor: "pointer",
	zIndex: theme.zIndex.drawer + 1,
	position: "fixed",
	left: 12,
	bottom: 9,
	width: 68,
	height: 68,
	border: "none",
	borderRadius: "50%",
	backgroundColor: "#e6e6e6",
	transform: "translate3d(0, 80px, 0)",
	transition: "all 1.5s cubic-bezier(0.645, 0.045, 0.355, 1)",
	"&.open": {
		backgroundColor: "#ffd700",
	},
	"&.show": {
		transform: "translate3d(0, 0, 0)",
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 4,
		left: 4,
		right: 4,
		bottom: 4,
		border: "2px solid #fff",
		borderRadius: "50%",
	},
	"&::after": {
		content: '""',
		position: "absolute",
		top: -4,
		left: -4,
		right: -4,
		bottom: -4,
		border: "1px solid rgba(255, 255, 255, 0.3)",
		borderRadius: "50%",
	},
	// 文字樣式
	"& .button-text": {
		position: "absolute",
		width: "100%",
		textAlign: "center",
		left: 0,
		top: "50%",
		transform: "translateY(-50%)",
		color: "#333",
		fontSize: "14px",
		fontWeight: "bold",
		letterSpacing: "1px",
	},
}));

// 導航選單
const NavMenu = styled("nav")(({ theme }) => ({
	zIndex: theme.zIndex.drawer,
	position: "fixed",
	left: 23,
	bottom: 100,
	"& ul": {
		listStyle: "none",
		padding: 0,
		margin: 0,
	},
}));

// 選單項目按鈕容器
const MenuItemContainer = styled("div")({
	display: "flex",
	alignItems: "center",
	gap: "10px",
});

// 選單項目按鈕
const MenuItemButton = styled("button")(({ theme, isOpen }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 48,
	height: 48,
	padding: 0,
	border: "none",
	borderRadius: "50%",
	backgroundColor: "#e6e6e6",
	cursor: "pointer",
	position: "relative",
	pointerEvents: isOpen ? "auto" : "none",
	"&::before": {
		content: '""',
		position: "absolute",
		top: 3,
		left: 3,
		right: 3,
		bottom: 3,
		border: "2px solid #fff",
		borderRadius: "50%",
	},
	"&::after": {
		content: '""',
		position: "absolute",
		top: -2,
		left: -2,
		right: -2,
		bottom: -2,
		border: "1px solid rgba(255, 255, 255, 0.3)",
		borderRadius: "50%",
	},
	"& svg": {
		width: 20,
		height: 20,
		color: "#333",
	},
}));

// 特製的主題切換按鈕樣式，繼承自 MenuItemButton
const ThemeToggleButton = styled(MenuItemButton)(({ theme, isDarkMode }) => ({
	"& svg": {
		transition: "transform 0.3s ease-in-out",
		transformOrigin: "center",
	},
	"&:hover svg": {
		transform: "rotate(180deg)",
	},
	// 深色模式時的特殊效果
	...(isDarkMode && {
		"&::before": {
			borderColor: "#ffd700",
		},
	}),
}));

// 選單項目文字
const MenuItemText = styled("span")({
	color: "#e6e6e6",
	fontSize: "16px",
	fontWeight: 700,
	textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
	opacity: 0,
	transform: "translateX(-10px)",
	transition: "opacity 0.3s, transform 0.3s",
	".show &": {
		opacity: 1,
		transform: "translateX(0)",
	},
});

// 選單項目
const MenuItem = styled("li")(({ theme, index, show }) => ({
	opacity: 0,
	marginBottom: "12px",
	transform: `translate3d(0, ${50 * (6 - index)}px, 0)`,
	transition:
		"transform 0.4s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.4s",
	transitionDelay: show ? `${index * 0.1}s` : `${(5 - index) * 0.1}s`,
	...(show && {
		opacity: 1,
		transform: "translate3d(0, 0, 0)",
	}),
}));

/**
 * 動畫導航選單組件
 * @param {Object} props
 * @param {Function} props.onMenuSelect - 選單項目點擊處理函數
 * @param {boolean} props.isDarkMode - 當前主題模式
 * @param {Function} props.onToggleTheme - 主題切換處理函數
 */
const AnimatedNavMenu = ({ onMenuSelect, isDarkMode, onToggleTheme }) => {
	const theme = useTheme();
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleMenuClick = (itemId) => {
		onMenuSelect(itemId);
		setIsOpen(false);
	};

	const menuItems = [
		{ text: "角色資訊", id: "character", icon: <Person /> },
		{ text: "背包道具", id: "inventory", icon: <Backpack /> },
		{ text: "技能列表", id: "skills", icon: <AutoAwesome /> },
		{ text: "地圖", id: "map", icon: <Map /> },
		{ text: "幫助", id: "help", icon: <Help /> },
		{
			text: isDarkMode ? "切換亮色主題" : "切換暗色主題",
			id: "theme-toggle",
			icon: isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />,
			isThemeToggle: true,
		},
	];

	return (
		<>
			<NavBackground show={isOpen} />

			<MenuButton
				className={`${isOpen ? "open" : ""} show`}
				onClick={toggleMenu}
			>
				<div className="button-text">{isOpen ? "CLOSE" : "MENU"}</div>
			</MenuButton>

			<NavMenu>
				<ul>
					{menuItems.map((item, index) => (
						<MenuItem key={item.id} index={index} show={isOpen}>
							<MenuItemContainer>
								{item.isThemeToggle ? (
									<ThemeToggleButton
										isOpen={isOpen}
										onClick={(e) => {
											e.preventDefault();
											onToggleTheme(e);
											setIsOpen(false);
										}}
										isDarkMode={isDarkMode}
										aria-label={item.text}
									>
										{item.icon}
									</ThemeToggleButton>
								) : (
									<MenuItemButton
										isOpen={isOpen}
										onClick={() => handleMenuClick(item.id)}
										aria-label={item.text}
									>
										{item.icon}
									</MenuItemButton>
								)}
								<MenuItemText>{item.text}</MenuItemText>
							</MenuItemContainer>
						</MenuItem>
					))}
				</ul>
			</NavMenu>
		</>
	);
};

export default AnimatedNavMenu;
