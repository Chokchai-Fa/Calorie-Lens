import {View, Text} from 'react-native';

// Progress Circle Props Interface
interface ProgressCircleProps {
    percentage: number;
    label: string;
    current: number;
    target: number;
    unit: string;
    color?: string;
  }
  
  // Progress Circle Component
  const ProgressCircle = ({ percentage, label, current, target, unit, color = "#4F46E5" }: ProgressCircleProps) => {
    const radius = 35
    const strokeWidth = 6
    const normalizedRadius = radius - strokeWidth * 2
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDasharray = `${circumference} ${circumference}`
    const strokeDashoffset = circumference - (percentage / 100) * circumference
  
    return (
      <View className="items-center">
        <View className="relative">
          <View
            className="w-20 h-20 rounded-full items-center justify-center"
            style={{
              backgroundColor: "#f3f4f6",
              borderWidth: strokeWidth,
              borderColor: "#e5e7eb",
            }}
          >
            <View
              className="absolute w-20 h-20 rounded-full"
              style={{
                borderWidth: strokeWidth,
                borderColor: color,
                borderTopColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "transparent",
                transform: [{ rotate: `${(percentage / 100) * 360 - 90}deg` }],
              }}
            />
            <Text className="text-lg font-bold text-gray-800">{percentage}%</Text>
          </View>
        </View>
        <Text className="text-xs text-gray-500 mt-2 font-medium">{label}</Text>
        <Text className="text-xs text-gray-400">
          {current}/{target} {unit}
        </Text>
      </View>
    )
  }

  export default ProgressCircle;