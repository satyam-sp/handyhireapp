import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const IconButton = ({ onPress, title, imageSource }: any) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image style={styles.image} source={imageSource} resizeMode="contain" />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 2,
  },
  text: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
    textAlign: 'left',
  },
});

export default IconButton;
