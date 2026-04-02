import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginForm from './components/LoginForms';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import CoachTabs from './navigation/CoachTabs';
import ClientInfoScreen from './screens/coach/ClientInfoScreen';
import { ColorPalette } from './theme';
import { useAuthStore } from './apis/useAuthStore';
import ClientTabs from './navigation/ClientTabs';

const Stack = createNativeStackNavigator();

export default function App() {

  const token = useAuthStore((state) => state.token);
  const user= useAuthStore((state)=> state.user)

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: ColorPalette.background } 
          }}
        >
         {token ? (
              user?.rol === 'profesional' ? (
                  <Stack.Screen name="Main" component={CoachTabs} />
              ) : (
                  <Stack.Screen name="Main" component={ClientTabs} />
              )
          ) : (
              <Stack.Screen name="Login" component={LoginForm} />
          )}

          {/* Pantallas de Detalle (Fuera de los Tabs para ocultar la barra inferior) */}
          <Stack.Screen 
            name='InfoClient' 
            component={ClientInfoScreen} 
            options={{
              headerShown: true,
              headerTitle: 'Detalle del Cliente',
              headerTintColor: ColorPalette.primary,
              headerStyle: { backgroundColor: ColorPalette.surface },
              headerShadowVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}