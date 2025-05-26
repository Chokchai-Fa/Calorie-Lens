// filepath: /Users/chokchai/dev/hiwtonduek/client/services/foodLogService.ts
import { MealType, FoodItem } from '../utils/meal';

// API URL - set to the Docker container service or your local development server
const API_URL = 'http://localhost:8000/api';

export interface FoodLogApiItem {
  id: number;
  timestamp: string;
  food: {
    id: number;
    name: string;
    total_calories: number;
    portion_in_grams: number | null;
    image_uri: string | null;
    ingredients: Array<{
      id: number;
      name: string;
      calories_per_100g: number;
    }>;
  };
}

export interface DailySummary {
  date: string;
  total_calories: number;
  calorie_target: number | null;
  foods_consumed: Array<{
    name: string;
    calories: number;
    timestamp: string;
  }>;
  ingredients_consumed: Record<string, number>;
}

/**
 * Fetch food logs for the user
 * @param limit Maximum number of items to fetch
 * @param skip Number of items to skip (for pagination)
 * @returns Promise with food logs data
 */
export async function fetchFoodLogs(limit: number = 20, skip: number = 0): Promise<FoodLogApiItem[]> {
  try {
    console.log(`Fetching food logs from ${API_URL}/food-logs?limit=${limit}&skip=${skip}`);
    const response = await fetch(`${API_URL}/food-logs?limit=${limit}&skip=${skip}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock_token' // Replace with actual token in production
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching food logs: ${response.status}`);
    }

    const data = await response.json();
    console.log('Food logs fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching food logs:', error);
    return [];
  }
}

/**
 * Get daily summary of food consumption
 * @param date Optional specific date to fetch (defaults to today)
 * @returns Promise with daily summary data
 */
export async function fetchDailySummary(date?: string): Promise<DailySummary | null> {
  try {
    const dateParam = date ? `?date_param=${date}` : '';
    console.log(`Fetching daily summary from ${API_URL}/food-logs/summary/daily${dateParam}`);
    const response = await fetch(`${API_URL}/food-logs/summary/daily${dateParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock_token' // Replace with actual token in production
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching daily summary: ${response.status}`);
    }

    const data = await response.json();
    console.log('Daily summary fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    return null;
  }
}

/**
 * Map API food log items to the app's FoodItem format
 * @param apiItems Food log items from the API
 * @returns Formatted food items for the app
 */
export function mapApiItemsToFoodItems(apiItems: FoodLogApiItem[]): Array<{
  name: string;
  calories: number;
  timestamp: number;
  imageUri?: string;
  ingredients?: string[];
}> {
  return apiItems.map(item => ({
    name: item.food.name,
    calories: item.food.total_calories,
    timestamp: new Date(item.timestamp).getTime(),
    imageUri: item.food.image_uri || undefined,
    ingredients: item.food.ingredients.map(ing => ing.name)
  }));
}