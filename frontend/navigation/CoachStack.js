import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CoachTabs from './CoachTabs'; // Tu archivo actual de Tabs
import ClientInfoScreen from '../screens/coach/ClientInfoScreen';

const Stack = createNativeStackNavigator();

export const CoachStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. Las Tabs son la base */}
      <Stack.Screen name="MainTabs" component={CoachTabs} />
      
      {/* 2. Pantallas de detalle "Full Screen" (Sin Tabs abajo) */}
      <Stack.Screen 
        name="InfoClient" 
        component={ClientInfoScreen} 
        options={{ 
          headerShown: true, 
          title: 'Detalle del Cliente',
          headerBackTitle: 'Volver' 
        }} 
      />
    </Stack.Navigator>
  );
};