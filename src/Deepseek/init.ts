/* eslint-disable valid-jsdoc */
import axios from "axios";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL;

if (!DEEPSEEK_API_KEY || !DEEPSEEK_API_URL) {
  throw new Error(
    "DeepSeek API key or URL is missing in environment variables",
  );
}

/**
 * 调用 DeepSeek API 分析文本
 * @param text 需要分析的文本
 * @return DeepSeek API 的响应数据
 */
export const analyzeText = async (text: string) => {
  try {
    const response = await axios.post(
      `${DEEPSEEK_API_URL}/analyze`, // DeepSeek 的 API 端点
      { text },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("DeepSeek API 调用失败:", error);
    throw new Error("Failed to call DeepSeek API");
  }
};
