import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}

export function LoadingSpinner({ 
  text = 'Loading...', 
  size = 'large', 
  color = '#0000ff' 
}: LoadingSpinnerProps) {
  return (
    <View className="items-center justify-center bg-white/80 rounded-lg p-4">
      <ActivityIndicator size={size} color={color} />
      {text && <Text className="mt-2 text-gray-700 font-medium">{text}</Text>}
    </View>
  );
}