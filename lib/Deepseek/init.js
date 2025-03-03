"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeText = void 0;
/* eslint-disable valid-jsdoc */
const axios_1 = __importDefault(require("axios"));
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL;
if (!DEEPSEEK_API_KEY || !DEEPSEEK_API_URL) {
    throw new Error("DeepSeek API key or URL is missing in environment variables");
}
/**
 * 调用 DeepSeek API 分析文本
 * @param text 需要分析的文本
 * @return DeepSeek API 的响应数据
 */
const analyzeText = async (text) => {
    try {
        const response = await axios_1.default.post(`${DEEPSEEK_API_URL}/analyze`, // DeepSeek 的 API 端点
        { text }, {
            headers: {
                Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("DeepSeek API 调用失败:", error);
        throw new Error("Failed to call DeepSeek API");
    }
};
exports.analyzeText = analyzeText;
//# sourceMappingURL=init.js.map