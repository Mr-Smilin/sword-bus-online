import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Typography,
	Box,
} from "@mui/material";

const SplitStackDialog = ({
	open,
	itemData, // 物品資料
	quantity, // 當前堆疊數量
	onConfirm,
	onCancel,
}) => {
	const [splitAmount, setSplitAmount] = useState(quantity);

	// 當對話框打開時，設置預設值
	useEffect(() => {
		if (open) {
			setSplitAmount(quantity);
		}
	}, [open, quantity]);

	const handleConfirm = () => {
		const amount = Math.min(
			Math.max(1, Math.floor(Number(splitAmount))),
			quantity
		);
		onConfirm(amount);
	};

	if (!itemData) return null;

	return (
		<Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
			<DialogTitle>分割堆疊</DialogTitle>
			<DialogContent>
				<Box sx={{ mb: 2 }}>
					<Typography gutterBottom>
						{itemData.name} (最大: {quantity})
					</Typography>
					<TextField
						type="number"
						value={splitAmount}
						onChange={(e) => setSplitAmount(Math.floor(Number(e.target.value)))}
						fullWidth
						label="數量"
						slotProps={{
							min: 1,
							max: quantity,
							step: 1,
							inputMode: "numeric", // 手機版只顯示數字鍵盤
						}}
						sx={{ mt: 1 }}
						// 自動選中數字便於直接輸入
						autoFocus
						onFocus={(e) => e.target.select()}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel}>取消</Button>
				<Button
					onClick={handleConfirm}
					variant="contained"
					disabled={!splitAmount || splitAmount < 1 || splitAmount > quantity}
				>
					確認
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SplitStackDialog;
