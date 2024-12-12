import React from "react";
import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Grid,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import ShopItemCard from "./ShopItemCard";

/**
 * 物品類型中文對照
 */
const TYPE_LABELS = {
	weapon: "武器",
	armor: "防具",
	accessory: "配飾",
	consumable: "消耗品",
	material: "材料",
	quest: "任務物品",
	misc: "雜物",
};

/**
 * 商品列表組件
 * @param {Object} props
 * @param {Object} props.items - 按類型分類的商品列表
 * @param {string} props.mode - 'buy' 或 'sell' 模式
 * @param {Function} props.onItemClick - 商品點擊處理函數
 * @param {Function} props.onItemHover - 商品懸停處理函數
 */
const ShopItemList = ({ items = {}, mode, onItemClick, onItemHover }) => {
	return (
		<Box>
			{Object.entries(items).map(
				([type, typeItems]) =>
					// 只顯示有商品的類別
					typeItems.length > 0 && (
						<Accordion
							key={type}
							defaultExpanded
							sx={{
								"&:before": { display: "none" },
								bgcolor: "background.paper",
							}}
						>
							{/* 類別標題 */}
							<AccordionSummary
								expandIcon={<ChevronDown size={20} />}
								sx={{
									bgcolor: "background.default",
									borderBottom: 1,
									borderColor: "divider",
								}}
							>
								<Typography>
									{TYPE_LABELS[type] || type} ({typeItems.length})
								</Typography>
							</AccordionSummary>

							{/* 商品網格 */}
							<AccordionDetails sx={{ p: 2 }}>
								<Grid container spacing={2}>
									{typeItems.map((item) => (
										<Grid item xs={12} sm={6} md={4} key={item.itemId}>
											<ShopItemCard
												item={item}
												mode={mode}
												onClick={() => onItemClick?.(item)}
												onMouseEnter={(e) => onItemHover?.(item, true, e)}
												onMouseLeave={(e) => onItemHover?.(item, false, e)}
											/>
										</Grid>
									))}
								</Grid>
							</AccordionDetails>
						</Accordion>
					)
			)}

			{/* 無商品時顯示提示 */}
			{Object.keys(items).length === 0 && (
				<Box
					sx={{
						p: 3,
						textAlign: "center",
						color: "text.secondary",
					}}
				>
					<Typography>
						{mode === "buy" ? "目前沒有可購買的商品" : "背包中沒有可販賣的物品"}
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default ShopItemList;
