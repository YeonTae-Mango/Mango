import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface BirthdateFormProps {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
}

export default function BirthdateForm({
  value,
  onChangeText,
  error,
}: BirthdateFormProps) {
  // 만 19세 이상만 가입 가능하도록 최대 날짜 설정 (현재 날짜 기준 19년 전)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 19,
      today.getMonth(),
      today.getDate()
    );
    return maxDate;
  };

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
    <View className="flex-1 pt-10">
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
          <Text
            className={`text-base ${value ? 'text-text-primary' : 'text-secondary'}`}
          >
            {value || 'YYYY / MM / DD'}
          </Text>
        </TouchableOpacity>
        {error && (
          <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text>
        )}
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
          maximumDate={getMaxDate()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </View>
  );
}
