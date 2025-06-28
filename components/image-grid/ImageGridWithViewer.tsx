// ImageGridWithViewer.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';

// Removed numColumns as it's now a horizontal list
const screenWidth = Dimensions.get('window').width;
const GAP = 8; // consistent spacing
// Adjusted imageSize for horizontal scroll, each image now takes up more space for better visibility
// For horizontal scroll, often you want images to be a bit larger, perhaps 2 or 2.5 per screen
const imageSize = (screenWidth - GAP * 3) / 2.2; // Show approx 2.2 images at once with gaps

const ImageGridWithViewer = ({images}: any) => {
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setViewerVisible(true);
  };

  const imageView = useMemo(() => {
     return  <ImageViewing
     images={images?.map((img: any) => ({ uri: img.url }))}
     imageIndex={currentIndex}
     visible={isViewerVisible}
     onRequestClose={() => setViewerVisible(false)}
     animationType="slide" // This animation is for the full-screen viewer, not the list itself
   />
  },[currentIndex, isViewerVisible])

  return (
    <>
      <FlatList
        data={images}
        // Key change: make the FlatList horizontal
        horizontal={true}
        // Optional: shows horizontal scroll indicator
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.horizontalGrid} // Apply new horizontal styling
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openViewer(index)} style={styles.imageWrapper}>
            <Image source={{ uri: item.url }} style={styles.image} />
          </TouchableOpacity>
        )}
      />
      {imageView}
    </>
  );
};

const styles = StyleSheet.create({
  // New style for the horizontal FlatList container
  horizontalGrid: {
    paddingHorizontal: GAP, // Padding at the start/end of the horizontal list
    paddingVertical: GAP / 2, // Small vertical padding
  },
  imageWrapper: {
    marginRight: GAP, // Space between images
    // Remove margin for numColumns calculation, handle spacing with marginRight
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 10, // Slightly more rounded corners for a modern look
    resizeMode: 'cover', // Ensure images cover the area well
  },
});

export default ImageGridWithViewer;
