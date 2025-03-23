import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/swimmer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token);
        Alert.alert('Succès', 'Connexion réussie !');
        router.push('/dashboard');
      } else {
        setError(data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      console.error("Erreur FETCH :", err);
      setError('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Animated.View 
          entering={FadeInDown.duration(600)} 
          style={styles.content}
        >
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Rejoignez VSJ Natation</Text>

          {error && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#93C5FD"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#93C5FD"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin} 
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#60A5FA', '#3B82F6']}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <AntDesign name="lock" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Se connecter</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={() => Alert.alert('Google Login', 'Connexion avec Google en cours...')}
            activeOpacity={0.8}
          >
            <AntDesign name="google" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.googleText}>Connexion Google</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#E0F2FE',
    opacity: 0.9,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 16,
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
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DB4437',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  googleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoginScreen;