import OpenAI from 'openai';
import { notifyLoadingChange } from '../hooks/useLoading';

// You'll need to replace this with your actual API key
// Consider using environment variables for production
const API_KEY = '';
const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true // For React Native usage
});

interface FoodAnalysisResult {
  name: string;
  ingredients: string[];
  calories: number;
}

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysisResult> {
  console.log('analyzeFoodImage: Starting image analysis');
  try {
    // Notify listeners that loading has started
    console.log('analyzeFoodImage: Notifying loading started');
    notifyLoadingChange(true);
    
    console.log('analyzeFoodImage: Initializing OpenAI API call');
    
    // Log image size for debugging
    console.log(`analyzeFoodImage: Image size: ${base64Image.length} characters`);
    
    // Create a prompt that asks for specific food information
    const prompt = "Analyze this food image and provide the following information in JSON format:\n" +
      "1. Food name (string)\n" +
      "2. List of ingredients (array of strings)\n" +
      "3. Estimated total calories (number)\n\n" +
      "Format your response as valid JSON with fields: name, ingredients, calories.";

    console.log('analyzeFoodImage: Sending request to OpenAI API');
    // Send to OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });
    
    console.log('analyzeFoodImage: Received response from OpenAI API');
    
    const text = response.choices[0]?.message?.content || '';
    console.log('analyzeFoodImage: Raw response text:', text);
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('analyzeFoodImage: Failed to extract JSON from response');
      throw new Error("Could not extract valid JSON from the API response");
    }
    
    console.log('analyzeFoodImage: Extracted JSON:', jsonMatch[0]);
    
    const jsonData = JSON.parse(jsonMatch[0]);
    console.log('analyzeFoodImage: Parsed JSON data:', JSON.stringify(jsonData, null, 2));
    
    return {
      name: jsonData.name,
      ingredients: jsonData.ingredients,
      calories: Number(jsonData.calories)
    };
  } catch (error) {
    console.error("Error analyzing food image:", error);
    console.error("Error details:", JSON.stringify(error));
    throw error;
  } finally {
    // Notify listeners that loading has ended (regardless of success or failure)
    console.log('analyzeFoodImage: Analysis completed, notifying loading ended');
    notifyLoadingChange(false);
  }
}

// Function to convert image uri to base64
export async function uriToBase64(uri: string): Promise<string> {
  console.log('uriToBase64: Converting image URI to base64', uri);
  try {
    // Fetch the image
    console.log('uriToBase64: Fetching image');
    const response = await fetch(uri);
    console.log('uriToBase64: Image fetched, getting blob');
    const blob = await response.blob();
    console.log('uriToBase64: Got blob, size:', blob.size);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('uriToBase64: FileReader loaded');
        if (typeof reader.result === 'string') {
          // Remove the data:image/jpeg;base64, prefix
          const base64 = reader.result.split(',')[1];
          console.log('uriToBase64: Base64 conversion successful');
          resolve(base64);
        } else {
          console.error('uriToBase64: FileReader result is not a string');
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = (error) => {
        console.error('uriToBase64: FileReader error:', error);
        reject(error);
      }
      console.log('uriToBase64: Starting FileReader');
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URI to base64:", error);
    console.error("Error details:", JSON.stringify(error));
    throw error;
  }
}