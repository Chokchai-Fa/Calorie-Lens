import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import './global.css';

import { HubScreen } from './screens/HubScreen';
import { QuestsScreen } from './screens/QuestsScreen';
import { LogbookScreen } from './screens/LogbookScreen';
import { CharacterScreen } from './screens/CharacterScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
