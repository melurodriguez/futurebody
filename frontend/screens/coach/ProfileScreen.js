import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';
import { useAuthStore } from '../../apis/useAuthStore';
import { Alert } from 'react-native';


export default function ProfileScreen() {
  const [isAvailable, setIsAvailable] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

 const handleLogout = () => {
  Alert.alert(
    "Cerrar Sesión", 
    "¿Estás seguro de que quieres salir?", 
    [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Salir", 
        style: "destructive", 
        onPress: () => {
          logout();

        } 
      }
    ]
  );
};

  const menuItems = [
    { id: '1', title: 'Información Personal', icon: 'user' },
    { id: '2', title: 'Mi Suscripción', icon: 'credit-card' },
    ...(user?.rol === 'profesional' ? [
        { id: '3', title: 'Configurar Horarios', icon: 'clock' },
        { id: '4', title: 'Documentación y Títulos', icon: 'file-text' }, 
    ] : [
        { id: '5', title: 'Mis Objetivos', icon: 'target' },
        { id: '6', title: 'Historial de Entrenamientos', icon: 'activity' },
    ]),
  ];

  if (!user) return null;

  const renderSettingRow = (title, icon, value, onValueChange) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={18} color={ColorPalette.accent} />
        </View>
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ false: ColorPalette.border, true: ColorPalette.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={ColorPalette.border}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header / Avatar Section */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBorder}>
            <View style={styles.avatarInner}>
              {/* Usamos la primera letra del alias o email */}
              <Text style={styles.avatarLetter}>
                {(user.alias || user.email).charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="camera" size={14} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        {/* Datos dinámicos del Store */}
        <Text style={styles.userName}>{user.alias || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <View style={styles.badge}>
          <Feather name={user.rol === 'coach' ? "star" : "user"} size={12} color={ColorPalette.accent} />
          <Text style={styles.badgeText}>
            {user.rol === 'cliente' ? 'Miembro FutureBody' : 'Coach Certificado'}
          </Text>
        </View>
      </View>

      {/* Quick Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado</Text>
        <View style={styles.card}>
          {user.rol === 'coach' && (
            <>
              {renderSettingRow('Disponible para turnos', 'eye', isAvailable, setIsAvailable)}
              <View style={styles.divider} />
            </>
          )}
          {renderSettingRow('Notificaciones Push', 'bell', notifications, setNotifications)}
        </View>
      </View>

      {/* Main Menu Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.settingInfo}>
                  <View style={styles.iconContainer}>
                    <Feather name={item.icon} size={18} color={ColorPalette.accent} />
                  </View>
                  <Text style={styles.settingText}>{item.title}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={ColorPalette.textMuted} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#F87171" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>FutureBody v1.0.4 - 2026</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorPalette.background },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: ColorPalette.surface, // Cambiado de #FFF
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  avatarWrapper: { marginBottom: 15 },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: ColorPalette.primary,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: ColorPalette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: { fontSize: 36, fontWeight: '800', color: ColorPalette.accent },
  editButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: ColorPalette.primary,
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: ColorPalette.surface, // Cambiado de #FFF
  },
  userName: { fontSize: 22, fontWeight: '800', color: ColorPalette.textPrimary, marginTop: 10 },
  userEmail: { fontSize: 14, color: ColorPalette.textSecondary, marginTop: 4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorPalette.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 15,
    gap: 6,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: ColorPalette.accent },

  section: { paddingHorizontal: 24, marginTop: 30 },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: ColorPalette.textSecondary, 
    textTransform: 'uppercase', 
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4
  },
  card: {
    backgroundColor: ColorPalette.surface, // Cambiado de #FFF
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: ColorPalette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingText: { fontSize: 16, fontWeight: '600', color: ColorPalette.textPrimary },
  divider: { height: 1, backgroundColor: ColorPalette.border },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 10,
    paddingBottom: 10
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#F87171' }, // Un rojo más suave para dark mode
  versionText: {
    textAlign: 'center',
    color: ColorPalette.textMuted,
    fontSize: 12,
    marginTop: 30,
    marginBottom: 60, // Espacio extra para el Bottom Bar alto
  }
});