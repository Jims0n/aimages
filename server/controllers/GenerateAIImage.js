import * as dotenv from "dotenv";

import OpenAI from "openai";


dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  export default openai;


// Controller to generate Image
export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim() === "") {
          return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log("Received prompt:", prompt);
        
        
        
        const response = await openai.images.generate({
            model: "dall-e-3", 
            prompt: prompt,
             n: 1,
            size: "1024x1024", 
});
        
        // Extract the image URL from the response
        const imageUrl = response.data[0]?.url;
        
        if (!imageUrl) {
            return res.status(500).json({ error: "No image URL in the response" });
        }
        
        return res.status(200).json({ photo: imageUrl });
    } catch (error) {
        console.error("Error generating image:", error);
        
        return res.status(500).json({
            error: "Failed to generate image",
            message: "There was an error processing your request",
            details: error.message || "Unknown error occurred"
        });
    }
}