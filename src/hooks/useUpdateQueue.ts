import { useCallback, useRef, useEffect, useState } from "react";

/**
 * 更新操作介面
 */
interface UpdateOperation<T> {
	id: number;
	update: (data: T) => T;
	onComplete?: () => void;
}

/**
 * 通用更新佇列 Hook
 */
export const useUpdateQueue = <T>(
	data: T | undefined,
	onChange?: (newData: T) => void
) => {
	// Refs
	const operationCounter = useRef(0);
	const updateQueue = useRef<UpdateOperation<T>[]>([]);
	const lastData = useRef<T | undefined>(data);
	const onChangeRef = useRef(onChange);
	const processingRef = useRef(false);

	// 同步外部參考
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		if (data !== undefined) {
			lastData.current = data;
		}
	}, [data]);

	const processQueue = useCallback(() => {
		if (
			processingRef.current ||
			!updateQueue.current.length ||
			!lastData.current
		) {
			return;
		}

		processingRef.current = true;
		let currentData = lastData.current;
		let hasChanges = false;

		// 處理佇列中的所有更新
		while (updateQueue.current.length > 0) {
			const operation = updateQueue.current.shift();
			if (!operation) continue;

			try {
				const newData = operation.update(currentData);
				if (newData !== undefined && newData !== currentData) {
					currentData = newData;
					hasChanges = true;
					operation.onComplete?.();
				}
			} catch (error) {
				console.error("Update operation failed:", error);
			}
		}

		// 只在真正有變更時才通知
		if (hasChanges) {
			lastData.current = currentData;
			onChangeRef.current?.(currentData);
		}

		processingRef.current = false;

		// 如果還有更新，繼續處理
		if (updateQueue.current.length > 0) {
			queueMicrotask(processQueue);
		}
	}, []);

	const queueUpdate = useCallback(
		(update: (data: T) => T, onComplete?: () => void): number => {
			const operationId = ++operationCounter.current;
			updateQueue.current.push({ id: operationId, update, onComplete });

			if (!processingRef.current) {
				queueMicrotask(processQueue);
			}

			return operationId;
		},
		[processQueue]
	);

	const update = useCallback(
		(updater: T | ((prev: T) => T), onComplete?: () => void): number => {
			return queueUpdate((currentData) => {
				return typeof updater === "function"
					? (updater as (prev: T) => T)(currentData)
					: updater;
			}, onComplete);
		},
		[queueUpdate]
	);

	return {
		update,
		queueUpdate,
		isProcessing: processingRef.current,
	};
};
