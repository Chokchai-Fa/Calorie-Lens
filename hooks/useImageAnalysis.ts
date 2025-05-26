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
      
      // Convert image to base64
      console.log('useImageAnalysis: Converting image to base64');
      const base64Image = await uriToBase64(imageUri);
      
      // Use the new base64 endpoint
      console.log('useImageAnalysis: Sending base64 image to server');
      const serverResponse = await fetch('http://localhost:8000/api/foods/analyze-base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock_token'
        },
        body: JSON.stringify({
          image_data: base64Image,
          user_id: 1 // Use actual user ID if available
        })
      });
      
      if (!serverResponse.ok) {
        throw new Error(`Server error: ${serverResponse.status}`);
      }
      
      // Parse the server response
      const result = await serverResponse.json();
      console.log('useImageAnalysis: Server response:', result);
      
      // Map server response to our expected structure
      const foodDetails = {
        name: result.name,
        ingredients: result.ingredients.map((ing: any) => ing.name),
        calories: result.total_calories,
        // Convert ingredient objects to calories map if needed
        caloriesPerIngredient: result.ingredients.reduce((acc: any, ing: any) => {
          acc[ing.name] = ing.calories_per_100g;
          return acc;
        }, {}),
        portionInGrams: result.portion_in_grams,
        imageUri: result.image_uri // Use server-stored image path
      };
      
      dispatch(setFoodDetails(foodDetails));
      
      return {
        name: foodDetails.name,
        ingredients: foodDetails.ingredients,
        calories: foodDetails.calories,
        caloriesPerIngredient: foodDetails.caloriesPerIngredient,
        portionInGrams: foodDetails.portionInGrams
      };
      
    } catch (error) {
      console.error('useImageAnalysis: Error analyzing image:', error);
      
      // Fallback to regular file upload if base64 endpoint fails
      try {
        console.log('useImageAnalysis: Falling back to file upload endpoint');
        
        // Get the image file
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        // Create form data for the image upload
        const formData = new FormData();
        const filename = 'food_image.jpg';
        formData.append('file', blob, filename);
        
        // Add user_id as a form field (required by the server as Form parameter)
        formData.append('user_id', '1'); // Use actual user ID if available
        
        // Upload to server using the original endpoint
        const fallbackResponse = await fetch('http://localhost:8000/api/foods/upload', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock_token'
          },
          body: formData
        });
        
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback server error: ${fallbackResponse.status}`);
        }
        
        // Parse the server response
        const result = await fallbackResponse.json();
        console.log('useImageAnalysis: Fallback server response:', result);
        
        // Map server response to our expected structure
        const foodDetails = {
          name: result.name,
          ingredients: result.ingredients.map((ing: any) => ing.name),
          calories: result.total_calories,
          caloriesPerIngredient: result.ingredients.reduce((acc: any, ing: any) => {
            acc[ing.name] = ing.calories_per_100g;
            return acc;
          }, {}),
          portionInGrams: result.portion_in_grams,
          imageUri: result.image_uri // Use server-stored image path
        };
        
        dispatch(setFoodDetails(foodDetails));
        
        return {
          name: foodDetails.name,
          ingredients: foodDetails.ingredients,
          calories: foodDetails.calories,
          caloriesPerIngredient: foodDetails.caloriesPerIngredient,
          portionInGrams: foodDetails.portionInGrams
        };
      } catch (fallbackError) {
        console.error('useImageAnalysis: Fallback analysis also failed:', fallbackError);
        dispatch(setAnalysisError('Failed to analyze food image'));
        return null;
      }
    }
  };
  
  return { analyzeImage };
}