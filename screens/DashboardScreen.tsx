import { useState, useEffect } from "react"
import { View, Text, ScrollView, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ProgressCircle from "components/ProgressCircle";
import FoodLogItem from "components/FoodLogItem"
import Card from "components/Card"
import { useSelector } from "react-redux"
import { 
  MealType, 
  MealData,
  FoodItem,
  categorizeMealByTime, 
  organizeMealsByType, 
  sortMealsByOrder, 
  getDefaultFoodLogData 
} from "../utils/meal";
import { fetchFoodLogs, fetchDailySummary, mapApiItemsToFoodItems, DailySummary } from "../services/foodLogService";

const DashboardScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [remoteFoodItems, setRemoteFoodItems] = useState<FoodItem[]>([]);
  const [useDefaultData, setUseDefaultData] = useState(false);
  
  // Get tracked food images from Redux store (for locally tracked items)
  const { images } = useSelector((state: any) => state.images);
  
  // Get only tracked food items
  const localTrackedFoodItems = images.filter((image: any) => 
    image.isTracked === true && image.foodDetails
  ).map((image: any) => ({
    name: image.foodDetails.name,
    calories: image.foodDetails.calories,
    timestamp: image.timestamp,
    ingredients: image.foodDetails.ingredients,
    imageUri: image.uri
  }));
  
  // Function to load dashboard data
  const loadDashboardData = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);
    setUseDefaultData(false);
    
    try {
      console.log('Loading dashboard data from server...');
      
      // Fetch daily summary first
      const summary = await fetchDailySummary();
      if (summary) {
        setDailySummary(summary);
        console.log('Daily summary loaded successfully');
      }
      
      // Then fetch detailed food logs
      const foodLogs = await fetchFoodLogs(20, 0);
      if (foodLogs && foodLogs.length > 0) {
        // Map API items to our app's format
        const mappedItems = mapApiItemsToFoodItems(foodLogs);
        setRemoteFoodItems(mappedItems);
        console.log(`Loaded ${mappedItems.length} food items from server`);
      } else {
        console.log('No food logs returned from server');
        setRemoteFoodItems([]);
      }
    } catch (err: any) {
      console.error("Dashboard data loading error:", err);
      setError(`Failed to load data: ${err.message || 'Server error'}. Check your connection.`);
      
      // Only use default data if explicitly set
      if (remoteFoodItems.length === 0 && localTrackedFoodItems.length === 0) {
        console.log('No data available, using default data');
        setUseDefaultData(true);
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
      setIsRefreshing(false);
    }
  };
  
  // Handle pull-to-refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData(false);
  };
  
  // Fetch food logs when component mounts
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  // Combine local and remote food items
  const allFoodItems = [...localTrackedFoodItems, ...remoteFoodItems];
  
  // Determine what data to display
  let foodDataToUse = allFoodItems;
  
  // If no data and useDefaultData is true, use default data
  if (foodDataToUse.length === 0 && useDefaultData) {
    console.log('Using default food log data');
    foodDataToUse = getDefaultFoodLogData().flatMap(meal => 
      meal.items.map(item => ({ 
        name: item.name, 
        calories: item.calories,
        timestamp: new Date().setHours(
          meal.meal === "Breakfast" ? 8 : 
          meal.meal === "Lunch" ? 12 : 
          meal.meal === "Snack" ? 16 : 
          meal.meal === "Dinner" ? 19 : 22, 
          0, 0, 0
        )
      }))
    );
  }
  
  // Organize tracked food items into meal categories
  const organizedMeals = organizeMealsByType(foodDataToUse);
  
  // Convert organized meals object to array for rendering
  const foodLogData = Object.values(organizedMeals) as MealData[];
  const sortedFoodLogData = sortMealsByOrder(foodLogData);
  
  // Get total calories from the daily summary or calculate from tracked items
  const totalCalories = dailySummary?.total_calories ?? 
    sortedFoodLogData.reduce((sum, meal) => sum + meal.totalCalories, 0);

  // Get calorie target from daily summary or use default
  const calorieTarget = dailySummary?.calorie_target ?? 2000;
  
  // Calculate progress percentage for calories
  const caloriesPercentage = Math.min(Math.round((totalCalories / calorieTarget) * 100), 100);
  
  // Create progress data for display
  const progressData = [
    {
      percentage: caloriesPercentage,
      label: "Calories",
      current: totalCalories,
      target: calorieTarget,
      unit: "kcal",
      color: "#EF4444",
    },
    // We could get these from API in future versions
    {
      percentage: 75,
      label: "Protein",
      current: 45,
      target: 60,
      unit: "g",
      color: "#10B981",
    },
    {
      percentage: 72,
      label: "Carbs",
      current: 180,
      target: 250,
      unit: "g",
      color: "#F59E0B",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            colors={["#10B981"]}
          />
        }
      >
        {/* Dashboard Title */}
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
        </View>

        {/* Today's Progress Card */}
        <Card title="Today's Progress">
          {isLoading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-gray-500 mt-2">Loading your data...</Text>
            </View>
          ) : error ? (
            <View className="py-4">
              <Text className="text-red-500 text-center">{error}</Text>
              <Text className="text-gray-500 text-center mt-2">
                Pull down to refresh
              </Text>
            </View>
          ) : (
            <View className="flex-row justify-around">
              {progressData.map((item, index) => (
                <ProgressCircle
                  key={index}
                  percentage={item.percentage}
                  label={item.label}
                  current={item.current}
                  target={item.target}
                  unit={item.unit}
                  color={item.color}
                />
              ))}
            </View>
          )}
        </Card>

        {/* Today's Food Log */}
        <Card 
          title="Today's Food Log"
          titleRight={
            <View className="bg-green-50 px-3 py-1 rounded-full">
              <Text className="text-sm font-medium text-green-600">Total Calories: {totalCalories} kcal</Text>
            </View>
          }
        >
          {isLoading ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#10B981" />
            </View>
          ) : (
            sortedFoodLogData.length > 0 ? (
              sortedFoodLogData.map((meal, index) => (
                <FoodLogItem
                  key={index}
                  time={meal.time}
                  meal={meal.meal}
                  items={meal.items}
                  totalCalories={meal.totalCalories}
                />
              ))
            ) : (
              <Text className="text-gray-500 italic text-center py-4">
                No food items tracked today. Start by adding food from the Track Food tab.
              </Text>
            )
          )}
        </Card>

        {/* Success Message */}
        <Card style="bg-green-50 border border-green-100 mb-6">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="checkmark" size={16} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-green-800">You're doing great!</Text>
              <Text className="text-sm text-green-600">
                {allFoodItems.length > 0 
                  ? `You've logged ${allFoodItems.length} food items today.` 
                  : "Start tracking your food to reach your goals."}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DashboardScreen