import { useState, useMemo } from "react"
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, TextInput, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { useDispatch, useSelector } from "react-redux"
import { addImage, setCurrentImage, removeTrackedFood } from "../store/imagesSlice"
import ImageConfirmationComponent from "../components/ImageConfirmation"
import { format } from "date-fns"

// Food Item Component for Common Foods
const FoodItem = ({ name, serving, calories, onAdd }: { name: string; serving: string; calories: number; onAdd: () => void }) => (
  <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
    <View className="flex-1">
      <Text className="text-base font-medium text-gray-800">{name}</Text>
      <Text className="text-sm text-gray-500">
        {serving} • {calories} cal
      </Text>
    </View>
    <TouchableOpacity onPress={onAdd} className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
      <Ionicons name="add" size={20} color="white" />
    </TouchableOpacity>
  </View>
)

// Recently Tracked Item Component
const RecentlyTrackedItem = ({ 
  name, 
  timeAgo, 
  calories, 
  imageUri,
  timestamp,
  onPress,
  onRemove 
}: { 
  name: string; 
  timeAgo: string; 
  calories: number;
  imageUri?: string;
  timestamp: number;
  onPress: () => void;
  onRemove: () => void;
}) => (
  <View className="py-3 border-b border-gray-100">
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between"
    >
      <View className="flex-row items-center flex-1">
        {imageUri && (
          <Image 
            source={{ uri: imageUri }} 
            className="w-10 h-10 rounded-md mr-3" 
            resizeMode="cover"
          />
        )}
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-800">{name}</Text>
          <Text className="text-sm text-gray-500">{timeAgo}</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <Text className="text-sm font-medium text-gray-600 mr-3">{calories} cal</Text>
        <TouchableOpacity 
          onPress={onRemove}
          className="p-1"
        >
          <Ionicons name="close-circle" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </View>
)

