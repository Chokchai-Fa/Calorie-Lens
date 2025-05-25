import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Share } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import { format } from 'date-fns';
import { trackFood, removeTrackedFood } from '../store/imagesSlice';

const FoodDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { foodDetails, currentImage } = useSelector((state: any) => state.images);
  
  if (!foodDetails || !currentImage) {
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
  
  // Format the timestamp from currentImage
  const formattedDate = format(
    currentImage.timestamp,
    'MMMM d, yyyy - h:mm a'
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just tracked ${name} with ${calories} calories using Food Tracker!`,
        url: currentImage.uri
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Check if the current food item is already tracked
  const isAlreadyTracked = currentImage.isTracked === true;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
        <View className="flex-row items-center flex-1">
          <BackButton onPress={() => navigation.navigate("MainTabs" as never)} />
          <Text className="ml-4 text-xl font-bold flex-1">Food Details</Text>
        </View>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#374151" />
        </TouchableOpacity>
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

        {/* Food name and timestamp */}
        <Card style="mx-4 mt-4">
          <Text className="text-2xl font-bold">{name}</Text>
          <Text className="text-lg text-gray-700 mt-1">{calories} calories</Text>
          <Text className="text-sm text-gray-500 mt-2">{formattedDate}</Text>
          {foodDetails.portionInGrams && (
            <Text className="text-md text-gray-700 mt-1">Portion size: {foodDetails.portionInGrams}g</Text>
          )}
        </Card>

        {/* Ingredients */}
        <Card title="Ingredients" style="mx-4 mt-4">
          {ingredients.map((ingredient: string, index: number) => (
            <View key={index} className="flex-row items-center mb-2">
              <View className="h-2 w-2 rounded-full bg-gray-400 mr-2" />
              <Text className="text-gray-800 flex-1">{ingredient}</Text>
              {foodDetails.caloriesPerIngredient && foodDetails.caloriesPerIngredient[ingredient] && (
                <Text className="text-gray-500">
                  ({foodDetails.caloriesPerIngredient[ingredient]} cal)
                </Text>
              )}
            </View>
          ))}
        </Card>

        {/* Source Information */}
        <Card title="Analysis Source" style="mx-4 my-4">
          <View className="flex-row items-center">
            <Ionicons name="analytics-outline" size={20} color="#4B5563" className="mr-2" />
            <Text className="text-gray-700">Analysis provided by Gemini AI</Text>
          </View>
        </Card>

        {/* Additional actions */}
        <View className="mx-4 mt-2 mb-6">
          {!isAlreadyTracked ? (
            <TouchableOpacity
              className="bg-green-500 rounded-xl py-4 items-center shadow-sm"
              onPress={() => {
                // Track the food item in Redux
                dispatch(trackFood());
                
                // Show feedback to the user
                alert(`${name} added to daily tracking!`);
                
                // Navigate back to main tabs
                navigation.navigate("MainTabs" as never);
              }}
            >
              <Text className="text-white font-semibold text-base">Add to Daily Tracking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-red-500 rounded-xl py-4 items-center shadow-sm"
              onPress={() => {
                // Remove the food item from tracking in Redux with the current image timestamp
                dispatch(removeTrackedFood(currentImage.timestamp));
                
                // Show feedback to the user
                alert(`${name} removed from daily tracking!`);
                
                // Navigate back to main tabs
                navigation.navigate("MainTabs" as never);
              }}
            >
              <Text className="text-white font-semibold text-base">Remove from Tracking</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            className="bg-gray-100 rounded-xl py-4 items-center shadow-sm mt-3"
            onPress={() => {
              // Logic to modify or adjust details
              // This could navigate to an edit screen
            }}
          >
            <Text className="text-gray-800 font-semibold text-base">Adjust Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default FoodDetailsScreen;