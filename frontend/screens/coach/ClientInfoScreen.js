import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';
import { useObjetivosStore } from '../../apis/useObjetivosStore';
import { useAuthStore } from '../../apis/useAuthStore';

export default function  ClientInfoScreen({ client }) {
  const { 
    getObjetivosByCliente, 
    getAllTipos, 
    tipos, 
    updateObjetivo,
    objetivos 
  } = useObjetivosStore();

  const usuarioLogueado = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemp, setSelectedTemp] = useState(null);
  const esProfesional = usuarioLogueado?.rol === 'profesional';

  const ultimaMedicion = client.mediciones?.[0] || {};
  

  const objetivoData = objetivos.length > 0 ? objetivos[0] : (client.objetivos?.[0] || null);

  useEffect(() => {
    if (client?.id && usuarioLogueado?.id) {
      getObjetivosByCliente(client.id, usuarioLogueado.id, esProfesional);
      if (esProfesional) getAllTipos(); 
    }
  }, [client?.id]);

  const handleSave = async () => {
    if (!selectedTemp || selectedTemp === objetivoData?.tipo) {
      return setIsEditing(false);
    }

    const dataUpdate = {
      tipo: selectedTemp,
      valor_inicial: objetivoData.valor_inicial,
      valor_objetivo: objetivoData.valor_objetivo
    };

    const success = await updateObjetivo(
      objetivoData.id, 
      client.id, 
      esProfesional, 
      dataUpdate
    );

    if (success) {
      setIsEditing(false);
      Alert.alert("Éxito", "Objetivo actualizado");
    } else {
      Alert.alert("Error", "No se pudo actualizar el objetivo");
    }
  };

  return (
    <View style={styles.subContainer}>
      {/* Sección: Objetivos */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <View style={styles.sectionHeader}>
            <Feather name="target" size={16} color={ColorPalette.primary} />
            <Text style={styles.sectionTitle}>Objetivo</Text>
          </View>
          
          {esProfesional && objetivoData && (
            <TouchableOpacity 
              onPress={isEditing ? handleSave : () => {
                setSelectedTemp(objetivoData.tipo);
                setIsEditing(true);
              }}
              style={styles.editButton}
            >
              <Feather 
                name={isEditing ? "check-circle" : "edit-2"} 
                size={16} 
                color={isEditing ? "#10B981" : ColorPalette.primary} 
              />
              <Text style={[styles.editText, isEditing && { color: '#10B981' }]}>
                {isEditing ? "Guardar" : "Editar"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!isEditing ? (
          <View style={styles.displayCard}>
            <Text style={styles.displayText}>
              {objetivoData 
                ? objetivoData.tipo.split('_').join(' ').toUpperCase() 
                : "SIN OBJETIVO ASIGNADO"}
            </Text>
          </View>
        ) : (
          <View style={styles.dropdownContainer}>
            {tipos.map((tipoItem, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.optionItem, 
                  selectedTemp === tipoItem && styles.optionSelected
                ]}
                onPress={() => setSelectedTemp(tipoItem)}
              >
                <Text style={[
                  styles.optionText,
                  selectedTemp === tipoItem && styles.optionTextSelected
                ]}>
                  {tipoItem.split('_').join(' ').toUpperCase()}
                </Text>
                {selectedTemp === tipoItem && (
                  <Feather name="check" size={14} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Sección: Mediciones Dinámicas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="activity" size={16} color={ColorPalette.primary} />
          <Text style={styles.sectionTitle}>Última Evaluación</Text>
        </View>
        <View style={styles.measurementsGrid}>
          <MeasureItem 
            label="Peso" 
            value={ultimaMedicion.peso || '--'} 
            unit="kg" 
          />
          <MeasureItem 
            label="Grasa" 
            value={ultimaMedicion.grasa || '--'} 
            unit="%" 
          />
          <MeasureItem 
            label="Músculo" 
            value={ultimaMedicion.masa_muscular || '--'} 
            unit="kg" 
          /> 
        </View>
      </View>

      {/* Sección: Metas Numéricas  */}
      {objetivoData && (
        <View style={styles.section}>
          <View style={styles.goalBanner}>
             <Text style={styles.goalText}>
               Progreso: {objetivoData.valor_inicial} {objetivoData.tipo.includes('grasa') ? '%' : 'kg'} 
               {'  '}<Feather name="arrow-right" size={12} />{'  '} 
               Meta: {objetivoData.valor_objetivo} {objetivoData.tipo.includes('grasa') ? '%' : 'kg'}
             </Text>
          </View>
        </View>
      )}

      {/* Acciones */}
      <View style={styles.actionGrid}>
        <ActionButton icon="file-text" label="Rutina" color="#E0E7FF" iconColor={ColorPalette.primary} />
        <ActionButton icon="pie-chart" label="Dieta" color="#FEF3C7" iconColor="#D97706" />
        <ActionButton icon="trending-up" label="Progreso" color="#FCE7F3" iconColor="#DB2777" />
      </View>
    </View>
  );
}

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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: ColorPalette.textSecondary, textTransform: 'uppercase' },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editText: { fontSize: 12, fontWeight: '700', color: ColorPalette.primary },
  displayCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: ColorPalette.border },
  displayText: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  dropdownContainer: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: ColorPalette.border, overflow: 'hidden' },
  optionItem: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  optionSelected: { backgroundColor: ColorPalette.primary },
  optionText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  optionTextSelected: { color: 'white', fontWeight: '800' },
  measurementsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  measureCard: { backgroundColor: '#F8FAFC', width: '31%', padding: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: ColorPalette.border },
  measureLabel: { fontSize: 9, fontWeight: '700', color: ColorPalette.textSecondary },
  measureValue: { fontSize: 14, fontWeight: '800', color: ColorPalette.primary },
  goalBanner: { backgroundColor: '#FCE7F3' + '10', padding: 8, borderRadius: 8, alignItems: 'center' },
  goalText: { fontSize: 11, fontWeight: '700', color: '#DB2777' },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  actionItem: { flex: 1, alignItems: 'center' },
  actionIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  actionLabel: { fontSize: 11, fontWeight: '700', color: ColorPalette.textPrimary },
});