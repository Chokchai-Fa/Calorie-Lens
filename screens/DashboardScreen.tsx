import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native"
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

const DashboardScreen = () => {
  // Get tracked food images from Redux store
  const { images } = useSelector((state: any) => state.images);
  
  // Get only tracked food items
  const trackedFoodItems = images.filter((image: any) => 
    image.isTracked === true && image.foodDetails
  );
  
  // Organize tracked food items into meal categories
  const organizedMeals = organizeMealsByType(trackedFoodItems);
  
  // Convert organized meals object to array for rendering
  const foodLogData = Object.values(organizedMeals) as MealData[];
  const sortedFoodLogData = sortMealsByOrder(foodLogData);
  
  // Calculate total calories consumed today
  const totalCalories = sortedFoodLogData.reduce((sum, meal) => sum + meal.totalCalories, 0);

  // Calculate progress percentage for calories
  const caloriesPercentage = Math.min(Math.round((totalCalories / 2000) * 100), 100);
  
  const progressData = [
    {
      percentage: caloriesPercentage,
      label: "Calories",
      current: totalCalories,
      target: 2000,
      unit: "kcal",
      color: "#EF4444",
    },
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Dashboard Title */}
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
        </View>

        {/* Today's Progress Card */}
        <Card title="Today's Progress">
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
          {sortedFoodLogData.length > 0 ? (
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
                {trackedFoodItems.length > 0 
                  ? `You've logged ${trackedFoodItems.length} food items today.` 
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