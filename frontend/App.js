import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from './components/LoginForms';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import CoachTabs from './navigation/CoachTabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ColorPalette } from './theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: ColorPalette.background }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Login' component={LoginForm} />
          <Stack.Screen name='Main' component={CoachTabs} />
          <Stack.Screen name='forgot-password' component={ForgotPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}