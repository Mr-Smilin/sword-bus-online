/**
 * @file components/layout/AppHeader.jsx
 */
import React from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
	Box,
	Button,
} from "@mui/material";
import { Compass, Beaker } from "lucide-react"; // Flask 作為測試按鈕圖標
import ThemeToggle from "../ThemeToggle";
import { useLayout } from "../../contexts";
import { styled } from "@mui/material/styles";

// 自定義導航按鈕組件
const NavButton = styled(Button)(({ theme, active }) => ({
	position: "relative",
	color: theme.palette.text.primary,
	transition: "all 0.3s ease-in-out",
	opacity: active ? 1 : 0.7,
	"&:hover": {
		opacity: 0.9,
	},
	// 底部指示條
	"&::after": {
		content: '""',
		position: "absolute",
		bottom: -2,
		left: active ? 10 : "50%",
		right: active ? 10 : "50%",
		height: 2,
		background: theme.palette.primary.main,
		transition: "all 0.3s ease-in-out",
		borderRadius: 1,
	},
	"&:hover::after": {
		left: active ? 10 : 40,
		right: active ? 10 : 40,
	},
}));

// 導航按鈕配置
const NAV_BUTTONS = [
	{
		id: "exploration",
		label: "探索",
		icon: <Compass size={20} />,
	},
	{
		id: "test",
		label: "測試",
		icon: <Beaker size={20} />,
	},
];

const AppHeader = ({ isDarkMode, onToggleTheme }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const {
		isMenuOpen,
		mainViewPanel,
		layoutActions: { switchMainViewPanel },
	} = useLayout();

	return (
		<AppBar
			position="fixed"
			elevation={isMenuOpen ? 0 : 4}
			sx={{
				width: "100%",
				transition: theme.transitions.create(
					["width", "margin", "box-shadow", "background-color"],
					{
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.standard,
					}
				),
				bgcolor: isMenuOpen
					? "rgba(0, 0, 0, 0.5)"
					: theme.palette.background.default,
				backdropFilter: isMenuOpen ? "blur(10px)" : "none",
			}}
		>
			<Toolbar
				sx={{
					justifyContent: "space-between",
					minHeight: { xs: 56, sm: 64 },
					px: { xs: 2, sm: 3 },
				}}
			>
				<Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{
							opacity: isMenuOpen ? 0.7 : 1,
							transition: theme.transitions.create("opacity"),
						}}
					>
						Sword Art Offline
					</Typography>

					{/* 導航按鈕組 */}
					<Box
						sx={{
							display: { xs: "none", sm: "flex" },
							gap: 1,
							ml: 2,
							height: "100%",
						}}
					>
						{NAV_BUTTONS.map((button) => (
							<NavButton
								key={button.id}
								startIcon={button.icon}
								onClick={() => switchMainViewPanel(button.id)}
								active={mainViewPanel === button.id ? 1 : 0}
							>
								{button.label}
							</NavButton>
						))}
					</Box>
				</Box>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					{!isMobile && (
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{
								opacity: isMenuOpen ? 0.7 : 1,
								transition: theme.transitions.create("opacity"),
							}}
						>
							歡迎回來，冒險者
						</Typography>
					)}

					<ThemeToggle
						isDarkMode={isDarkMode}
						onToggle={onToggleTheme}
						sx={{
							opacity: isMenuOpen ? 0.7 : 1,
							transition: theme.transitions.create("opacity"),
						}}
					/>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default AppHeader;
