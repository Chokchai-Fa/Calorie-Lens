import { format } from "date-fns";

// Define meal type
export type MealType = "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Late Night";

// Define interfaces for our data structures
export interface FoodItem {
  name: string;
  calories: number;
}

export interface MealData {
  time: string;
  meal: MealType;
  totalCalories: number;
  items: FoodItem[];
}

/**
 * Helper function to categorize food items by meal time
 * @param timestamp Timestamp of the meal
 * @returns MealType based on hour of day
 */
export const categorizeMealByTime = (timestamp: number): MealType => {
  const hour = new Date(timestamp).getHours();
  
  if (hour >= 5 && hour < 11) return "Breakfast";
  if (hour >= 11 && hour < 15) return "Lunch";
  if (hour >= 15 && hour < 18) return "Snack";
  if (hour >= 18 && hour < 22) return "Dinner";
  return "Late Night";
};

/**
 * Organizes tracked food items into meal categories
 * @param trackedFoodItems Array of tracked food items
 * @returns Record of meal types with corresponding meal data
 */
export const organizeMealsByType = (trackedFoodItems: any[]): Record<MealType, MealData> => {
  return trackedFoodItems.reduce((meals: Record<MealType, MealData>, item: any) => {
    const mealType = categorizeMealByTime(item.timestamp);
    if (!meals[mealType]) {
      meals[mealType] = {
        time: format(new Date(item.timestamp), 'hh:mm a'),
        meal: mealType,
        totalCalories: 0,
        items: []
      };
    }
    
    // Add food item to appropriate meal category
    meals[mealType].items.push({
      name: item.foodDetails.name,
      calories: item.foodDetails.calories
    });
    
    // Update total calories for this meal
    meals[mealType].totalCalories += item.foodDetails.calories;
    
    return meals;
  }, {} as Record<MealType, MealData>);
};

/**
 * Sorts meal data by meal order (Breakfast, Lunch, Snack, Dinner, Late Night)
 * @param foodLogData Array of meal data
 * @returns Sorted array of meal data
 */
export const sortMealsByOrder = (foodLogData: MealData[]): MealData[] => {
  return foodLogData.sort((a: MealData, b: MealData) => {
    // Sort by meal order
    const mealOrder: Record<MealType, number> = { 
      "Breakfast": 0, 
      "Lunch": 1, 
      "Snack": 2, 
      "Dinner": 3, 
      "Late Night": 4 
    };
    return mealOrder[a.meal] - mealOrder[b.meal];
  });
};

/**
 * Get default food log data when no tracked items are available
 * @returns Default meal data array
 */
export const getDefaultFoodLogData = (): MealData[] => {
  return [
    {
      time: "08:30 AM",
      meal: "Breakfast",
      totalCalories: 400,
      items: [
        { name: "Oatmeal with Banana", calories: 260 },
        { name: "Greek Yogurt", calories: 140 },
      ],
    },
    {
      time: "12:30 PM",
      meal: "Lunch",
      totalCalories: 470,
      items: [
        { name: "Chicken Salad", calories: 350 },
        { name: "Whole Grain Bread", calories: 120 },
      ],
    },
    {
      time: "04:00 PM",
      meal: "Snack",
      totalCalories: 255,
      items: [
        { name: "Apple", calories: 95 },
        { name: "Almonds", calories: 160 },
      ],
    },
    {
      time: "07:30 PM",
      meal: "Dinner",
      totalCalories: 325,
      items: [{ name: "Grilled Salmon", calories: 325 }],
    },
  ];
};