import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface Category {
  id: number;
  title: string;
  icon?: any;
  description: string;
  color: string;
  backgroundImage?: any;
}

interface CategoryCardProps {
  category: Category;
  onPress: (title: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity
      className="w-[48%] aspect-[3/4] rounded-2xl mb-4 overflow-hidden"
      onPress={() => onPress(category.title)}
    >
      {category.backgroundImage ? (
        <View className="flex-1 relative">
          <Image
            source={category.backgroundImage}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          {/* 전체 카드를 어둡게 하는 오버레이 */}
          <View className="absolute inset-0 bg-black/50" />
          <View className="flex-1 p-4 justify-end items-start relative z-10">
            <Text className="text-subheading-bold text-white mb-1 text-left">
              {category.title}
            </Text>
            <Text className="text-body-small-regular text-white text-left opacity-90 leading-5">
              {category.description}
            </Text>
          </View>
        </View>
      ) : (
        <View
          className="flex-1 p-4 justify-center items-center"
          style={{ backgroundColor: category.color }}
        >
          <Text className="text-subheading-bold text-white mb-2 text-center">
            {category.title}
          </Text>
          {category.icon && (
            <Image
              source={category.icon}
              className="w-20 h-20 mb-2"
              resizeMode="contain"
            />
          )}
          <Text className="text-body-small-regular text-white text-center opacity-90">
            {category.description}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CategoryCard;
