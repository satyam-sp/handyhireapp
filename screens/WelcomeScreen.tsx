// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import LogoSVG from '../assets/svgs/logo.svg'; // Your actual SVG
import { useTranslation } from 'react-i18next';

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Animatable.Text animation="bounceIn" style={styles.logo}>
          <LogoSVG />
        </Animatable.Text>
        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.description}>
          {t('welcome.description')}
        </Text>
      </View>

      <Image
        source={require('../assets/worker.png')} // Place the transparent image as `worker.png` inside `assets` folder
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.actionPanel}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>{t('welcome.hireButton')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EmployeePanel')}
        >
          <Text style={styles.buttonText}>{t('welcome.panelButton')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionPanel: {
    bottom: 100,
    width: '100%',
    position: 'absolute'
  },



  innerContainer: {
    position: 'relative',
    bottom: 200

  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginRight: 50
  },
  logoImage: {
    marginTop: 50,
    position: 'relative'
  },
  logoText: {
    fontSize: 24,
    bottom: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    alignSelf: 'flex-start',

  },
  image: {
    width: 350,
    height: 450,
    marginBottom: 0,
    marginTop: 250,
    marginLeft: 140,
    position: 'absolute',
    zIndex: 99999
  },
  button: {
    backgroundColor: '#f8e71c',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '70%',
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default WelcomeScreen;
