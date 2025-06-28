import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';

const ImageCheckbox = ({ value, label, imageSource, selected, onChange }: any) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={() => onChange(value)}
    >
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 1,
    borderRadius: 10,
    borderWidth: 2,
    height: 125,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f0ff',
  },
  image: {
    width: 90,
    height: 80,
    marginBottom: 8,
  },
  label: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
});

export default ImageCheckbox;
