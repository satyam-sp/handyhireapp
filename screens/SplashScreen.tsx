// SplashScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import WorkerSVG from '../assets/svgs/worker-log.svg'; // Your actual SVG
import { getStorageData } from '../utils/storage-helper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { loadAndSetInitialLanguage } from '../utils/helper';
import { useTranslation } from 'react-i18next';

const SplashScreen = () => {


  type NavigationProp = NativeStackNavigationProp<any>;
  const navigation = useNavigation<NavigationProp>();

  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  useEffect(() => {
    const setupLanguage = async () => {
      await loadAndSetInitialLanguage();
      setLoading(false);
    };
    setupLanguage();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // show splash for 1.5s
      try {
        const employee = await getStorageData('employee');
        if (!!employee) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'EmployProfile' }]
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }]
          });
        }
      } catch (e) {
        navigation.navigate('Welcome');
      }
    };

    checkAuth();
  }, []);


  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <Animatable.View animation="bounceIn" duration={1500}>
        <WorkerSVG width={200} height={200} />
      </Animatable.View>
      <Animatable.Text animation="fadeInUp" delay={1500} style={styles.title}>
        <Text>{t('appName')}</Text>

      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={1800} style={styles.subtitle}>
        {t('tagline')}
      </Animatable.Text>
      <ActivityIndicator size="small" style={{ marginTop: 20 }} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  }
});
