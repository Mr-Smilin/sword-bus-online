import { createRoot } from 'react-dom/client';
import Toast from '../components/common/Toast';

let toastRoot = null;

/**
 * 顯示提示訊息
 * @param {object} options 設定選項
 * @param {string} options.message 提示訊息
 * @param {string} options.severity 嚴重程度 - success | info | warning | error
 * @param {number} options.duration 顯示時間(毫秒)
 */
export const showToast = ({ message, severity = 'info', duration = 3000 }) => {
  if (!toastRoot) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    toastRoot = createRoot(container);
  }

  toastRoot.render(
    <Toast
      open={true}
      message={message}
      severity={severity}
      onClose={() => {
        toastRoot.render(<Toast open={false} />);
      }}
    />
  );
};

// 預設匯出方便使用的方法
export const toast = {
  success: (message) => showToast({ message, severity: 'success' }),
  info: (message) => showToast({ message, severity: 'info' }),
  warning: (message) => showToast({ message, severity: 'warning' }),
  error: (message) => showToast({ message, severity: 'error' }),
};