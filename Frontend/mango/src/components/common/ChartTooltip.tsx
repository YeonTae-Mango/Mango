import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { chartTooltips, tooltipStyles } from '../../utils/chartTooltips';

interface ChartTooltipProps {
  type: 'time' | 'category' | 'month' | 'keyword' | 'history' | 'twoType' | 'twoCategory' | 'twoKeyword' | 'twoTime';
  enabled?: boolean;
}

export default function ChartTooltip({ type, enabled = true }: ChartTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!enabled) return null;

  const tooltipData = chartTooltips[type];

  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);
  };

  const handleOutsidePress = () => {
    setShowTooltip(false);
  };

  return (
    <View className="px-4 mt-4">
      <View className="flex-row items-start justify-start">
        <View className="relative">
          <TouchableOpacity
            className="items-center justify-center"
            style={{
              width: tooltipStyles.button.size,
              height: tooltipStyles.button.size,
              backgroundColor: tooltipStyles.button.backgroundColor,
              borderRadius: tooltipStyles.button.borderRadius,
            }}
            onPress={handleTooltipToggle}
          >
            <Text className="text-white text-lg font-bold">?</Text>
          </TouchableOpacity>
          
          {/* 툴팁 메시지 */}
          {showTooltip && (
            <View 
              className="absolute z-20 mt-10 w-60"
              style={{
                backgroundColor: tooltipStyles.content.backgroundColor,
                borderRadius: tooltipStyles.content.borderRadius,
                padding: tooltipStyles.content.padding,
                maxWidth: tooltipStyles.content.maxWidth,
              }}
            >
              <Text style={tooltipStyles.text.title}>
                {tooltipData.title}
              </Text>
              <Text style={tooltipStyles.text.content}>
                {tooltipData.content}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* 툴팁이 표시될 때만 외부 터치 감지 */}
      {showTooltip && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View 
            className="absolute inset-0 z-10"
            style={{ backgroundColor: 'transparent' }}
          />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
