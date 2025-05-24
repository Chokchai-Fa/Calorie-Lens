import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export function FoodDetailsScreen() {
  const navigation = useNavigation();
  const { foodDetails, currentImage } = useSelector((state: any) => state.images);
  
  if (!foodDetails) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">No food details available</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 rounded-xl py-3 px-6"
          onPress={() => navigation.navigate("MainTabs" as never)}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { name, ingredients, calories } = foodDetails;
  

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs" as never)}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold flex-1">Food Details</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Food image */}
        {currentImage && (
          <View className="w-full h-64">
            <Image 
              source={{ uri: currentImage.uri }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Food name */}
        <View className="px-4 pt-4">
          <Text className="text-2xl font-bold">{name}</Text>
        </View>
        
        {/* Calories information */}
        <View className="px-4 mt-3">
          <Text className="text-lg text-gray-700">{calories} calories</Text>
          {foodDetails.portionInGrams && (
            <Text className="text-md text-gray-700 mt-1">Portion size: {foodDetails.portionInGrams}g</Text>
          )}
        </View>

        {/* Ingredients */}
        <View className="px-4 mt-6">
          <Text className="text-lg font-semibold mb-2">Ingredients:</Text>
          {ingredients.map((ingredient: string, index: number) => (
            <View key={index} className="flex-row items-center mb-1">
              <View className="h-2 w-2 rounded-full bg-gray-400 mr-2" />
              <Text className="text-gray-800">{ingredient}</Text>
              {foodDetails.caloriesPerIngredient && foodDetails.caloriesPerIngredient[ingredient] && (
                <Text className="text-gray-500 ml-2">
                  ({foodDetails.caloriesPerIngredient[ingredient]} cal)
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Additional details can be added here */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}