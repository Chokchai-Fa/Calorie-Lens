import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useImageAnalysis } from '../hooks/useImageAnalysis';
import { useLoading } from '../hooks/useLoading';
import LoadingSpinner from './LoadingSpinner';

interface ImageConfirmationProps {
  imageUri: string;
  onCancel: () => void;
}

const ImageConfirmationComponent: React.FC<ImageConfirmationProps> = ({ imageUri, onCancel }) => {
  const navigation = useNavigation();
  const { analyzeImage } = useImageAnalysis();
  const isLoading = useLoading();

  const handleAcceptImage = async () => {
    if (imageUri) {
      const result = await analyzeImage(imageUri);
      if (result) {
        // Navigate to Food Details screen
        navigation.navigate('FoodDetails' as never);
      }
    }
  };

  return (
    <View className="flex-1 justify-center">
      <Image source={{ uri: imageUri }} className="flex-1" />
      
      {isLoading ? (
        <View className="absolute bottom-10 w-full flex justify-center items-center">
          <LoadingSpinner size="large" color="#ffffff" text="Analyzing food..." />
        </View>
      ) : (
        <View className="absolute bottom-10 w-full flex-row justify-center space-x-8">
          <TouchableOpacity 
            className="bg-white rounded-full p-4 mr-2"
            onPress={onCancel}
          >
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-green-500 rounded-full p-4"
            onPress={handleAcceptImage}
          >
            <Ionicons name="checkmark" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageConfirmationComponent;