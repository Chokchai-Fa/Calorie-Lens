import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FoodDetails {
  name: string;
  ingredients: string[];
  calories: number;
  caloriesPerIngredient?: Record<string, number>;
  portionInGrams?: number;
  imageUri: string;
}

interface Image {
  uri: string;
  timestamp: number;
  type: 'captured' | 'picked';
  foodDetails?: FoodDetails;
  isTracked?: boolean;
}

interface ImagesState {
  images: Image[];
  currentImage: Image | null;
  foodDetails: FoodDetails | null;
  isAnalyzing: boolean;
  analysisError: string | null;
}

const initialState: ImagesState = {
  images: [],
  currentImage: null,
  foodDetails: null,
  isAnalyzing: false,
  analysisError: null,
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<Image>) => {
      state.images.push(action.payload);
      state.currentImage = action.payload;
    },
    setCurrentImage: (state, action: PayloadAction<Image | null>) => {
      state.currentImage = action.payload;
    },
    clearCurrentImage: (state) => {
      state.currentImage = null;
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter(image => image.uri !== action.payload);
      if (state.currentImage && state.currentImage.uri === action.payload) {
        state.currentImage = null;
      }
    },
    clearAllImages: (state) => {
      state.images = [];
      state.currentImage = null;
      state.foodDetails = null;
    },
    startFoodAnalysis: (state) => {
      state.isAnalyzing = true;
      state.analysisError = null;
    },
    setFoodDetails: (state, action: PayloadAction<FoodDetails>) => {
      state.foodDetails = action.payload;
      state.isAnalyzing = false;
    },
    setAnalysisError: (state, action: PayloadAction<string>) => {
      state.analysisError = action.payload;
      state.isAnalyzing = false;
    },
    clearFoodDetails: (state) => {
      state.foodDetails = null;
      state.analysisError = null;
    },
    trackFood: (state) => {
      if (state.currentImage && state.foodDetails) {
        // Find the current image in the images array
        const imageIndex = state.images.findIndex(img => 
          img.uri === state.currentImage?.uri && 
          img.timestamp === state.currentImage?.timestamp
        );
        
        if (imageIndex !== -1) {
          // Add food details to the image and mark as tracked
          state.images[imageIndex] = {
            ...state.images[imageIndex],
            foodDetails: state.foodDetails,
            isTracked: true
          };
        }
      }
    },
    removeTrackedFood: (state, action: PayloadAction<number | undefined>) => {
      if (action.payload) {
        // If a timestamp is provided, remove that specific food item
        state.images = state.images.filter(image => image.timestamp !== action.payload);
      } else if (state.currentImage) {
        // Otherwise remove the current image if no timestamp provided
        state.images = state.images.filter(img => 
          !(img.uri === state.currentImage?.uri && img.timestamp === state.currentImage?.timestamp)
        );
        
        // Also update the current image to indicate it's not tracked anymore
        if (state.currentImage) {
          state.currentImage = {
            ...state.currentImage,
            isTracked: false
          };
        }
      }
    },
  },
});

export const { 
  addImage, 
  setCurrentImage, 
  clearCurrentImage, 
  removeImage, 
  clearAllImages,
  startFoodAnalysis,
  setFoodDetails,
  setAnalysisError,
  clearFoodDetails,
  trackFood,
  removeTrackedFood
} = imagesSlice.actions;

export default imagesSlice.reducer;