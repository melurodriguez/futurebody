import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StatCard from '../../components/coach/StatCard';
import { ColorPalette } from '../../theme'; // Importamos tu nueva paleta

const CoachStatsScreen = () => {
  const dummyData = [
    { id: 1, title: 'Clientes Activos', value: '42', trend: '+5 este mes', icon: 'users' },
    { id: 2, title: 'Adherencia Media', value: '87%', trend: '+2.4%', icon: 'activity' },
    { id: 3, title: 'Sesiones Hoy', value: '12', trend: '80% completado', icon: 'calendar' },
    { id: 4, title: 'Retención', value: '94%', trend: 'Excelente', icon: 'refresh-cw' },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }} // Espacio para el Bottom Tab alto
    >
      <Text style={styles.headerTitle}>Estadísticas</Text>
      
      <View style={styles.statsGrid}>
        {dummyData.map((item) => (
          <StatCard key={item.id} {...item} />
        ))}
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Progreso de Alumnos</Text>
        <View style={styles.chartPlaceholder}>
          {/* SIMULACIÓN DE GRADIENTE NATIVO OSCURO */}
          <View style={styles.fakeGradientContainer}>
            <View style={[styles.gradientLayer, { opacity: 0.05, bottom: 0, height: '100%' }]} />
            <View style={[styles.gradientLayer, { opacity: 0.1, bottom: 0, height: '60%' }]} />
            <View style={[styles.gradientLayer, { opacity: 0.2, bottom: 0, height: '30%' }]} />
          </View>
          
          <Text style={styles.placeholderText}>Visualización de Carga de Trabajo (Semanal)</Text>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Logros de la Comunidad</Text>
        {['Juan Perez alcanzó 100kg en Bench Press', 'Maria G. completó su racha de 15 días'].map((log, i) => (
          <View key={i} style={styles.logItem}>
            <View style={styles.iconCircle}>
              <Feather name="award" size={16} color={ColorPalette.accent} />
            </View>
            <Text style={styles.logText}>{log}</Text>
          </View>
        ))}
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