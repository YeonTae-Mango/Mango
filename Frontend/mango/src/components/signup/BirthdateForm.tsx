import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface BirthdateFormProps {
  value: string;
  onChangeText: (value: string) => void;
}

export default function BirthdateForm({ value, onChangeText }: BirthdateFormProps) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year} / ${month} / ${day}`;
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    onChangeText(formatDate(currentDate));
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View className="flex-1 pt-20">
      {/* 안내 문구 */}
      <View className="mb-16">
        <Text className="text-heading-bold text-text-primary text-center">
          생년월일을 작성해주세요
        </Text>
      </View>

      {/* 날짜 선택 버튼 */}
      <View>
        <TouchableOpacity
          className="h-14 bg-gray rounded-xl px-4 justify-center"
          onPress={showDatepicker}
        >
          <Text className={`text-base ${value ? 'text-text-primary' : 'text-secondary'}`}>
            {value || 'YYYY / MM / DD'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </View>
  );
}
