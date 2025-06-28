import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const sampleImage = require('../../assets/sample_map.png'); // Confirm path

const StaticRoute = () => {
  return (
    <View style={styles.container}>
      <Image
        source={sampleImage}
        style={styles.image}
        resizeMode="contain"
        onError={(e) => {
          console.error('Image failed to load:', e.nativeEvent.error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: 0.5
  },
  image: {
    width: 400,
    height: 200,
    backgroundColor: '#ddd', // Helps you visually see the image area
  },
});

export default StaticRoute;
