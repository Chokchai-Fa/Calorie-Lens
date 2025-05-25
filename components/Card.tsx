import { View, Text } from 'react-native';
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  titleRight?: React.ReactNode;
  style?: string;
}

const Card = ({ title, children, titleRight, style = '', ...props }: CardProps) => {
  return (
    <View className={`bg-white mx-4 mt-4 rounded-xl p-4 shadow-md ${style}`} {...props}>
      {(title || titleRight) && (
        <View className="flex-row justify-between items-center mb-3">
          {title && <Text className="font-bold text-gray-700">{title}</Text>}
          {titleRight}
        </View>
      )}
      {children}
    </View>
  );
}

export default Card;