// components/AppLoader.tsx

import React from 'react';
import { Modal, View, StyleSheet, Platform } from 'react-native';
// import LottieView from 'lottie-react-native';
// import { BlurView } from '@react-native-community/blur';

const AppLoader = ({ loading = false }) => {
    return (
        <Modal visible={loading} transparent animationType="fade">
            <View style={styles.overlay}>
                {/* {Platform.OS === 'ios' ? (
          <BlurView style={styles.blurView} blurType="light" blurAmount={10} />
        ) : (
          <View style={styles.fallbackBlur} />
        )} */}

                <View style={styles.fallbackBlur} />
                {/* <LottieView
                    source={require('../../assets/lottie/Square Loader.json')} // <- Replace with your own Lottie JSON
                    autoPlay
                    loop
                    style={styles.loader}
                /> */}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blurView: {
        ...StyleSheet.absoluteFillObject,
    },
    fallbackBlur: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    loader: {
        width: 150,
        height: 150,
    },
});

export default AppLoader;
