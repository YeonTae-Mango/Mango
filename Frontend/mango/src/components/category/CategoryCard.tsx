import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

interface Category {
  id: number;
  title: string;
  icon?: any;
  description: string;
  color: string;
}

interface CategoryCardProps {
  category: Category;
  onPress: (title: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity
      className={`w-[48%] aspect-square rounded-2xl p-10 mb-4 justify-center items-center`}
      style={{ backgroundColor: category.color }}
      onPress={() => onPress(category.title)}
    >
      <Text className="text-subheading-bold text-white mb-4 text-center">
        {category.title}
      </Text>
      {category.icon && (
        <Image
          source={category.icon}
          className="w-20 h-20 mb-4"
          resizeMode="contain"
        />
      )}
      <Text className="text-body-medium-regular text-white text-center opacity-90">
        {category.description}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;
