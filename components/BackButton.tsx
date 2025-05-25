import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface BackButtonProps {
  color?: string;
  onPress?: () => void;
  size?: number;
  style?: string;
}

const BackButton = ({ 
  color = '#000', 
  size = 24,
  style = 'bg-transparent',
  onPress 
}: BackButtonProps) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };
  
  return (
    <TouchableOpacity 
      className={`rounded-full p-2 ${style}`} 
      onPress={handlePress}
    >
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
}

export default BackButton;