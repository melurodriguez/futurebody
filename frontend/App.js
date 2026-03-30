import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './app/profesional/HomeScreen'
import BottomBar from './navigation/BottomBar';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from './app/profesional/ProfileScreen';

export default function App() {
  return (
    <NavigationContainer>
        <StatusBar style="auto" />
        {/* <HomeScreen/> */}
        {/* <BottomBar/> */}
        <ProfileScreen/>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
