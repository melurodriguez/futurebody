import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ColorPalette } from '../theme';
import HomeScreen from '../screens/coach/HomeScreen';
import ClientsScreen from '../screens/coach/ClientsScreen';

// Importamos los iconos de Lucide
import { Home, Users, Calendar, BarChart2, User } from 'lucide-react-native';
import CalendarScreen from '../screens/coach/CalendarScreen';
import CoachStatsScreen from '../screens/coach/StatsScreen';
import ProfileScreen from '../screens/coach/ProfileScreen';
import ClientProfileScreen from '../screens/clients/ClientProfileScreen';
import ClientInfoScreen from '../screens/coach/ClientInfoScreen';

const Tab = createBottomTabNavigator();


const CoachTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, 
        tabBarStyle: {
          backgroundColor: ColorPalette.surface, 
          borderTopColor: ColorPalette.border,
          height: 90,          
          paddingBottom: 25,    
          paddingTop: 10,       
          borderTopWidth: 1,    
          elevation: 5
        },
        tabBarActiveTintColor: ColorPalette.primary, 
        tabBarInactiveTintColor: ColorPalette.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent;

          if (route.name === 'Home') IconComponent = Home;
          else if (route.name === 'Clients') IconComponent = Users;
          else if (route.name === 'Calendar') IconComponent = Calendar;
          else if (route.name === 'Stats') IconComponent = BarChart2;
          else if (route.name === 'Profile') IconComponent = User;

          return (
            <IconComponent 
              color={color} 
              size={focused ? 28 : 24} 
              strokeWidth={focused ? 2 : 1.5} 
            />
          );
        },
      })}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Clients' component={ClientsScreen} />
      <Tab.Screen name='Calendar' component={CalendarScreen} />
      <Tab.Screen name='Stats' component={CoachStatsScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default CoachTabs;