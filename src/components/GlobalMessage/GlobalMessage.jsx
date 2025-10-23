// src/components/GlobalMessage/GlobalMessage.jsx
import React, { useEffect } from "react";
import { message } from "antd";

/**
 * ✅ 全局 message 初始化容器
 * 挂载 messageApi 到 window/global，全局可用
 */
export let globalMessageApi = null;

const GlobalMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    globalMessageApi = messageApi;
    // 也可挂在 window，便于调试
    window.globalMessageApi = messageApi;
  }, [messageApi]);

  return <>{contextHolder}</>;
};

export default GlobalMessage;
