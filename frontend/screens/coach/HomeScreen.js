import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';
import { useTurnosStore } from '../../apis/useTurnosStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../apis/useAuthStore';

const getStatusColor = (status) => {
  switch (status) {
    case 'completado': return ColorPalette.success;
    case 'cancelado': return '#EF4444';
    default: return '#F59E0B'; // pendiente
  }
};

const HomeScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { turnos, getTurnos, error } = useTurnosStore();

  const todayDisplay = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  useEffect(() => {
    if (user?.id) {
      getTurnos(user.id, user.rol);
    }
  }, [user?.id]);

  const filteredTurnos = useMemo(() => {
    const todayISO = new Date().toISOString().split('T')[0];
    return turnos.filter(turno => {
      const fechaTurno = turno.fecha.split('T')[0];
      return fechaTurno === todayISO;
    });
  }, [turnos]);

  const ocupacion = useMemo(() => {
    if (filteredTurnos.length === 0) return "0%";
    const completados = filteredTurnos.filter(t => t.estado === 'completado').length;
    return `${Math.round((completados / filteredTurnos.length) * 100)}%`;
  }, [filteredTurnos]);

  if (!user) return <View style={styles.container}><ActivityIndicator size="large" color={ColorPalette.primary} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{todayDisplay}</Text>
            <Text style={styles.greeting}>Hola, <Text style={styles.boldText}>{user.alias || user.nombre}</Text></Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <View style={styles.profileInner}>
               <Text style={styles.profileLetter}>{(user.alias || user.nombre).charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
                <Feather name="calendar" size={16} color={ColorPalette.primary} />
            </View>
            <View>
                <Text style={styles.statNumber}>{filteredTurnos.length}</Text>
                <Text style={styles.statLabel}>Turnos hoy</Text>
            </View>
          </View>
          
          <View style={[styles.statCard, styles.statCardMain]}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Feather name="trending-up" size={16} color="#FFF" />
            </View>
            <View>
                <Text style={[styles.statNumber, {color: '#FFF'}]}>{ocupacion}</Text>
                <Text style={[styles.statLabel, {color: 'rgba(255,255,255,0.8)'}]}>Progreso</Text>
            </View>
          </View>
        </View>

        {/* Agenda */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agenda de hoy</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {filteredTurnos.length > 0 ? (
            filteredTurnos.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {item.fecha.includes('T') ? item.fecha.split('T')[1].substring(0, 5) : '00:00'}
                  </Text>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.estado) }]} />
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.clientName}>Cliente #{item.cliente_id}</Text>
                  <Text style={styles.sessionType}>{item.tipo.toUpperCase()}</Text>
                </View>
                
                <View style={styles.chevronContainer}>
                  <Feather name="chevron-right" size={18} color={ColorPalette.textMuted} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="clock" size={40} color={ColorPalette.border} />
              <Text style={styles.emptyText}>No tienes compromisos para hoy.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: ColorPalette.background 
  },
  scrollContent: { 
    paddingBottom: 40,
    paddingTop: 20 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  dateText: { 
    fontSize: 13, 
    color: ColorPalette.textSecondary, 
    textTransform: 'capitalize', 
    fontWeight: '600',
    letterSpacing: 0.5
  },
  greeting: { 
    fontSize: 30, 
    color: ColorPalette.textPrimary, 
    letterSpacing: -1,
    marginTop: 2
  },
  boldText: { fontWeight: '800' },
  profileCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 18, 
    backgroundColor: ColorPalette.surface,
    padding: 2,
    borderWidth: 1,
    borderColor: ColorPalette.border
  },
  profileInner: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: ColorPalette.secondary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileLetter: { 
    color: ColorPalette.primary, 
    fontWeight: '700', 
    fontSize: 18 
  },
  
  statsRow: { 
    flexDirection: 'row', 
    paddingHorizontal: 24, 
    gap: 15, 
    marginBottom: 35 
  },
  statCard: { 
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18, 
    borderRadius: 24, 
    backgroundColor: ColorPalette.surface, 
    borderWidth: 1, 
    borderColor: ColorPalette.border,
    gap: 12
  },
  statCardMain: { 
    backgroundColor: ColorPalette.primary, 
    borderColor: ColorPalette.primary 
  },
  statIconContainer: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: ColorPalette.secondary,
  },
  statNumber: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: ColorPalette.textPrimary 
  },
  statLabel: { 
    fontSize: 11, 
    color: ColorPalette.textSecondary, 
    fontWeight: '600' 
  },

  section: { paddingHorizontal: 24 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: ColorPalette.textPrimary,
    letterSpacing: -0.5
  },
  seeAll: { 
    fontSize: 14, 
    color: ColorPalette.primary, 
    fontWeight: '700' 
  },

  card: {
    flexDirection: 'row',
    backgroundColor: ColorPalette.surface,
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  timeContainer: { 
    alignItems: 'center', 
    borderRightWidth: 1, 
    borderRightColor: ColorPalette.border, 
    paddingRight: 15, 
    marginRight: 15 
  },
  timeText: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: ColorPalette.textPrimary 
  },
  statusIndicator: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    marginTop: 6 
  },
  cardContent: { flex: 1 },
  clientName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: ColorPalette.textPrimary 
  },
  sessionType: { 
    fontSize: 13, 
    color: ColorPalette.textSecondary, 
    marginTop: 2,
    fontWeight: '500'
  },
  chevronContainer: { 
    backgroundColor: ColorPalette.background,
    padding: 6,
    borderRadius: 10
  },
  emptyText:{
    color:ColorPalette.textPrimary
  }
});

export default HomeScreen;