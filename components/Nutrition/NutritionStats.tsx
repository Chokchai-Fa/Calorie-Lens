import { View } from 'react-native';
import { NutritionStatCard, NutritionStatType } from './NutritionStatCard';

export interface NutritionStat {
  type: NutritionStatType;
  value: string;
}

interface NutritionStatsProps {
  stats: NutritionStat[];
}

export function NutritionStats({ stats }: NutritionStatsProps) {
  return (
    <View className="flex-row justify-between px-4 mt-4">
      {stats.map((stat, index) => (
        <NutritionStatCard 
          key={index} 
          type={stat.type} 
          value={stat.value} 
        />
      ))}
    </View>
  );
}