import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6']}
      style={styles.container}
    >
      <Animated.View 
        entering={FadeInDown.duration(600)}
        style={styles.content}
      >
        <Image 
          source={require('../assets/images/Logo_3D.png')}
          style={styles.logo}
        />
        
        <Text style={styles.title}>
          VSJ Natation
        </Text>
        
        <Text style={styles.subtitle}>
          Plongez dans l'excellence
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#60A5FA', '#3B82F6']}
            style={styles.buttonGradient}
          >
            <Ionicons 
              name="log-in-outline" 
              size={24} 
              color="#fff" 
              style={styles.buttonIcon} 
            />
            <Text style={styles.buttonText}>Commencer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 32,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#E0F2FE',
    marginBottom: 48,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  button: {
    width: '85%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginRight: 12,
  },

});

export default HomeScreen;