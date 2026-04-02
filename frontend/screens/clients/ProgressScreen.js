import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  // Datos simulados de evolución
  const stats = [
    { label: 'Peso Inicial', value: '85.0 kg', color: ColorPalette.textMuted },
    { label: 'Peso Actual', value: '78.5 kg', color: ColorPalette.primary },
    { label: 'Diferencia', value: '-6.5 kg', color: '#10B981' },
  ];

  const history = [
    { id: '1', date: '28 Mar, 2026', weight: '78.5 kg', fat: '18%', note: 'Gran semana' },
    { id: '2', date: '14 Mar, 2026', weight: '79.8 kg', fat: '19%', note: 'Estable' },
    { id: '3', date: '01 Mar, 2026', weight: '81.2 kg', fat: '20%', note: 'Inicio de plan' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Progreso</Text>
       
      </View>

      {/* Resumen de Transformación */}
      <View style={styles.summaryCard}>
        {stats.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Visualización de Gráfico (Simulado con Estética Glass) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evolución de Peso</Text>
        <View style={styles.chartPlaceholder}>
          <View style={styles.chartLineContainer}>
            {/* Aquí integrarías react-native-chart-kit o similares */}
            <Feather name="trending-down" size={40} color={ColorPalette.accent} opacity={0.5} />
            <Text style={styles.chartText}>Visualización de tendencia mensual</Text>
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabelText}>Ene</Text>
            <Text style={styles.chartLabelText}>Feb</Text>
            <Text style={[styles.chartLabelText, { color: ColorPalette.primary }]}>Mar</Text>
            <Text style={styles.chartLabelText}>Abr</Text>
          </View>
        </View>
      </View>

      {/* Listado Histórico */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Historial de Medidas</Text>
          <Feather name="filter" size={18} color={ColorPalette.textMuted} />
        </View>
        
        {history.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.historyInfo}>
              <View style={styles.dateBadge}>
                <Feather name="calendar" size={12} color={ColorPalette.accent} />
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <Text style={styles.historyWeight}>{item.weight}</Text>
              <Text style={styles.historyNote}>{item.note}</Text>
            </View>
            <View style={styles.historyStats}>
              <Text style={styles.fatText}>{item.fat}</Text>
              <Text style={styles.fatLabel}>Grasa</Text>
            </View>
          </View>
        ))}
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
    paddingTop: 60, 
    paddingHorizontal: 25,
    paddingBottom: 20 
  },
  title: { fontSize: 28, fontWeight: '800', color: ColorPalette.textPrimary },
  addButton: { 
    flexDirection: 'row', 
    backgroundColor: ColorPalette.primary, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 14, 
    alignItems: 'center', 
    gap: 5 
  },
  addButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: ColorPalette.surface,
    marginHorizontal: 25,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: ColorPalette.border,
    marginTop: 10,
  },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: ColorPalette.textMuted, marginBottom: 5, fontWeight: '600' },
  statValue: { fontSize: 18, fontWeight: '800' },

  section: { paddingHorizontal: 25, marginTop: 35 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: ColorPalette.textPrimary },
  
  chartPlaceholder: {
    height: 200,
    backgroundColor: ColorPalette.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ColorPalette.border,
    padding: 20,
    justifyContent: 'center',
    marginTop:10,
  },
  chartLineContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  chartText: { color: ColorPalette.textMuted, fontSize: 13, fontWeight: '500' },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  chartLabelText: { fontSize: 11, color: ColorPalette.textMuted, fontWeight: '700' },

  historyCard: {
    backgroundColor: ColorPalette.surface,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  historyInfo: { flex: 1 },
  dateBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5, 
    backgroundColor: ColorPalette.secondary, 
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8
  },
  dateText: { fontSize: 11, color: ColorPalette.accent, fontWeight: '700' },
  historyWeight: { fontSize: 18, fontWeight: '800', color: ColorPalette.textPrimary },
  historyNote: { fontSize: 12, color: ColorPalette.textMuted, marginTop: 2 },
  
  historyStats: { alignItems: 'flex-end', backgroundColor: ColorPalette.background, padding: 10, borderRadius: 15 },
  fatText: { fontSize: 16, fontWeight: '800', color: ColorPalette.primary },
  fatLabel: { fontSize: 10, color: ColorPalette.textMuted, fontWeight: '700' },
});