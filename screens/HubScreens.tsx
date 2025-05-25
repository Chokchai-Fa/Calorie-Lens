import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import ScanButton from '../components/ScanButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setCurrentImage } from '../store/imagesSlice';
import { useLoading } from '../hooks/useLoading';
import Card from '../components/Card';

const HubScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { images } = useSelector((state: RootState) => state.images);
  // Use the custom loading hook instead of managing the state directly
  const isLoading = useLoading();
  

  const handleScanPress = () => {
    navigation.navigate('Camera' as never);
  };

  const handleImagePress = (uri: string) => {
    const image = images.find(img => img.uri === uri);
    if (image) {
      dispatch(setCurrentImage(image));
      // Navigate to food details screen
      navigation.navigate('FoodDetails' as never);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lime-100">
      <StatusBar style="dark" />
      
      {/* Loading overlay for Gemini API calls */}
      {isLoading && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
          <LoadingSpinner text="Analyzing with Gemini..." color="#48bb78" />
        </View>
      )}
      
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
        <Card style="mt-2">
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
        </Card>

        {/* Images Gallery */}
        {images.length > 0 && (
          <Card 
            title="Recent Captures"
            titleRight={<Text className="text-blue-500 text-sm">{images.length} {images.length === 1 ? 'image' : 'images'}</Text>}
          >
            <FlatList
              data={images}
              keyExtractor={(item) => item.uri}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => handleImagePress(item.uri)}
                  className="mr-3"
                >
                  <Image 
                    source={{ uri: item.uri }}
                    className="w-24 h-24 rounded-lg"
                  />
                  <View className="absolute top-1 right-1 bg-black/50 rounded-full p-1">
                    <Ionicons 
                      name={item.type === 'captured' ? 'camera' : 'images'} 
                      size={12} 
                      color="white" 
                    />
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text className="text-gray-500 italic">No images captured yet</Text>
              }
            />
          </Card>
        )}

        {/* Scan Button Component */}
        <ScanButton onPress={handleScanPress} />

        {/* Active Quest */}
        <Card>
          <View className="flex-row">
            <FontAwesome5 name="scroll" size={20} color="#d69e2e" />
            <Text className="font-bold text-gray-700 ml-2">Active Quest:</Text>
          </View>
          <Text className="font-bold text-gray-700 mt-1">The Fiberous Fields</Text>
          <Text className="text-green-500 text-sm">Consume 75g of Fiber today!</Text>
          <Text className="text-yellow-600 text-xs mt-1">Reward: +50 XP, +1 Vitamin Point</Text>
        </Card>

        {/* Bottom Navigation */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}

export default HubScreen;