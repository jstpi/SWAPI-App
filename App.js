/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NativeBaseProvider } from 'native-base';
import { enableExperimentalWebImplementation, GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  Home, Like,
} from './src/views';

const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache(),
});

enableExperimentalWebImplementation(true);

const Tab = createBottomTabNavigator();

// eslint-disable-next-line react/function-component-definition, react/prop-types
const tabBarIcon = (route) => ({ focused, color, size }) => {
  let iconName;

  if (route.name === 'Episodes') {
    iconName = focused
      ? 'ios-list'
      : 'ios-list-outline';
  } else if (route.name === 'Characters') {
    iconName = focused ? 'heart' : 'heart-outline';
  }

  // You can return any component that you like here!
  return <Ionicons name={iconName} size={size} color={color} />;
};

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <NavigationContainer>
                <Tab.Navigator screenOptions={({ route }) => ({
                  tabBarIcon: tabBarIcon(route),
                  tabBarActiveTintColor: 'black',
                  tabBarInactiveTintColor: 'gray',
                })}
                >
                  <Tab.Screen name="Episodes" component={Home} />
                  <Tab.Screen name="Characters" component={Like} />
                </Tab.Navigator>
              </NavigationContainer>
            </SafeAreaView>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
