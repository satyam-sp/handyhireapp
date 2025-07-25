// src/components/InfoTooltip.tsx
import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, Animated, Easing } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface InfoTooltipProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  // Positioning props for where the tooltip should appear relative to the screen
  targetX: number; // X coordinate of the trigger element
  targetY: number; // Y coordinate of the trigger element
  // Optional offset for fine-tuning position
  offsetX?: number;
  offsetY?: number;
  closeDelay?: number;
  tooltipWidth?: number;
}

const TOOLTIP_WIDTH = 200; // Fixed width for the tooltip
const TOOLTIP_HEIGHT_ESTIMATE = 100; // Estimate height for initial positioning (content might vary)

const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  isVisible, 
  onClose, 
  children, 
  targetX, 
  targetY, 
  offsetX = 0, 
  offsetY = 0, 
  tooltipWidth= 200,
  closeDelay = 10000
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in/out animation

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isVisible) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200, // Quick fade-in
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();

      // Set timeout to close automatically
      timer = setTimeout(() => {
        // Fade out animation before closing
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300, // Slightly longer fade-out
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => onClose()); // Call onClose after fade-out completes
      }, (closeDelay));
    } else {
      // Reset animation value when not visible
      fadeAnim.setValue(0);
    }

    return () => {
      clearTimeout(timer); // Clear timeout if component unmounts or visibility changes
    };
  }, [isVisible, fadeAnim, onClose]);

  if (!isVisible) {
    return null;
  }

  // Calculate tooltip position to appear below and slightly to the left/right of the trigger
  // Adjust these values to position the tooltip exactly where you want it relative to the icon.
  const tooltipLeft = Math.max(
    10, // Minimum left margin
    Math.min(
      targetX + offsetX - (TOOLTIP_WIDTH / 2), // Try to center it below the target horizontally
      screenWidth - TOOLTIP_WIDTH - 10 // Maximum right margin
    )
  );

  const tooltipTop = targetY + offsetY + 20; // 20 units below the target icon

  return (
    <Modal
      animationType="none" // Controlled by Animated.timing
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // For Android back button
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.tooltipContainer,
              { top: tooltipTop, left: tooltipLeft, opacity: fadeAnim, width: tooltipWidth }
            ]}
          >
            <TouchableWithoutFeedback>
              <View style={styles.tooltipContent}>
                {children}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.0)', // Fully transparent overlay so clicks pass through unless on tooltip
    justifyContent: 'flex-start', // Align content to top
    alignItems: 'flex-start', // Align content to left
  },
  tooltipContainer: {
    position: 'absolute',
    // Add maxHeight if you expect long content and want scrollability
    // maxHeight: screenHeight * 0.4,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1, // Add a border as requested
    borderColor: '#eee', // Light grey border
  },
  tooltipContent: {
    // Styles for content inside the tooltip if needed
  },
});

export default InfoTooltip;