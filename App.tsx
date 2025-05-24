import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { store } from './store';

import './global.css';

import { HubScreen } from './screens/HubScreen';
import { QuestsScreen } from './screens/QuestsScreen';
import { LogbookScreen } from './screens/LogbookScreen';
import { CharacterScreen } from './screens/CharacterScreen';
import { CameraScreen } from './screens/CameraScreen';
import { FoodDetailsScreen } from './screens/FoodDetailsScreen';

// Create stack and tab navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// TabNavigator component to hold all the main tabs
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Hub') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Quests') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Logbook') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Character') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Hub" component={HubScreen} />
      <Tab.Screen name="Quests" component={QuestsScreen} />
      <Tab.Screen name="Logbook" component={LogbookScreen} />
      <Tab.Screen name="Character" component={CharacterScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen} 
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="FoodDetails" 
            component={FoodDetailsScreen} 
            options={{ 
              headerShown: false,
            }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}
