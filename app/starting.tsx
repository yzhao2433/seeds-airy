import React from 'react';
import { View, Image, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import globalFont from '../styles/globalfont';
import { router } from 'expo-router';



const StartingPage = () => {
  return (
    <ImageBackground source={require('@/assets/images/startingpage_start.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <Text style={[styles.airText, globalFont.Nunito]}>airy</Text>
          </View>
          <View style={styles.middleSection}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logoImage} />
            <Text style={[styles.tagline, globalFont.Nunito]}>The mental health app guaranteed to reduce your stress!</Text>
          </View>
          <View style={styles.bottomSection}>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => router.navigate('/login')}>
                <Text style={[styles.buttonText, globalFont.Nunito]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => router.navigate('/signup')}>
                <Text style={[styles.buttonText,globalFont.Nunito]}>SignUp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  topSection: {
    marginBottom:-60,
  },
  middleSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  bottomSection: {
    justifyContent: 'flex-end',
  },
  airText: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4F759B',
  },
  logoImage: {
    width: 800,
    height: 275,
    resizeMode: 'contain',
  },
  tagline: {
    textAlign: 'center',
    color: '#4F759B',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 15,
    lineHeight: 32
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FFE785',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius:8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  loginButton: {
    marginRight: -25, // Adjust spacing between buttons
  },
  buttonText: {
    color: '#4F759B',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },
});

export default StartingPage;
