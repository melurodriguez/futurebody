import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Calendar, Activity, User, Target } from 'lucide-react-native'; // O Feather según uses
import { ColorPalette } from '../theme';
import HomeScreen from "../screens/clients/HomeScreen";
import ClientProfileScreen from "../screens/clients/ClientProfileScreen";
import ProgressScreen from "../screens/clients/ProgressScreen";
import AppointmentsScreen from '../screens/clients/AppointmentScreen'
import GoalsScreen from "../screens/clients/GoalsScreen";

const Tab = createBottomTabNavigator();

const ClientTabs = () => {
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
                    elevation: 5,
                    position: 'absolute', 
                },
                tabBarActiveTintColor: ColorPalette.primary,
                tabBarInactiveTintColor: ColorPalette.textSecondary,
                tabBarIcon: ({ color, size, focused }) => {
                    let IconComponent;

                    if (route.name === 'Home') IconComponent = Home;
                    else if (route.name === 'Turnos') IconComponent = Calendar; // Para sacar/cancelar turnos
                    else if (route.name === 'Progreso') IconComponent = Activity; // Para medidas
                    else if (route.name === 'Objetivos') IconComponent = Target; // Para metas
                    else if (route.name === 'Profile') IconComponent = User;

                    return (
                        <IconComponent 
                            color={color} 
                            size={focused ? 28 : 24} 
                            strokeWidth={focused ? 2.5 : 1.5} 
                        />
                    );
                },
            })}
        >
            <Tab.Screen name='Home' component={HomeScreen} />
            
            {/* Gestión de turnos: disponibilidad y cancelación */}
            <Tab.Screen name='Turnos' component={AppointmentsScreen} /> 
            
            {/* Visualización de medidas y evolución */}
            <Tab.Screen name='Progreso' component={ProgressScreen} /> 
            
            {/* Gestión de metas personales */}
            <Tab.Screen name='Objetivos' component={GoalsScreen} /> 
            
            {/* Gestión de perfil (el que ya vinculamos a Zustand) */}
            <Tab.Screen name='Profile' component={ClientProfileScreen} />
        </Tab.Navigator>
    );
};

export default ClientTabs;