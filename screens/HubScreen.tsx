import { View, Text, Image, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ScanButton } from '../components/ScanButton';
import { NutritionStats } from '../components/Nutrition/NutritionStats';
import { NutritionStat } from '../components/Nutrition/NutritionStats';


export function HubScreen() {
  // Define nutrition stats data
  const nutritionStats: NutritionStat[] = [
    { type: 'iron', value: '19g' },
    { type: 'energy', value: '20g' },
    { type: 'shield', value: '7g' },
    { type: 'flame', value: '12g' },
    { type: 'fiber', value: '22g' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-lime-100">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 pt-2">
          <View className="bg-blue-100 rounded-full p-2 mr-2">
            <Ionicons name="search" size={24} color="#4a5568" />
          </View>
          <Text className="text-2xl font-bold text-green-800">CalorieLens</Text>
        </View>

        {/* Character Section */}
        <View className="items-center mt-2 px-4">
          {/* Speech Bubble */}
          <View className="bg-white rounded-full px-5 py-2 shadow-sm mb-2">
            <Text className="text-gray-600">Ready to fuel our adventure?</Text>
          </View>
          
          {/* Character Avatar */}
          <View className="rounded-full overflow-hidden border-4 border-white shadow-lg w-40 h-40">
            <Image
              source={{ uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-D88lGZDkfrLW5ol3AFgbAlGpJ7tlh4.png" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Level Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-md">
          <View className="flex-row items-center">
            <Text className="text-gray-800 font-bold">⭐ Level 5</Text>
            <Text className="text-green-500 ml-2">Vita-Voyager</Text>
          </View>
          <View className="mt-2">
            <View className="h-3 bg-blue-100 rounded-full overflow-hidden">
              <View className="h-full bg-blue-500 rounded-full" style={{ width: '62%' }} />
            </View>
            <Text className="text-right text-xs text-gray-500 mt-1">620/1000</Text>
          </View>
        </View>

        {/* Nutrition Stats Component */}
        <NutritionStats stats={nutritionStats} />

        {/* Scan Button Component */}
        <ScanButton onPress={() => console.log('Scan button pressed')} />

        {/* Active Quest */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-md">
          <View className="flex-row">
            <FontAwesome5 name="scroll" size={20} color="#d69e2e" />
            <Text className="font-bold text-gray-700 ml-2">Active Quest:</Text>
          </View>
          <Text className="font-bold text-gray-700 mt-1">The Fiberous Fields</Text>
          <Text className="text-green-500 text-sm">Consume 75g of Fiber today!</Text>
          <Text className="text-yellow-600 text-xs mt-1">Reward: +50 XP, +1 Vitamin Point</Text>
        </View>

        {/* Bottom Navigation */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}