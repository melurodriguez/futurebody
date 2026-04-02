import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';
import { useAuthStore } from '../../apis/useAuthStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  // Datos simulados para la UI
  const nextSession = {
    time: "18:30",
    date: "Hoy, 2 de Abril",
    type: "Hipertrofia - Tren Superior",
    coach: "Alexander"
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header: Bienvenida */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.alias || 'Guerrero'} 👋</Text>
          <Text style={styles.subGreeting}>¿Listo para superar tus límites?</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Feather name="bell" size={22} color={ColorPalette.textPrimary} />
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>

      {/* Tarjeta Destacada: Próximo Turno (UX Focalizada) */}
      <View style={styles.mainCardContainer}>
        <View style={styles.nextSessionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>PRÓXIMO TURNO</Text>
            </View>
            <Feather name="clock" size={18} color="#FFF" opacity={0.8} />
          </View>
          
          <Text style={styles.sessionTime}>{nextSession.time}</Text>
          <Text style={styles.sessionTitle}>{nextSession.type}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.cardFooter}>
            <View style={styles.coachInfo}>
              <Feather name="user" size={14} color="#FFF" />
              <Text style={styles.coachName}>Coach {nextSession.coach}</Text>
            </View>
            <Text style={styles.sessionDate}>{nextSession.date}</Text>
          </View>
        </View>
      </View>

      {/* Sección: Mi Progreso Rápido */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tu Actividad</Text>
          <TouchableOpacity><Text style={styles.seeMore}>Ver todo</Text></TouchableOpacity>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.miniStatCard}>
            <Feather name="activity" size={20} color={ColorPalette.primary} />
            <Text style={styles.statNumber}>320</Text>
            <Text style={styles.statLabel}>Kcal</Text>
          </View>
          <View style={styles.miniStatCard}>
            <Feather name="target" size={20} color={ColorPalette.accent} />
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Meta</Text>
          </View>
          <View style={styles.miniStatCard}>
            <Feather name="heart" size={20} color="#F87171" />
            <Text style={styles.statNumber}>72</Text>
            <Text style={styles.statLabel}>BPM</Text>
          </View>
        </View>
      </View>

      {/* Sección: Accesos Rápidos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: '#3B82F620' }]}>
              <Feather name="calendar" size={22} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Reservar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: '#10B98120' }]}>
              <Feather name="trending-up" size={22} color="#10B981" />
            </View>
            <Text style={styles.actionText}>Medidas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: '#F59E0B20' }]}>
              <Feather name="file-text" size={22} color="#F59E0B" />
            </View>
            <Text style={styles.actionText}>Rutina</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginBottom: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorPalette.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: ColorPalette.textPrimary },
  subGreeting: { fontSize: 14, color: ColorPalette.textSecondary, marginTop: 4 },
  notificationBtn: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: ColorPalette.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColorPalette.primary,
    borderWidth: 2,
    borderColor: ColorPalette.surface,
  },
  mainCardContainer: { paddingHorizontal: 25, marginTop: 10 },
  nextSessionCard: {
    backgroundColor: ColorPalette.primary, // O un gradiente Púrpura/Azul
    borderRadius: 30,
    padding: 25,
    shadowColor: ColorPalette.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  sessionTime: { color: '#FFF', fontSize: 38, fontWeight: '900', marginTop: 15 },
  sessionTitle: { color: '#FFF', fontSize: 18, fontWeight: '600', opacity: 0.9 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coachInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coachName: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  sessionDate: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  section: { paddingHorizontal: 25, marginTop: 35 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: ColorPalette.textPrimary },
  seeMore: { color: ColorPalette.accent, fontWeight: '600', fontSize: 14 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  miniStatCard: {
    backgroundColor: ColorPalette.surface,
    width: (width - 70) / 3,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  statNumber: { fontSize: 18, fontWeight: '800', color: ColorPalette.textPrimary, marginTop: 8 },
  statLabel: { fontSize: 12, color: ColorPalette.textMuted, fontWeight: '600' },

  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  actionBtn: { alignItems: 'center', width: (width - 70) / 3 },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: { color: ColorPalette.textSecondary, fontSize: 13, fontWeight: '600' }
});