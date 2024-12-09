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
} from "@mui/material";
import { items } from "../../data/item";

const DeleteItemDialog = ({
	open,
	itemsToDelete, // [{slot, itemId, quantity}]
	onConfirm,
	onCancel,
}) => {
	// 當只刪除一個可堆疊物品時的數量輸入
	const [deleteQuantity, setDeleteQuantity] = useState("");

	// 計算要刪除的物品總數
	const totalItems = itemsToDelete.length;

	// 檢查是否只刪除一個可堆疊物品
	const singleStackableItem =
		totalItems === 1 &&
		itemsToDelete[0]?.quantity > 1 &&
		items.find((i) => i.id === itemsToDelete[0]?.itemId)?.stackable;

	const handleConfirm = () => {
		if (singleStackableItem) {
			const quantity = parseInt(deleteQuantity);
			if (
				isNaN(quantity) ||
				quantity <= 0 ||
				quantity > itemsToDelete[0].quantity
			) {
				return;
			}
			onConfirm(itemsToDelete, quantity);
		} else {
			onConfirm(itemsToDelete);
		}
		setDeleteQuantity("");
	};

	const handleCancel = () => {
		setDeleteQuantity("");
		onCancel();
	};

	return (
		<Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
			<DialogTitle>確認丟棄</DialogTitle>
			<DialogContent>
				<Box sx={{ mb: 2 }}>
					{singleStackableItem ? (
						<>
							<Typography gutterBottom>
								要丟棄多少{" "}
								{items.find((i) => i.id === itemsToDelete[0]?.itemId)?.name}？
							</Typography>
							<TextField
								type="number"
								value={deleteQuantity}
								onChange={(e) => setDeleteQuantity(e.target.value)}
								fullWidth
								label="數量"
								inputProps={{
									min: 1,
									max: itemsToDelete[0].quantity,
								}}
								sx={{ mt: 1 }}
							/>
						</>
					) : (
						<Typography>確定要丟棄選擇的 {totalItems} 個物品嗎？</Typography>
					)}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>取消</Button>
				<Button
					onClick={handleConfirm}
					color="error"
					disabled={
						singleStackableItem &&
						(deleteQuantity === "" ||
							parseInt(deleteQuantity) <= 0 ||
							parseInt(deleteQuantity) > itemsToDelete[0].quantity)
					}
				>
					丟棄
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteItemDialog;
