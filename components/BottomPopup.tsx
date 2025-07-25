import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';

const { height } = Dimensions.get('window');

const BottomPopup = ({ visible, slideAnim, handleVisible, children, title }: any) => {
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true
    }).start(() => handleVisible(false));
  };

  return (<Modal transparent visible={visible} animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={closeModal} activeOpacity={1}>
          <Animated.View
            style={[
              styles.popup,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.handle} />
            <Text style={styles.popupTitle}>{title}</Text>
            {children}
            {/* Add any content here */}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
  );
};

export default BottomPopup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  openButton: {
    padding: 16,
    backgroundColor: '#f8e71c',
    borderRadius: 12
  },
  openButtonText: {
    fontWeight: '600'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },
  popup: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40
  },
  handle: {
    width: 50,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 10
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 10
  },
  closeButtonText: {
    textAlign: 'center',
    fontWeight: '600'
  }
});
