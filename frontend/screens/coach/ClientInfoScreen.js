import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';
import { useObjetivosStore } from '../../apis/useObjetivosStore';

export default function ClientInfoScreen({ client }) {
  const [measurements, setMeasurements] = useState({
    weight: '78.5',
    fatPercentage: '18.2',
    muscleMass: '34.1',
  });

  const [objective, setObjective] = useState('Ganancia de masa muscular...');
  const { objetivos, getObjetivos, error } = useObjetivosStore();
  
    // 2. Cargamos los datos al montar la pantalla
    useEffect(() => {
        getObjetivos();
    }, []);


  return (
    <View style={styles.subContainer}>
      {/* Sección: Objetivos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="target" size={16} color={ColorPalette.primary} />
          <Text style={styles.sectionTitle}>Objetivo</Text>
        </View>
        <TextInput
          style={styles.inputCard}
          multiline
          value={objective}
          onChangeText={setObjective}
          placeholderTextColor={ColorPalette.textMuted}
        />
      </View>

      {/* Sección: Mediciones */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="activity" size={16} color={ColorPalette.primary} />
          <Text style={styles.sectionTitle}>Mediciones</Text>
        </View>
        <View style={styles.measurementsGrid}>
          <MeasureItem label="Peso" value={measurements.weight} unit="kg" />
          <MeasureItem label="Grasa" value={measurements.fatPercentage} unit="%" />
          <MeasureItem label="Músculo" value={measurements.muscleMass} unit="kg" />
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actionGrid}>
        <ActionButton icon="file-text" label="Rutina" color="#E0E7FF" iconColor={ColorPalette.primary} />
        <ActionButton icon="pie-chart" label="Dieta" color="#FEF3C7" iconColor="#D97706" />
        <ActionButton icon="trending-up" label="Progreso" color="#FCE7F3" iconColor="#DB2777" />
      </View>
    </View>
  );
}

// Sub-componentes internos para limpiar el código
const MeasureItem = ({ label, value, unit }) => (
  <View style={styles.measureCard}>
    <Text style={styles.measureLabel}>{label} ({unit})</Text>
    <Text style={styles.measureValue}>{value}</Text>
  </View>
);

const ActionButton = ({ icon, label, color, iconColor }) => (
  <TouchableOpacity style={styles.actionItem}>
    <View style={[styles.actionIcon, { backgroundColor: color }]}>
      <Feather name={icon} size={18} color={iconColor} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  subContainer: { marginTop: 15, borderTopWidth: 1, borderTopColor: ColorPalette.border, paddingTop: 15 },
  section: { marginBottom: 15 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: ColorPalette.textSecondary, textTransform: 'uppercase' },
  inputCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 10, color: ColorPalette.textPrimary, fontSize: 14, borderWidth: 1, borderColor: ColorPalette.border },
  measurementsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  measureCard: { backgroundColor: '#F8FAFC', width: '31%', padding: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: ColorPalette.border },
  measureLabel: { fontSize: 10, fontWeight: '700', color: ColorPalette.textSecondary },
  measureValue: { fontSize: 15, fontWeight: '800', color: ColorPalette.primary },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  actionItem: { flex: 1, alignItems: 'center' },
  actionIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  actionLabel: { fontSize: 11, fontWeight: '700', color: ColorPalette.textPrimary },
});