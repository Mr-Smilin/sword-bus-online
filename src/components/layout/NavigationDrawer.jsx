/**
 * @file NavigationDrawer.jsx
 * @description 側邊導航欄組件
 */
import React from "react";
import {
	Box,
	List,
	ListItem,
	ListItemIcon,
	Toolbar,
	IconButton,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import PushPinIcon from "@mui/icons-material/PushPin";
import {
	TransitionDrawer,
	CollapsibleText,
	PinButton,
} from "./StyledComponents";
import { menuItems, getMenuItemStyle } from "./menuConfig";
import { useLayout } from "../../contexts";

/**
 * 抽屜內容組件
 */
const DrawerContent = ({ onMenuClick, selectedPanel }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const {
		isDrawerExpanded,
		isPinned,
		drawerConfig: { collapsedWidth },
		drawerActions: { handleDrawerToggle, handlePinClick },
	} = useLayout();

	return (
		<Box sx={{ height: "100%", position: "relative" }}>
			<Toolbar>
				{isMobile && (
					<IconButton onClick={handleDrawerToggle} sx={{ ml: "auto" }}>
						<CloseIcon />
					</IconButton>
				)}
			</Toolbar>
			<List>
				{menuItems.map((item) => (
					<ListItem
						button
						key={item.id}
						onClick={() => onMenuClick(item)}
						sx={getMenuItemStyle(item.id, selectedPanel === item.id, theme)}
					>
						<ListItemIcon sx={{ minWidth: collapsedWidth - 16 }}>
							{item.icon}
						</ListItemIcon>
						<CollapsibleText
							primary={item.text}
							isexpanded={String(isDrawerExpanded)}
						/>
					</ListItem>
				))}
			</List>
			{!isMobile && (
				<PinButton
					onClick={handlePinClick}
					size="small"
					sx={{ transform: isPinned ? "rotate(-45deg)" : "rotate(0deg)" }}
				>
					<PushPinIcon
						fontSize="small"
						sx={{ color: isPinned ? "primary.main" : "text.secondary" }}
					/>
				</PinButton>
			)}
		</Box>
	);
};

/**
 * 主要導航抽屜組件
 */
const NavigationDrawer = ({ selectedPanel, onMenuClick }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const {
		mobileOpen,
		currentDrawerWidth,
		drawerConfig: { expandedWidth },
		drawerActions: { handleDrawerToggle, handleDrawerExpand },
	} = useLayout();

	return (
		<Box
			component="nav"
			sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}
		>
			{isMobile ? (
				<TransitionDrawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{ "& .MuiDrawer-paper": { width: expandedWidth } }}
				>
					<DrawerContent
						onMenuClick={onMenuClick}
						selectedPanel={selectedPanel}
					/>
				</TransitionDrawer>
			) : (
				<TransitionDrawer
					variant="permanent"
					width={currentDrawerWidth}
					onMouseEnter={() => handleDrawerExpand(true)}
					onMouseLeave={() => handleDrawerExpand(false)}
					open={true}
				>
					<DrawerContent
						onMenuClick={onMenuClick}
						selectedPanel={selectedPanel}
					/>
				</TransitionDrawer>
			)}
		</Box>
	);
};

export default NavigationDrawer;
