import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ProgressCircle from "components/ProgressCircle";
import FoodLogItem from "components/FoodLogItem"
import Card from "components/Card"



const DashboardScreen = () => {
  const progressData = [
    {
      percentage: 73,
      label: "Calories",
      current: 1450,
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
  ]

  const foodLogData = [
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
  ]

  const totalCalories = foodLogData.reduce((sum, meal) => sum + meal.totalCalories, 0)
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
          {foodLogData.map((meal, index) => (
            <FoodLogItem
              key={index}
              time={meal.time}
              meal={meal.meal}
              items={meal.items}
              totalCalories={meal.totalCalories}
            />
          ))}
        </Card>

        {/* Success Message */}
        <Card style="bg-green-50 border border-green-100 mb-6">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="checkmark" size={16} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-green-800">You're doing great!</Text>
              <Text className="text-sm text-green-600">You've met your protein goal for today.</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DashboardScreen