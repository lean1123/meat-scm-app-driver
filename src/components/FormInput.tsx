import React from 'react';
import { Text, TextInput } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  className?: string;
};

export default function FormInput({
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  className,
}: Props) {
  return (
    <>
      <TextInput
        className={className}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
      />
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
    </>
  );
}
