import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Colors } from '../../screens/users/styles'; // Assuming this import is correct

const { width } = Dimensions.get('window');

// Dummy User Data
const dummyUsers = [
  { id: '1', name: 'Alice', imageUri: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '2', name: 'Bob', imageUri: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: '3', name: 'Charlie', imageUri: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', name: 'Diana', imageUri: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'Eve', imageUri: 'https://randomuser.me/api/portraits/women/5.jpg' },
];

interface TooltipState {
  visible: boolean;
  name: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
}

const UserProfileCarousel: React.FC = () => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    name: null,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade animation
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

  const handleProfilePress = (userName: string, event: any) => {
    // Clear any existing timeout immediately when a new tap occurs
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Measure the layout of the tapped component to position the tooltip accurately
    event.target.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      if (tooltip.visible && tooltip.name === userName) {
        // If the same user is tapped and tooltip is visible, hide it
        hideTooltip();
      } else {
        // Show tooltip for the new user
        setTooltip({
          visible: true,
          name: userName,
          x: px, // X position on screen
          y: py, // Y position on screen
          width: width,
          height: height,
        });
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();

        // Set a new timeout to hide the tooltip after 1 second
        hideTimeoutRef.current = setTimeout(() => {
          hideTooltip();
        }, 1000);
      }
    });
  };

  const hideTooltip = () => {
    // Clear timeout if hideTooltip is called manually (e.g., by tapping same profile again)
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setTooltip({ visible: false, name: null, x: 0, y: 0, width: 0, height: 0 });
    });
  };

  return (
    <>
      <View style={styles.profileContainer}>
        {dummyUsers.map((user, index) => {
          const overlapThreshold = 1;
          const overlapAmount = -10; // pixels of overlap

          const profileStyle = [
            styles.profileImageWrapper,
            index > 0 && index < overlapThreshold && { marginLeft: 5 },
            index >= overlapThreshold && { marginLeft: overlapAmount },
            { zIndex: dummyUsers.length - index }, // Ensure later profiles are on top
          ];

          return (
            <TouchableOpacity
              key={user.id}
              onPress={(event) => handleProfilePress(user.name, event)}
              style={profileStyle}
            >
              <Image source={{ uri: user.imageUri }} style={styles.profileImage} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* The Tooltip */}
      {tooltip.visible && (
        <Animated.View
          style={[
            styles.tooltip,
            {
              left: tooltip.x + tooltip.width / 2 - 78, // Center tooltip above the profile
              top: -20, // Position above the profile (adjust as needed for your layout)
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.tooltipText}>{tooltip.name}</Text>
          <View style={styles.tooltipArrow} />
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // ... (Your existing styles remain the same)
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 15,
  },
  profileImageWrapper: {
    width: 38,
    height: 38,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CCC',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 999,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0,0,0,0.8)',
    transform: [{ translateX: -4 }],
  },
});

export default UserProfileCarousel;