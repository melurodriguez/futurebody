import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';
import { useAuthStore } from '../../apis/useAuthStore';
export default function ClientProfileScreen() {
  // 1. Obtener datos reales de Zustand
  const user = useAuthStore((state) => state.user);

  // Datos de medidas (estos vendrían idealmente de otro store de progreso o del objeto user)
  const clientStats = [
    { label: 'Peso', value: '78.5 kg', icon: 'monitor' },
    { label: 'Altura', value: '1.80 m', icon: 'user' }, 
    { label: 'Racha', value: '12 días', icon: 'zap' },
  ];

  const menuItems = [
    { id: '1', title: 'Historial de Entrenamientos', icon: 'clipboard' },
    { id: '2', title: 'Fotos de Progreso', icon: 'camera' },
    { id: '3', title: 'Conectar Health App', icon: 'watch' },
    { id: '4', title: 'Configuración de Cuenta', icon: 'settings' },
  ];

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

  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header con Perfil del Cliente */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBorder}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarLetter}>
                {(user.alias || user.email).charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Nivel 5</Text>
          </View>
        </View>
        
        <Text style={styles.userName}>{user.alias || 'Usuario'}</Text>
        <Text style={styles.userSub}>
          Miembro desde {new Date(user.registered_at).getFullYear()}
        </Text>
      </View>

      {/* Grid de Medidas Rápidas */}
      <View style={styles.statsGrid}>
        {clientStats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Feather name={stat.icon} size={16} color={ColorPalette.accent} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Sección de Mi Coach */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mi Coach</Text>
        <TouchableOpacity style={styles.coachCard} activeOpacity={0.8}>
          <View style={styles.coachInfo}>
            <View style={styles.coachAvatar}>
              <Text style={styles.coachLetter}>A</Text>
            </View>
            <View>
              <Text style={styles.coachName}>Coach Alexander</Text>
              <Text style={styles.coachSpecialty}>Especialista en Hipertrofia</Text>
            </View>
          </View>
          <View style={styles.chatButton}>
            <Feather name="message-circle" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Menú de Opciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad y Progreso</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Feather name={item.icon} size={18} color={ColorPalette.accent} />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={ColorPalette.textMuted} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Botón de Soporte */}
      <TouchableOpacity style={styles.supportButton}>
        <Text style={styles.supportText}>¿Necesitas ayuda? Contactar soporte</Text>
      </TouchableOpacity>

      {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#F87171"  />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
  
        <Text style={styles.versionText}>FutureBody v1.0.4 - 2026</Text>

      <View style={{ marginBottom: 100 }} />


      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorPalette.background },
  header: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 50,
    backgroundColor: ColorPalette.surface,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  avatarContainer: { marginBottom: 15 },
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
  avatarLetter: { fontSize: 32, fontWeight: '800', color: ColorPalette.accent },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: ColorPalette.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: ColorPalette.surface,
  },
  levelText: { color: '#FFF', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  userName: { fontSize: 24, fontWeight: '800', color: ColorPalette.textPrimary, marginTop: 10 },
  userSub: { fontSize: 14, color: ColorPalette.textSecondary, marginTop: 4 },

  statsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 24, 
    marginTop: -30 
  },
  statCard: {
    backgroundColor: ColorPalette.surface,
    width: '30%',
    padding: 15,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: ColorPalette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 15, fontWeight: '800', color: ColorPalette.textPrimary },
  statLabel: { fontSize: 11, color: ColorPalette.textMuted, fontWeight: '600' },

  section: { paddingHorizontal: 24, marginTop: 35 },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: ColorPalette.textSecondary, 
    textTransform: 'uppercase', 
    letterSpacing: 1.2, 
    marginBottom: 12,
    marginLeft: 4
  },
  coachCard: {
    backgroundColor: ColorPalette.surface,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  coachInfo: { flexDirection: 'row', alignItems: 'center' },
  coachAvatar: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: ColorPalette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coachLetter: { fontWeight: '700', color: ColorPalette.accent, fontSize: 18 },
  coachName: { fontSize: 16, fontWeight: '700', color: ColorPalette.textPrimary },
  coachSpecialty: { fontSize: 12, color: ColorPalette.textSecondary },
  chatButton: {
    backgroundColor: ColorPalette.primary,
    padding: 10,
    borderRadius: 14,
  },

  menuCard: {
    backgroundColor: ColorPalette.surface,
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: ColorPalette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemText: { fontSize: 16, fontWeight: '600', color: ColorPalette.textPrimary },
  divider: { height: 1, backgroundColor: ColorPalette.border },

  supportButton: { marginTop: 30, alignItems: 'center' },
  supportText: { color: ColorPalette.textMuted, fontSize: 13, fontWeight: '500', textDecorationLine: 'underline' },

  logoutText: { fontSize: 16, fontWeight: '700', color: '#F87171'}, // Un rojo más suave para dark mode
  versionText: {
    textAlign: 'center',
    color: ColorPalette.textMuted,
    fontSize: 12,
    marginTop: 30,
    marginBottom: 60, // Espacio extra para el Bottom Bar alto
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 10,
    paddingBottom: 10
  }
});