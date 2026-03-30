import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ColorPalette } from '../theme';

import HomeScreen from '../app/profesional/HomeScreen';
import AgendaScreen from '../app/profesional/AgendaScreen';
import ClientScreen from '../app/profesional/ClientScreen';
import StatsScreen from '../app/profesional/StatsScreen';

const Tab = createBottomTabNavigator();

const BottomBar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home"
              size={24}
              color={focused ? ColorPalette.primary : '#999'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Clients"
        component={ClientScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="people"
              size={24}
              color={focused ? ColorPalette.primary : '#999'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Add"
        component={View} // pantalla dummy
        options={{
          tabBarButton: () => <CustomAddButton />,
        }}
      />

      <Tab.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="calendar"
              size={24}
              color={focused ? ColorPalette.primary : '#999'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="stats-chart"
              size={24}
              color={focused ? ColorPalette.primary : '#999'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomBar;



const CustomAddButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Icon name="add" size={28} color="#FFF" />
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 70,
    borderTopWidth: 0,
    elevation: 10,
    backgroundColor: ColorPalette.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  addButton: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ColorPalette.primary,
    elevation: 5,
  },
});