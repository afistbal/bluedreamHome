// src/utils/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.8.254:5022", // 可改成你的后端主域
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 通用请求方法
export async function callApi(url, method = "GET", params = {}) {
  try {
    let response;

    if (method.toUpperCase() === "GET") {
      response = await apiClient.get(url, { params });
    } else {
      response = await apiClient.post(url, params);
    }

    // 返回后端数据主体
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Request failed",
    };
  }
}
