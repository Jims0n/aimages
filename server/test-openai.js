import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// Log API key (but masking most of it for security)
const apiKey = process.env.OPENAI_API_KEY;
if (apiKey) {
  const maskedKey = apiKey.substring(0, 3) + '*'.repeat(apiKey.length - 6) + apiKey.substring(apiKey.length - 3);
  console.log("API Key present:", maskedKey);
} else {
  console.error("No API key found in environment variables!");
  process.exit(1);
}

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test a simple completion - this works with most OpenAI accounts
async function testCompletion() {
  try {
    console.log("Testing chat completion...");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello, how are you?" }],
    });
    console.log("Chat completion successful!");
    return true;
  } catch (error) {
    console.error("Chat completion error:", error);
    return false;
  }
}

// Test image generation
async function testImageGeneration() {
  try {
    console.log("Testing image generation...");
    
    // First try DALL-E 2
    console.log("Testing with DALL-E 2...");
    const responseDALLE2 = await openai.images.generate({
      model: "dall-e-2",
      prompt: "A sunset over mountains",
      n: 1,
      size: "256x256", // smallest size to save credits
    });
    console.log("DALL-E 2 generation successful!");
    console.log(responseDALLE2);
    return true;
  } catch (error) {
    console.error("Image generation error:", error);
    
    // Log additional details about the error
    if (error.status) {
      console.error(`Status: ${error.status}`);
    }
    if (error.error) {
      console.error(`Error Type: ${error.error.type}`);
      console.error(`Error Message: ${error.error.message}`);
    }
    
    return false;
  }
}

// Run tests
async function runTests() {
  console.log("Starting OpenAI API tests...");
  
  const completionResult = await testCompletion();
  if (completionResult) {
    console.log("✅ Chat completion API works correctly");
  } else {
    console.log("❌ Chat completion API failed - check your API key and account status");
  }
  
  const imageResult = await testImageGeneration();
  if (imageResult) {
    console.log("✅ Image generation API works correctly");
  } else {
    console.log("❌ Image generation API failed - check your API key and account permissions");
    console.log("Note: Image generation might require a paid account with sufficient credits");
  }
}

runTests(); 