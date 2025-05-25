import { TouchableOpacity, Text } from 'react-native';

interface ScanButtonProps{
  onPress?: () => void;
};

const ScanButton = ({ onPress }: ScanButtonProps) => {
  return (
    <TouchableOpacity 
      className="bg-yellow-400 mx-4 mt-6 rounded-xl p-4 shadow-md"
      onPress={onPress}
    >
      <Text className="text-center text-yellow-800 font-bold text-lg">
        Scan Food with the
      </Text>
      <Text className="text-center text-yellow-700 font-bold text-lg">
        CalorieLens!
      </Text>
    </TouchableOpacity>
  );
}

export default ScanButton;