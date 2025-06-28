// components/common/ProfileInfoRow.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

/**
 * Reusable component for displaying or editing a profile information row.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the information field.
 * @param {string} props.value - The current value of the field.
 * @param {boolean} [props.editing=false] - Whether the field is in editing mode.
 * @param {function} [props.onChange] - Callback function when the text changes in editing mode.
 * @param {string} [props.keyboardType='default'] - Keyboard type for TextInput.
 */
const ProfileInfoRow = ({ label, value, editing = false, onChange, keyboardType = 'default' }: any) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={label}
          keyboardType={keyboardType}
          placeholderTextColor="#a0a0a0"
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    marginBottom: 12,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
});

export default ProfileInfoRow;
