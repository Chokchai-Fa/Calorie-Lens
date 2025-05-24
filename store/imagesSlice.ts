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
  clearFoodDetails
} = imagesSlice.actions;

export default imagesSlice.reducer;