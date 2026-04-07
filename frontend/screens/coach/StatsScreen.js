import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StatCard from '../../components/coach/StatCard';
import { ColorPalette } from '../../theme'; 
import { useClientStore } from '../../apis/coach/useClientsStore';

const CoachStatsScreen = () => {
  const { stats, getStats, loading } = useClientStore();

  useEffect(() => {
    getStats(); // Llamada directa al store simplificada
  }, []);

  // Mapeo dinámico de las estadísticas del backend a las Cards
  const renderStats = () => {
    if (!stats) return null;

    return [
      { 
        id: 1, 
        title: 'Clientes Activos', 
        value: String(stats.usuarios?.activos || 0), 
        trend: `+${stats.usuarios?.nuevos_mes || 0} nuevos`, 
        icon: 'users' 
      },
      { 
        id: 2, 
        title: 'Asistencia', 
        value: `${stats.engagement?.tasa_asistencia || 0}%`, 
        trend: 'Últimos 30 días', 
        icon: 'activity' 
      },
      { 
        id: 3, 
        title: 'Sesiones Hoy', 
        value: String(stats.hoy?.turnos_totales || 0), 
        trend: `${stats.hoy?.progreso_porcentaje || 0}% completado`, 
        icon: 'calendar' 
      },
      { 
        id: 4, 
        title: 'Prom. Sesiones', 
        value: String(stats.engagement?.sesiones_promedio_por_cliente || 0), 
        trend: 'Por cliente/mes', 
        icon: 'refresh-cw' 
      },
    ];
  };

  const dynamicData = renderStats();

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.headerTitle}>Estadísticas</Text>
      
      {loading ? (
        <View style={{ height: 200, justifyContent: 'center' }}>
          <ActivityIndicator color={ColorPalette.primary} size="large" />
        </View>
      ) : (
        <View style={styles.statsGrid}>
          {dynamicData && dynamicData.map((item) => (
            <StatCard key={item.id} {...item} />
          ))}
        </View>
      )}

      {/* Sección del Mapa de Calor (Engagement) */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Horas Pico de Demanda</Text>
        <View style={styles.chartPlaceholder}>
           {/* Aquí puedes mapear stats.engagement.horas_pico en un futuro */}
          <Text style={styles.placeholderText}>
            {stats?.engagement?.horas_pico 
              ? "Datos de horas pico listos para graficar" 
              : "Sin datos de actividad reciente"}
          </Text>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Inactividad Crítica</Text>
        <View style={styles.logItem}>
          <View style={[styles.iconCircle, { backgroundColor: '#EF444420' }]}>
            <Feather name="alert-circle" size={16} color="#EF4444" />
          </View>
          <Text style={styles.logText}>
            {stats?.usuarios?.inactivos || 0} cliente(s) inactivo(s) detectados.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.background, // #0F071B
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: ColorPalette.textPrimary, // #F8FAFC
    marginTop: 60,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chartSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ColorPalette.textSecondary, // #A5B4FC
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: ColorPalette.surface, // #1E152E
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ColorPalette.border, // #2D243F
  },
  fakeGradientContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
  },
  gradientLayer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: ColorPalette.primary, // #8B5CF6
  },
  placeholderText: {
    color: ColorPalette.textMuted, // #6366F1
    fontSize: 12,
    fontWeight: '600',
    zIndex: 2,
  },
  recentActivity: {
    marginTop: 30,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorPalette.surface,
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  iconCircle: {
    backgroundColor: ColorPalette.secondary, 
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  logText: {
    color: ColorPalette.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1, 
  }
});

export default CoachStatsScreen;