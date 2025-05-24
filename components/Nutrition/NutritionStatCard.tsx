import { View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Define types for the nutritional stats
export type NutritionStatType = 'iron' | 'energy' | 'shield' | 'flame' | 'fiber';

// Define the props interface
export interface NutritionStatCardProps {
  type: NutritionStatType;
  value: string;
}

// Define the configuration for each nutrition stat type
const statConfigs = {
  iron: {
    icon: ({ size, color }: { size: number; color: string }) => (
      <MaterialCommunityIcons name="weight-lifter" size={size} color={color} />
    ),
    color: '#4299e1', // blue
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-500',
    label1: 'Iron',
    label2: 'Strength',
  },
  energy: {
    icon: ({ size, color }: { size: number; color: string }) => (
      <Ionicons name="flash" size={size} color={color} />
    ),
    color: '#ecc94b', // yellow
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-500',
    label1: 'Swift',
    label2: 'Energy',
  },
  shield: {
    icon: ({ size, color }: { size: number; color: string }) => (
      <Ionicons name="shield" size={size} color={color} />
    ),
    color: '#667eea', // indigo
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-500',
    label1: 'Mystic',
    label2: 'Shield',
  },
  flame: {
    icon: ({ size, color }: { size: number; color: string }) => (
      <FontAwesome5 name="fire" size={size} color={color} />
    ),
    color: '#ed8936', // orange
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-500',
    label1: 'Endurance',
    label2: 'Flame',
  },
  fiber: {
    icon: ({ size, color }: { size: number; color: string }) => (
      <MaterialCommunityIcons name="leaf" size={size} color={color} />
    ),
    color: '#48bb78', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-500',
    label1: 'Fiberous',
    label2: '',
  },
};

export function NutritionStatCard({ type, value }: NutritionStatCardProps) {
  const config = statConfigs[type];
  
  return (
    <View className="bg-white rounded-xl p-3 items-center w-16 shadow-sm">
      {config.icon({ size: 24, color: config.color })}
      <Text className={`${config.textColor} text-xs mt-1`}>{config.label1}</Text>
      <Text className={`${config.textColor} text-xs`}>{config.label2}</Text>
      <View className={`${config.bgColor} rounded-full px-2 py-1 mt-1`}>
        <Text className={`${config.textColor} text-xs`}>{value}</Text>
      </View>
    </View>
  );
}