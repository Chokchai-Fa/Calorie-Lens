import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { store } from './store';

import './global.css';

import DashboardScreen from './screens/DashboardScreen';
import TrackFoodScreen from 'screens/TrackFoodScreen';
import SugesstionScreen from 'screens/SuggestionScreen';
import ReminderScreen from 'screens/ReminderScreen';
import SettingScreen from 'screens/SettingScreen';


import CameraScreen from './screens/CameraScreen';
import FoodDetailsScreen from './screens/FoodDetailsScreen';

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

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TrackFood') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'Suggestion') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'Reminder') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="TrackFood" component={TrackFoodScreen} />
      <Tab.Screen name="Suggestion" component={SugesstionScreen} />
      <Tab.Screen name="Reminder" component={ReminderScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
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
