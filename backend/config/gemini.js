import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// 1. Load your specific keys from .env
const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
].filter(Boolean);

if (API_KEYS.length === 0) {
  throw new Error("No Gemini API keys found. Check your .env file.");
}

let currentKeyIndex = 0;

// Helper to get a fresh model instance with the active key
const getModel = (index) => {
  const genAI = new GoogleGenerativeAI(API_KEYS[index]);
  // Using 1.5-flash as it is the current standard. Change to "gemini-pro" if needed.
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// 2. The Proxy: Intercepts calls like model.generateContent()
const modelProxy = new Proxy(
  {},
  {
    get: (target, prop) => {
      return async (...args) => {
        // Try loop: Attempt up to the number of keys you have
        for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
          try {
            const activeModel = getModel(currentKeyIndex);

            // Check if the method exists (e.g. generateContent)
            if (typeof activeModel[prop] !== "function") {
              return activeModel[prop]; // Return property if it's not a function
            }

            // Execute the actual function (e.g. generateContent)
            return await activeModel[prop](...args);
          } catch (error) {
            // Check for Rate Limit (429) or Quota errors
            const isRateLimit =
              error.response?.status === 429 ||
              error.response?.status === 503 ||
              error.message?.includes("429") ||
              error.message?.toLowerCase().includes("quota") ||
              error.message?.toLowerCase().includes("unavailable");

            if (isRateLimit) {
              
              currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
            } else {
              throw error;
            }
          }
        }

        throw new Error(
          "All Gemini API keys are currently rate-limited. Please try again later."
        );
      };
    },
  }
);

export default modelProxy;
