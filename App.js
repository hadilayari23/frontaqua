import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Welcome, Login, Devices } from './Screens';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const user = await SecureStore.getItemAsync('user');
        if (user) {
          setIsLoggedIn(true);
          console.log('User is logged in:', user);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoggedIn();

    setTimeout(() => {
      setShowWelcome(false);
    }, 2000); // 2 seconds delay

  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {showWelcome && <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />}
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
          {props => <MainTabs {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('user');
      console.log("User data successfully deleted.");
      
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Logout", onPress: logout }
      ],
      { cancelable: false }
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Devices') {
            iconName = 'mobile';
          } else if (route.name === 'Logout') {
            iconName = 'sign-out';
          } 

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Devices" 
        component={Devices} 
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            handleLogout();
          }
        }}
      /> 
    </Tab.Navigator>
  );
}

function LogoutScreen() {
  return null;
}
