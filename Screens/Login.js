import React, { useState } from 'react';
import { Text, View, Image, StatusBar, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const login = async () => {
    try {
      const result = await axios.post(`http://192.168.1.17:4000/user/login`, {
        email: email,
        password: password
      });

      if (result.data.success === true) {
        const jsonValue = JSON.stringify(result.data.data);
        await SecureStore.setItemAsync('user', jsonValue);
        navigation.replace('MainTabs',{ screen: 'Devices' }); // Remplacer par 'replace'
        
      } else {
        // Utilisation d'une boîte de dialogue pour afficher le message d'erreur
        showAlert(result.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      // Utilisation d'une boîte de dialogue pour afficher l'erreur
      showAlert('Une erreur est survenue lors de la connexion.');
    }
  };

  const showAlert = (message) => {
    Alert.alert(
      'Error',
      message,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
  };

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image className="h-full w-full absolute " source={require("../assets/background1.png")} />

      {/* Titre et formulaire */}
      <View className="h-full w-full flex justify-around pt-40 pb-10">
        <View className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <Text className="text-center font-bold tracking-wide text-5xl text-white">Login</Text>
        </View>
        
        {/* Formulaire */}
        <View className="flex items-center mx-4 space-y-4 mt-20 pt-20" style={{ top: 75 }}>
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput
              placeholder='Email'
              placeholderTextColor={'black'}
              value={email}
              onChangeText={setEmail}
              required
            />
          </View>
          <View className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput
              secureTextEntry
              placeholder='Password'
              placeholderTextColor={'black'}
              value={password}
              onChangeText={setPassword}
              required
            />
          </View>
          <View className="w-full">
            <TouchableOpacity
              onPress={login}
              className="w-full  p-3 rounded-2xl mb-3 bg-sky-600"
            >
              <Text className="text-center text-white text-xl font-bold">Login</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <Text className="text-center">Welcome Back! Dive into Your Smart Aquaculture Dashboard</Text>
          </View>
        </View>
      </View>
    </View> 
  );
};

export default Login;
