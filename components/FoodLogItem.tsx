import {View, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Food Item interface
interface FoodItem {
    name: string;
    calories: number;
}
  
  // Food Log Item Component
  const FoodLogItem = ({ 
    time, 
    meal, 
    items, 
    totalCalories,
    onRemove
  }: { 
    time: string; 
    meal: string; 
    items: FoodItem[]; 
    totalCalories: number;
    onRemove?: () => void; 
  }) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name="time-outline" size={16} color="#6B7280" />
        <Text className="text-sm text-gray-500 ml-1">{time}</Text>
        <View className="ml-auto flex-row items-center">
          <Text className="text-sm font-semibold text-gray-800 mr-2">{totalCalories} kcal</Text>
          {onRemove && (
            <TouchableOpacity onPress={onRemove}>
              <Ionicons name="close-circle" size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
  
      <Text className="text-base font-semibold text-gray-800 mb-1">{meal}</Text>
  
      {items.map((item, index) => (
        <View key={index} className="flex-row justify-between items-center py-1">
          <Text className="text-sm text-gray-600">{item.name}</Text>
          <Text className="text-sm text-gray-500">{item.calories} kcal</Text>
        </View>
      ))}
    </View>
  );
  
  export default FoodLogItem;