const TrackFoodScreen = () => {
  const [activeTab, setActiveTab] = useState("camera") // 'camera' or 'manual'
  const [searchQuery, setSearchQuery] = useState("")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  
  // Get tracked food items from the Redux store
  const { images } = useSelector((state: any) => state.images)

  // Format date for display
  const getTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else {
      return format(timestamp, 'MMM d, h:mm a')
    }
  }

  // Get recently tracked items with food details
  const recentlyTracked = useMemo(() => {
    return images
      .filter((image: any) => image.foodDetails)
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map((image: any) => ({
        name: image.foodDetails.name,
        timeAgo: getTimeAgo(image.timestamp),
        calories: image.foodDetails.calories,
        imageUri: image.uri,
        timestamp: image.timestamp
      }))
  }, [images])

  const commonFoods = [
    { name: "Apple", serving: "1 medium", calories: 95 },
    { name: "Banana", serving: "1 medium", calories: 105 },
    { name: "Chicken Breast", serving: "100g", calories: 165 },
    { name: "White Rice", serving: "100g cooked", calories: 130 },
    { name: "Whole Milk", serving: "1 cup", calories: 150 },
    { name: "Egg", serving: "1 large", calories: 70 },
  ]

  const filteredFoods = commonFoods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddFood = (food: any) => {
    console.log("Adding food:", food)
    // Add logic to add food to tracking
  }

  const handleTakePhoto = () => {
    // Navigate to camera screen
    navigation.navigate("Camera" as never)
  }

  const handleSelectFromGallery = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!")
      return
    }
    
    // Launch image picker
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      
      if (!result.canceled) {
        const selectedUri = result.assets[0].uri
        
        // Store picked image in Redux
        dispatch(addImage({
          uri: selectedUri,
          timestamp: Date.now(),
          type: "picked"
        }))
        
        // Set the captured image to show confirmation screen
        setCapturedImage(selectedUri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
    }
  }

  const handleAddCustomFood = () => {
    console.log("Adding custom food")
    // Navigate to custom food entry screen
  }

  // Navigate to food details screen for a previously tracked item
  const handleViewTrackedFood = (timestamp: number) => {
    // Find the image with the matching timestamp
    const selectedImage = images.find((img: any) => img.timestamp === timestamp)
    
    if (selectedImage) {
      // Set the current image in Redux without adding a new image
      dispatch(setCurrentImage(selectedImage))
      
      // Navigate to the food details screen
      navigation.navigate("FoodDetails" as never)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {capturedImage ? (
        <ImageConfirmationComponent 
          imageUri={capturedImage} 
          onCancel={() => setCapturedImage(null)}
        />
      ) : (
        <>
          {/* Tab Navigation */}
          <View className="bg-white px-4 border-b border-gray-100">
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setActiveTab("camera")}
                className={`flex-1 py-3 border-b-2 ${activeTab === "camera" ? "border-green-500" : "border-transparent"}`}
              >
                <Text className={`text-center font-medium ${activeTab === "camera" ? "text-green-600" : "text-gray-500"}`}>
                  Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("manual")}
                className={`flex-1 py-3 border-b-2 ${activeTab === "manual" ? "border-green-500" : "border-transparent"}`}
              >
                <Text className={`text-center font-medium ${activeTab === "manual" ? "text-green-600" : "text-gray-500"}`}>
                  Manual Entry
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {activeTab === "camera" ? (
              // Camera Tab Content
              <View className="flex-1">
                {/* Camera Section */}
                <View className="mx-4 mt-4 mb-6">
                  <View className="bg-gray-100 rounded-2xl h-80 items-center justify-center relative">
                    {capturedImage ? (
                      // Show image confirmation in the camera section
                      <View className="w-full h-full">
                        <Image source={{ uri: capturedImage }} className="w-full h-full rounded-2xl" />
                        <View className="absolute bottom-4 flex-row items-center justify-center w-full space-x-8">
                          <TouchableOpacity 
                            className="bg-white rounded-full p-4 shadow-sm"
                            onPress={() => setCapturedImage(null)}
                          >
                            <Ionicons name="close" size={24} color="black" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            className="bg-green-500 rounded-full p-4 shadow-sm"
                            onPress={() => {
                              // Analyze the image and navigate to food details
                              navigation.navigate("FoodDetails" as never);
                            }}
                          >
                            <Ionicons name="checkmark" size={24} color="white" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      // Show camera placeholder when no image is selected
                      <>
                        <View className="items-center">
                          <View className="w-16 h-16 bg-gray-300 rounded-full items-center justify-center mb-4">
                            <Ionicons name="camera-outline" size={32} color="#6B7280" />
                          </View>
                          <Text className="text-lg font-medium text-gray-700 mb-2">Take a photo of your food</Text>
                          <Text className="text-sm text-gray-500 text-center px-8">
                            We'll analyze the image and estimate the calories
                          </Text>
                        </View>

                        {/* Camera Controls */}
                        <View className="absolute bottom-4 flex-row items-center justify-center w-full">
                          <TouchableOpacity
                            onPress={handleSelectFromGallery}
                            className="w-12 h-12 bg-white rounded-full items-center justify-center mr-8 shadow-sm"
                          >
                            <Ionicons name="images-outline" size={24} color="#374151" />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={handleTakePhoto}
                            className="w-16 h-16 bg-green-500 rounded-full items-center justify-center shadow-lg"
                          >
                            <Ionicons name="camera" size={28} color="white" />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                </View>

                {/* Recently Tracked */} 
                <View className="mx-4 mb-6">
                  <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Recently Tracked</Text>
                    {recentlyTracked.length > 0 ? (
                      <>
                        {recentlyTracked.map((item: any, index: number) => (
                          <RecentlyTrackedItem 
                            key={`tracked-${item.timestamp}-${index}`}
                            name={item.name} 
                            timeAgo={item.timeAgo} 
                            calories={item.calories}
                            imageUri={item.imageUri}
                            timestamp={item.timestamp}
                            onPress={() => handleViewTrackedFood(item.timestamp)}
                            onRemove={() => {
                              // Dispatch remove action with timestamp parameter
                              dispatch(removeTrackedFood(item.timestamp))
                            }}
                          />
                        ))}
                      </>
                    ) : (
                      <Text className="text-gray-500 italic">No recently tracked items</Text>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              // Manual Entry Tab Content
              <View className="flex-1">
                {/* Search Bar */}
                <View className="mx-4 mt-4 mb-4">
                  <View className="bg-white rounded-xl border border-gray-200 flex-row items-center px-4 py-3">
                    <Ionicons name="search-outline" size={20} color="#6B7280" />
                    <TextInput
                      placeholder="Search for food..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      className="flex-1 ml-3 text-base text-gray-800"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Common Foods */}
                <View className="mx-4 mb-6">
                  <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Common Foods</Text>
                    {filteredFoods.map((food, index) => (
                      <FoodItem
                        key={`common-food-${index}`}
                        name={food.name}
                        serving={food.serving}
                        calories={food.calories}
                        onAdd={() => handleAddFood(food)}
                      />
                    ))}
                  </View>
                </View>

                {/* Add Custom Food Button */}
                <View className="mx-4 mb-6">
                  <TouchableOpacity
                    onPress={handleAddCustomFood}
                    className="bg-green-500 rounded-xl py-4 items-center shadow-sm"
                  >
                    <Text className="text-white font-semibold text-base">Add Custom Food</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  )
}

export default TrackFoodScreen