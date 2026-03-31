import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ColorPalette } from '../theme';
import HomeScreen from '../screens/coach/HomeScreen';
import ClientsScreen from '../screens/coach/ClientsScreen';

// Importamos los iconos de Lucide
import { Home, Users, Calendar, BarChart2, User } from 'lucide-react-native';
import CalendarScreen from '../screens/coach/CalendarScreen';

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
          height: 70,
          paddingVertical: 10,
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
              size={focused ? 28 : 24} // El icono crece un poco al estar activo
              strokeWidth={focused ? 2 : 1.5} 
            />
          );
        },
      })}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Clients' component={ClientsScreen} />
      <Tab.Screen name='Calendar' component={CalendarScreen} />
      <Tab.Screen name='Stats' component={HomeScreen} />
      <Tab.Screen name='Profile' component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default CoachTabs;