import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface ChatInputPanelProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInputPanel({
  onSendMessage,
  placeholder = '메시지 보내기...',
  disabled = false,
}: ChatInputPanelProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <View className="bg-white border-t border-stroke px-4 py-2">
      <View className="flex-row items-center">
        {/* 텍스트 입력 영역 */}
        <View className="flex-1 bg-gray rounded-2xl px-4 py-1 mr-3 min-h-12 max-h-[100px]">
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            placeholderTextColor="#8899A8"
            multiline
            textAlignVertical="center"
            style={{
              fontSize: 16,
              lineHeight: 20,
              color: '#000',
              minHeight: 20,
              maxHeight: 80,
            }}
            editable={!disabled}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
        </View>

        {/* 전송 버튼 */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          className={`w-12 h-12 rounded-full justify-center items-center ${
            canSend ? 'bg-mango-red' : 'bg-text-secondary'
          }`}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
