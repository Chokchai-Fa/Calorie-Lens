import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';
import { addImage, startFoodAnalysis, setFoodDetails, setAnalysisError } from '../store/imagesSlice';
import { analyzeFoodImage, uriToBase64 } from '../services/geminiService';

export function CameraScreen() {
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();
  const [isEmulator, setIsEmulator] = useState(false);
  const dispatch = useDispatch();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      // Check if running in an emulator
      const isRunningInEmulator = Platform.OS === 'ios' 
        ? ['ios', 'simulator', 'bare'].includes(String(Constants.executionEnvironment))
        : Platform.OS === 'android' && (
            Constants.deviceName?.includes('emulator') || 
            Constants.deviceName?.includes('sdk')
          );
      
      setIsEmulator(Boolean(isRunningInEmulator));
      
      // Request camera permissions if needed
      if (!cameraPermission?.granted) {
        await requestCameraPermission();
      }
    })();
  }, [cameraPermission, requestCameraPermission]);

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        
        // Store captured image in Redux
        dispatch(addImage({
          uri: photo.uri,
          timestamp: Date.now(),
          type: 'captured'
        }));
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    } else {
      console.log('Camera not ready or reference not available');
    }
  };

  const handleCameraReady = () => {
    console.log('Camera is ready');
    setCameraReady(true);
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    
    // Launch image picker
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;
        setCapturedImage(selectedUri);
        
        // Store picked image in Redux
        dispatch(addImage({
          uri: selectedUri,
          timestamp: Date.now(),
          type: 'picked'
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const analyzeWithGemini = async (imageUri: string) => {
    if (!imageUri) return;
    
    try {
      setAnalyzing(true);
      dispatch(startFoodAnalysis());
      
      // Convert image URI to base64
      console.log('Converting image to base64');
      const base64Image = await uriToBase64(imageUri);
      
      // Call Gemini API to analyze the image
      console.log('Calling Gemini API');
      const result = await analyzeFoodImage(base64Image);
      console.log('Gemini API response:', result);
      
      // Store food details in Redux
      dispatch(setFoodDetails({
        name: result.name,
        ingredients: result.ingredients,
        calories: result.calories,
        caloriesPerIngredient: result.caloriesPerIngredient,
        portionInGrams: result.portionInGrams,
        imageUri: imageUri
      }));
      
      // Navigate to Food Details screen
      navigation.navigate('FoodDetails' as never);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      dispatch(setAnalysisError('Failed to analyze food image'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAcceptImage = () => {
    if (capturedImage) {
      analyzeWithGemini(capturedImage);
    }
  };

  if (!cameraPermission) {
    return <View className="flex-1 justify-center items-center"><Text>Requesting camera permission...</Text></View>;
  }
  
  if (!cameraPermission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4">We need camera permissions to take photos.</Text>
        <TouchableOpacity 
          className="bg-blue-500 rounded-xl py-3 px-6"
          onPress={requestCameraPermission}
        >
          <Text className="text-white font-bold">Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {capturedImage ? (
        <View className="flex-1 justify-center">
          <Image source={{ uri: capturedImage }} className="flex-1" />
          
          {analyzing ? (
            <View className="absolute bottom-10 w-full flex justify-center items-center">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="text-white mt-2 text-center">Analyzing food...</Text>
            </View>
          ) : (
            <View className="absolute bottom-10 w-full flex-row justify-center space-x-8">
              <TouchableOpacity 
                className="bg-white rounded-full p-4"
                onPress={() => setCapturedImage(null)}
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
      ) : (
        <View className="flex-1">
          {isEmulator ? (
            <View className="flex-1 justify-center items-center bg-black">
              <Text className="text-white text-lg text-center px-6 mb-4">
                Camera preview is not fully supported in emulators
              </Text>
              <TouchableOpacity 
                className="bg-blue-500 rounded-xl py-3 px-6 mb-4"
                onPress={pickImage}
              >
                <Text className="text-white font-bold">Select Image from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="mt-4"
                onPress={handleGoBack}
              >
                <Text className="text-white">Go Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-1">
              {/* Camera view */}
              <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="back"
                onCameraReady={handleCameraReady}
              />
              
              {/* UI elements placed outside of CameraView with absolute positioning */}
              <View className="absolute inset-0 flex-1 justify-between">
                {/* Top bar */}
                <View className="pt-2 px-4 flex-row justify-between">
                  <TouchableOpacity 
                    className="bg-black/50 rounded-full p-2" 
                    onPress={handleGoBack}
                  >
                    <Ionicons name="arrow-back" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="bg-black/50 rounded-full p-2"
                    onPress={() => {
                      // Toggle flash (would be implemented here)
                    }}
                  >
                    <Ionicons name="flash-off" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                
                {/* Bottom bar */}
                <View className="pb-8 px-4 flex-row justify-between items-center">
                  <TouchableOpacity 
                    className="bg-white/20 rounded-full p-3" 
                    onPress={pickImage}
                  >
                    <Ionicons name="images" size={28} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="bg-white rounded-full h-16 w-16 items-center justify-center"
                    onPress={takePicture}
                  >
                    <View className="h-14 w-14 rounded-full border-2 border-gray-800" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="bg-white/20 rounded-full p-3"
                    onPress={() => {
                      // Toggle camera (would be implemented here)
                    }}
                  >
                    <Ionicons name="camera-reverse" size={28} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}