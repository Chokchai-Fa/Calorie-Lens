import { useDispatch } from 'react-redux';
import { startFoodAnalysis, setFoodDetails, setAnalysisError } from '../store/imagesSlice';
import { analyzeFoodImage, uriToBase64 } from '../services/geminiService';

export interface FoodAnalysisResult {
  name: string;
  ingredients: string[];
  calories: number;
  caloriesPerIngredient?: Record<string, number>;
  portionInGrams?: number;
}

// Hook for handling image analysis
export function useImageAnalysis() {
  const dispatch = useDispatch();
  
  const analyzeImage = async (imageUri: string): Promise<FoodAnalysisResult | null> => {
    if (!imageUri) return null;
    
    try {
      dispatch(startFoodAnalysis());
      
      // Convert image URI to base64
      console.log('useImageAnalysis: Converting image to base64');
      const base64Image = await uriToBase64(imageUri);
      
      // Call Gemini API to analyze the image
      console.log('useImageAnalysis: Calling Gemini API');
      const result = await analyzeFoodImage(base64Image);
      console.log('useImageAnalysis: Gemini API response:', result);
      
      // Store food details in Redux
      const foodDetails = {
        name: result.name,
        ingredients: result.ingredients,
        calories: result.calories,
        caloriesPerIngredient: result.caloriesPerIngredient,
        portionInGrams: result.portionInGrams,
        imageUri: imageUri
      };
      
      dispatch(setFoodDetails(foodDetails));
      return result;
      
    } catch (error) {
      console.error('useImageAnalysis: Error analyzing image:', error);
      dispatch(setAnalysisError('Failed to analyze food image'));
      return null;
    }
  };
  
  return { analyzeImage };
}