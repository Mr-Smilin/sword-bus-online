import { keyframes } from "@emotion/react";
import { useSpring, animated } from "react-spring";
import { useState, useEffect, useMemo } from "react";
import { Paper } from "@mui/material";

/**
 * 預設動畫效果集合
 */
export const animations = {
	// 淡入效果
	fadeIn: keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `,

	// 滑入效果
	slideIn: keyframes`
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  `,

	// 彈跳效果
	bounce: keyframes`
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  `,

	// 旋轉效果
	rotate: keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `,

	// 脈衝效果
	pulse: keyframes`
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  `,
};

/**
 * 使用動畫的自定義Hook
 * @param {string} type - 動畫類型
 * @param {Object} options - 動畫選項
 * @returns {Object} 動畫樣式和控制函數
 */
export const useAnimation = (type = "fadeIn", options = {}) => {
	// 動畫狀態
	const [isAnimating, setIsAnimating] = useState(false);

	// 根據類型獲取動畫配置
	const getAnimationConfig = () => {
		switch (type) {
			case "fadeIn":
				return {
					from: { opacity: 0 },
					to: { opacity: 1 },
				};
			case "slideIn":
				return {
					from: { transform: "translateY(20px)", opacity: 0 },
					to: { transform: "translateY(0)", opacity: 1 },
				};
			case "bounce":
				return {
					from: { transform: "translateY(0)" },
					to: async (next) => {
						await next({ transform: "translateY(-20px)" });
						await next({ transform: "translateY(0)" });
					},
				};
			default:
				return {
					from: { opacity: 0 },
					to: { opacity: 1 },
				};
		}
	};

	// 使用 react-spring 創建動畫
	const springProps = useSpring({
		...getAnimationConfig(),
		...options,
		onRest: () => setIsAnimating(false),
	});

	// 開始動畫
	const startAnimation = () => {
		setIsAnimating(true);
	};

	// 重置動畫
	const resetAnimation = () => {
		setIsAnimating(false);
	};

	return {
		style: springProps,
		isAnimating,
		startAnimation,
		resetAnimation,
		AnimatedComponent: animated.div,
	};
};

/**
 * 面板容器動畫 Hook
 * @param {Object} options - 動畫選項
 * @param {boolean} options.isVisible - 是否可見
 * @param {any} options.deps - 觸發動畫的依賴項
 * @param {number} options.duration - 動畫持續時間(毫秒)
 * @returns {Object} 動畫相關屬性
 */
export const usePanelContainerAnimation = ({
	isVisible = true,
	deps = null,
	duration = 1000, // 預設動畫時間
} = {}) => {
	// 追蹤是否需要播放動畫
	const [shouldAnimate, setShouldAnimate] = useState(deps === null);

	// 當依賴項改變時，觸發動畫
	useEffect(() => {
		if (deps !== null) {
			setShouldAnimate(true);
		}
	}, [deps]);

	// 計算動畫配置
	const animationConfig = useMemo(
		() => ({
			// tension 和 friction 的值會影響動畫速度和彈性
			// 較高的 tension 會使動畫更快
			// 較高的 friction 會減少彈性
			tension: Math.round(170000 / duration), // 根據持續時間調整張力
			friction: Math.round(26000 / duration), // 根據持續時間調整摩擦力
		}),
		[duration]
	);

	const springProps = useSpring({
		from: shouldAnimate
			? {
					clipPath: "circle(0% at center)",
					opacity: 0,
			  }
			: {
					clipPath: "inset(0 0 0 0)",
					opacity: 1,
			  },
		to: async (next) => {
			if (shouldAnimate && isVisible) {
				// 第一階段：點變成小線
				await next({
					clipPath: "inset(49.5% 40% 49.5% 40%)", // 先變成一個小線段
					opacity: 0.0,
					immediate: true,
				});

				// 第二階段：小線變成長線
				await next({
					clipPath: "inset(49.5% 0% 49.5% 0%)", // 水平展開成完整的線
					opacity: 1.0,
					immediate: false,
					config: animationConfig,
				});

				// 第三階段：線變成完整區塊
				await next({
					clipPath: "inset(0 0 0 0)", // 垂直展開
					opacity: 1,
					config: animationConfig,
				});
				// 重置動畫狀態
				setShouldAnimate(false);
			}
		},
		config: animationConfig,
	});

	/**
	 * 創建記憶化的動畫容器組件
	 */
	const AnimatedContainer = useMemo(() => {
		return animated(({ children, ...props }) => (
			<Paper
				elevation={0}
				{...props}
				style={{
					...props.style,
					position: "relative",
					overflow: "hidden",
				}}
			>
				{children}
			</Paper>
		));
	}, []); // 空依賴陣列確保組件只創建一次

	return {
		style: springProps,
		AnimatedContainer,
	};
};

/**
 * 數值變化動畫Hook
 * @param {number} value - 目標數值
 * @param {number} duration - 動畫持續時間（毫秒）
 * @returns {number} 當前動畫數值
 */
export const useNumberAnimation = (value, duration = 1000) => {
	const [animatedValue, setAnimatedValue] = useState(0);

	useEffect(() => {
		const startTime = Date.now();
		const startValue = animatedValue;

		const animate = () => {
			const currentTime = Date.now();
			const elapsed = currentTime - startTime;

			if (elapsed < duration) {
				const nextValue =
					startValue + (value - startValue) * (elapsed / duration);
				setAnimatedValue(nextValue);
				requestAnimationFrame(animate);
			} else {
				setAnimatedValue(value);
			}
		};

		requestAnimationFrame(animate);
	}, [value, duration]);

	return animatedValue;
};

/**
 * 創建關鍵幀動畫樣式
 * @param {string} name - 動畫名稱
 * @param {Object} keyframes - 關鍵幀配置
 * @returns {string} 動畫CSS字符串
 */
export const createKeyframeAnimation = (name, keyframes) => `
  @keyframes ${name} {
    ${Object.entries(keyframes)
			.map(([key, value]) => `${key} { ${value} }`)
			.join("\n")}
  }
`;
