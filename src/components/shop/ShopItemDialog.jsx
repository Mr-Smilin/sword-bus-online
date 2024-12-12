import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
	TextField,
	IconButton,
	Divider,
} from "@mui/material";
import { Minus, Plus, Coins } from "lucide-react";
import { useGame } from "../../contexts/GameContext";

/**
 * 商品交易確認對話框
 * @param {Object} props
 * @param {boolean} props.open - 對話框開啟狀態
 * @param {Object} props.item - 商品資料
 * @param {string} props.mode - 交易模式 'buy' 或 'sell'
 * @param {Function} props.onConfirm - 確認交易回調
 * @param {Function} props.onCancel - 取消交易回調
 */
const ShopItemDialog = ({ open, item, mode, onConfirm, onCancel }) => {
	const { getCurrencyBalance } = useGame();
	const [quantity, setQuantity] = useState(1);

	// 取得最大可交易數量
	const getMaxQuantity = () => {
		if (!item) return 0;

		const price = mode === "buy" ? item.basePrice : item.buyPrice;
		if (mode === "buy") {
			// 購買模式：計算金錢能買多少
			const maxByGold = Math.floor(getCurrencyBalance("gold") / price);
			// 如果有庫存限制，取較小值
			return item.stock !== undefined
				? Math.min(maxByGold, item.stock)
				: maxByGold;
		} else {
			// 販賣模式：直接使用物品數量
			return item.quantity || 0;
		}
	};

	// 計算總價
	const getTotalPrice = () => {
		if (!item) return 0;
		const price = mode === "buy" ? item.basePrice : item.buyPrice;
		return price * quantity;
	};

	// 調整數量
	const adjustQuantity = (delta) => {
		const maxQty = getMaxQuantity();
		const newQty = Math.min(Math.max(1, quantity + delta), maxQty);
		setQuantity(newQty);
	};

	// 處理數量輸入
	const handleQuantityChange = (e) => {
		const value = parseInt(e.target.value);
		if (isNaN(value)) return;

		const maxQty = getMaxQuantity();
		setQuantity(Math.min(Math.max(1, value), maxQty));
	};

	// 重置狀態
	const handleClose = () => {
		setQuantity(1);
		onCancel();
	};

	if (!item) return null;

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
			<DialogTitle>{mode === "buy" ? "購買物品" : "販賣物品"}</DialogTitle>

			<DialogContent>
				<Box sx={{ py: 1 }}>
					{/* 物品資訊 */}
					<Typography variant="subtitle1" gutterBottom>
						{item.itemData?.name}
					</Typography>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						{item.itemData?.description}
					</Typography>

					<Divider sx={{ my: 2 }} />

					{/* 單價顯示 */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							mb: 2,
						}}
					>
						<Coins size={16} />
						<Typography>
							單價: {mode === "buy" ? item.basePrice : item.buyPrice}
						</Typography>
					</Box>

					{/* 數量選擇 */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							mb: 2,
						}}
					>
						<IconButton
							size="small"
							onClick={() => adjustQuantity(-1)}
							disabled={quantity <= 1}
						>
							<Minus size={16} />
						</IconButton>

						<TextField
							size="small"
							type="number"
							value={quantity}
							onChange={handleQuantityChange}
							inputProps={{
								min: 1,
								max: getMaxQuantity(),
								style: { textAlign: "center" },
							}}
							sx={{ width: 80 }}
						/>

						<IconButton
							size="small"
							onClick={() => adjustQuantity(1)}
							disabled={quantity >= getMaxQuantity()}
						>
							<Plus size={16} />
						</IconButton>

						<Typography variant="body2" color="text.secondary">
							/ {getMaxQuantity()}
						</Typography>
					</Box>

					{/* 總價顯示 */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}
					>
						<Coins size={16} />
						<Typography>總價: {getTotalPrice()}</Typography>
					</Box>
				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleClose}>取消</Button>
				<Button
					variant="contained"
					onClick={() => {
						onConfirm(quantity);
						handleClose();
					}}
					disabled={quantity <= 0 || quantity > getMaxQuantity()}
				>
					確認{mode === "buy" ? "購買" : "販賣"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ShopItemDialog;
