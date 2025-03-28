/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { config } from "dotenv";

// Load environment variables from the .env file
config({ path: ".env" });

// Retrieve DeepSeek configuration from Firebase functions config or environment variables
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// eslint-disable-next-line require-jsdoc
export async function analyzeText(text: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DeepSeek API key is not configured");
  }

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: text },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    // Enhance the error with additional context
    const apiError = new Error(`DeepSeek API Error: ${error.message}`);
    (apiError as any).response = error.response;
    throw apiError;
  }
}
