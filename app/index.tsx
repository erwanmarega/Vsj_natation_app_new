import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import "../global.css"


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    console.log(isLogin ? 'Connexion avec' : 'Inscription avec', email, password);
  };

  const handleGoogleLogin = () => {
    console.log('Connexion avec Google');
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-5">
      <View className="items-center mb-5">
        <Text className="text-2xl font-bold">{isLogin ? 'Se connecter' : 'S\'inscrire'}</Text>
        <Text className="text-gray-500 text-lg">Bienvenue chez VSJ Natation !</Text>
      </View>

      <View className="flex-row mb-5 border-b border-gray-300">
        <TouchableOpacity onPress={() => setIsLogin(true)} className={`p-2 ${isLogin ? 'border-b-2 border-blue-500' : ''}`}>
          <Text className={isLogin ? 'text-blue-500 font-bold' : 'text-gray-500 font-bold'}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(false)} className={`p-2 ${!isLogin ? 'border-b-2 border-blue-500' : ''}`}>
          <Text className={!isLogin ? 'text-blue-500 font-bold' : 'text-gray-500 font-bold'}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
      
      <Text className="self-start text-sm font-bold mb-1">Email</Text>
      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4"
        placeholder="vsjnatation@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <Text className="self-start text-sm font-bold mb-1">Mot de passe</Text>
      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4"
        placeholder="••••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity className="w-full bg-blue-500 py-3 rounded-lg items-center mb-3" onPress={handleLogin}>
        <Text className="text-white font-bold">{isLogin ? 'Se connecter' : 'S\'inscrire'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row items-center border border-gray-300 py-3 rounded-lg w-full justify-center" onPress={handleGoogleLogin}>
        <AntDesign name="google" size={20} color="#DB4437" />
        <Text className="ml-2 font-bold"> Se connecter avec Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
