import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';
import { useObjetivosStore } from '../../apis/useObjetivosStore';
import { useAuthStore } from '../../apis/useAuthStore';
import { useClientStore } from '../../apis/coach/useClientsStore';
import HistorialModal from '../../components/coach/HistorialModal';
import AddMedicionesForm from '../../components/coach/AddMedicionesForm';

const { width } = Dimensions.get('window');

export default function ClientInfoScreen({ route, navigation }) {

  const { client } = route.params; 

  const { 
    getObjetivosByCliente, 
    getAllTipos, 
    tipos, 
    updateObjetivo,
    objetivos 
  } = useObjetivosStore();

  const { createMedicion, createMedidaCorporal, deleteMedicion, deleteMedidaCorporal, getClientById}=useClientStore()
  const usuarioLogueado = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemp, setSelectedTemp] = useState(null);
  const esProfesional = usuarioLogueado?.rol === 'profesional';

  const mediciones = client.mediciones || [];
  const totalMediciones = mediciones.length;

  const ultimaMedicion = totalMediciones > 0 ? mediciones[totalMediciones - 1] : {};
  const penultimaMedicion = totalMediciones > 1 ? mediciones[totalMediciones - 2] : {};


  const medicionesInvertidas = [...mediciones].reverse();
  const medidasInvertidas = [...(client.medidas_corporales || [])].reverse();


  const objetivoData = objetivos.length > 0 ? objetivos[0] : (client.objetivos?.[0] || null);

  const [historialVisible, setHistorialVisible]=useState(false)
  const [addForm, setAddForm]=useState(false)

  const [editValues, setEditValues] = useState({
  valor_inicial: '',
  valor_objetivo: ''
});

// Al activar el modo edición, cargamos los valores actuales
const handleEditing = () => {
  if (!isEditing && objetivoData) {
    setEditValues({
      valor_inicial: objetivoData.valor_inicial?.toString() || '',
      valor_objetivo: objetivoData.valor_objetivo?.toString() || ''
    });
    setSelectedTemp(objetivoData.tipo);
  }
  setIsEditing(!isEditing);
};

  useEffect(() => {
    if (client?.id && usuarioLogueado?.id) {
      getObjetivosByCliente(client.id, usuarioLogueado.id, esProfesional);
      if (esProfesional) getAllTipos();
      
      if (objetivoData) {
        setSelectedTemp(objetivoData.tipo);
      }
    }
  }, [client?.id]);
  const renderDiff = (actual, anterior, type = 'default') => {
    if (!anterior || actual === undefined || anterior === undefined) return null;

    const diff = parseFloat((actual - anterior).toFixed(1));
    
    let bgColor = '#F1F5F9'; // Gris neutral
    let iconName = 'minus';   // Icono neutral
    let iconColor = '#64748B'; // Texto neutral

    if (diff === 0) {
      bgColor = '#FEF9C3'; 
      iconName = 'minus';
      iconColor = '#CA8A04'; 
    } else {
      const isPositive = diff > 0;
      let isGoodChange = false;
      if (type === 'musculo' || type === 'altura') {
          isGoodChange = isPositive; 
      } else if (type === 'grasa') {
          isGoodChange = !isPositive; 
      } else {
          isGoodChange = !isPositive; 
      }

      bgColor = isGoodChange ? '#DCFCE7' : '#FEE2E2';
      iconColor = isGoodChange ? '#10B981' : '#EF4444';
      iconName = isPositive ? 'arrow-up' : 'arrow-down';
    }

    return (
      <View style={[styles.diffBadge, { backgroundColor: bgColor }]}>
        <Feather name={iconName} size={10} color={iconColor} />
        <Text style={[styles.diffText, { color: iconColor }]}>
          {Math.abs(diff)}
        </Text>
      </View>
    );
  };

  const handleSaveMediciones = async (formData) => {
    try {
      const composicionData = {
        cliente_id: client.id,
        peso: parseFloat(formData.peso) || 0,
        grasa: parseFloat(formData.grasa) || 0,
        masa_muscular: parseFloat(formData.masa_muscular) || 0,
        altura: parseFloat(formData.altura) || 0,
      };

      const anatomiaData = {
        cliente_id: client.id,
        brazo: parseFloat(formData.brazo) || 0,
        pecho: parseFloat(formData.pecho) || 0,
        cintura: parseFloat(formData.cintura) || 0,
        cadera: parseFloat(formData.cadera) || 0,
        pierna: parseFloat(formData.pierna) || 0,
      };


      await Promise.all([
        createMedicion(client.id, esProfesional, composicionData),
        createMedidaCorporal(client.id, esProfesional, anatomiaData)
      ]);

      setAddForm(false);
    
      Alert.alert("¡Logrado!", "Los datos se guardaron correctamente.");

      await getClientById(client.id);



    } catch (error) {
      if (error.response?.status === 422) {
      console.log("DETALLE ERROR 422:", JSON.stringify(error.response.data.detail, null, 2));
    }
      Alert.alert("Error", "No se pudieron guardar todos los datos. Revisa la conexión.");
    }
  };

  const handleDeleteEvolution = async (medicionId, medidaId) => {
    try {
      const clienteId = client.id;

      await Promise.all([
        deleteMedicion(medicionId, clienteId, esProfesional),
        medidaId ? deleteMedidaCorporal(medidaId, clienteId, esProfesional) : Promise.resolve()
      ]);

      await getClientById(clienteId);
      
      Alert.alert("Eliminado", "El registro se ha borrado correctamente.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo eliminar el registro completamente.");
    }
  };


  const handleUpdateObjetivo = async () => {
    if (!selectedTemp || !objetivoData?.id) return;

    try {
      const dataUpdate = {
        tipo: selectedTemp,
        valor_inicial: parseFloat(editValues.valor_inicial) || 0,
        valor_objetivo: parseFloat(editValues.valor_objetivo) || 0
      };

      const success = await updateObjetivo(
        objetivoData.id, 
        client.id, 
        esProfesional, 
        dataUpdate
      );

      if (success) {
        setIsEditing(false);
        Alert.alert("¡Éxito!", "Objetivo actualizado correctamente.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  // Determinar la unidad según el tipo seleccionado
  const getUnidad = (tipo) => {
    if (!tipo) return 'kg';
    const t = tipo.toLowerCase();
    if (t.includes('grasa') || t.includes('porcentaje')) return '%';
    return 'kg';
  };

  const unidadActual = getUnidad(selectedTemp);


  if (addForm) {
    return (
      <AddMedicionesForm
        clienteId={client.id} 
        onCancel={() => setAddForm(false)} 
        onSubmit={handleSaveMediciones} 
      />
    );
  }

  return (
    
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER: Perfil resumido */}
      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{client.nombre?.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.clientName}>{client.nombre}</Text>
          <Text style={styles.clientSubtitle}>Cliente desde {new Date().getFullYear()}</Text>
        </View>
      </View>

      {/* SECCIÓN: OBJETIVO PRINCIPAL */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>Objetivo Actual</Text>
          {esProfesional && (
            <TouchableOpacity onPress={handleEditing}>
              <Feather name={isEditing ? "x-circle" : "edit-3"} size={18} color={ColorPalette.primary} />
            </TouchableOpacity>
          )}
        </View>

        {!isEditing ? (
          <View style={styles.goalContainer}>
            <Text style={styles.goalValue}>
              {objetivoData ? objetivoData.tipo.replace('_', ' ').toUpperCase() : "SIN DEFINIR"}
            </Text>
            {objetivoData && (
              <View style={styles.progressTrack}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '65%' }]} /> 
                </View>
                <Text style={styles.progressLabel}>65% completado</Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            {/* Selección de Tipo (Chips) */}
            <Text style={styles.inputLabel}>Tipo de Objetivo</Text>
            <View style={[styles.editGrid, { marginBottom: 15 }]}>
              {tipos.map((t) => (
                <TouchableOpacity 
                  key={t} 
                  style={[styles.chip, selectedTemp === t && styles.chipActive]}
                  onPress={() => setSelectedTemp(t)}
                >
                  <Text style={[styles.chipText, selectedTemp === t && styles.chipTextActive]}>
                    {t.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Inputs Numéricos */}
            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Val. Inicial ({unidadActual})</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={editValues.valor_inicial}
                  onChangeText={(txt) => setEditValues({ ...editValues, valor_inicial: txt })}
                  placeholder="0.0"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.inputLabel}>Val. Meta (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={editValues.valor_objetivo}
                  onChangeText={(txt) => setEditValues({ ...editValues, valor_objetivo: txt })}
                  placeholder="0.0"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.saveBtn} 
              onPress={handleUpdateObjetivo}
            >
              <Text style={styles.saveBtnText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* SECCIÓN: MÉTRICAS Y COMPARATIVAS */}
      <Text style={styles.sectionLabel}>Último Progreso</Text>
      <View style={styles.metricsGrid}>
        <MetricCard 
          label="Peso" 
          value={ultimaMedicion.peso} 
          unit="kg" 
          diff={renderDiff(ultimaMedicion.peso, penultimaMedicion.peso, 'peso')}
        />
        <MetricCard 
          label="Grasa" 
          value={ultimaMedicion.grasa} 
          unit="%" 
          diff={renderDiff(ultimaMedicion.grasa, penultimaMedicion.grasa, 'grasa')}
        />
        <MetricCard 
          label="Músculo" 
          value={ultimaMedicion.masa_muscular} 
          unit="%" 
          diff={renderDiff(ultimaMedicion.masa_muscular, penultimaMedicion.masa_muscular, 'musculo')}
        />
        <MetricCard 
          label="Altura" 
          value={ultimaMedicion.altura} 
          unit="m" 
          diff={renderDiff(ultimaMedicion.altura, penultimaMedicion.altura, 'altura')}
        />
      </View>
      {/* SECCIÓN: COMPARATIVA VISUAL 
      MODIFICAR MEDISAS SEGUN OBJETIVO*/}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Metas Numéricas</Text>
        <View style={styles.comparisonRow}>
          <View style={styles.compItem}>
            <Text style={styles.compLabel}>Inicial</Text>
            <Text style={styles.compValue}>{objetivoData?.valor_inicial || '--'}{unidadActual}</Text>
          </View>
          <Feather name="chevrons-right" size={20} color={ColorPalette.border} />
          <View style={styles.compItem}>
            <Text style={styles.compLabel}>Actual</Text>
            <Text style={[styles.compValue, {color: ColorPalette.primary}]}>{ultimaMedicion.peso || '--'}{unidadActual}</Text>
          </View>
          <Feather name="chevrons-right" size={20} color={ColorPalette.border} />
          <View style={styles.compItem}>
            <Text style={styles.compLabel}>Meta</Text>
            <Text style={[styles.compValue, {color: '#10B981'}]}>{objetivoData?.valor_objetivo || '--'}{unidadActual}</Text>
          </View>
        </View>
      </View>

      {/* ACCIONES RÁPIDAS */}
      <View style={styles.footerActions}>
        <BigActionButton icon="calendar" label="Nueva Medida" color={ColorPalette.primary} onPress={()=>setAddForm(true)} />
        <BigActionButton icon="clipboard" label="Ver Historial" color={ColorPalette.textSecondary} onPress={()=>setHistorialVisible(true)} />
      </View>


      <HistorialModal 
        visible={historialVisible} 
        onClose={() => setHistorialVisible(false)} 
        mediciones={medicionesInvertidas} 
        medidasCorporales={medidasInvertidas}
        onDelete={handleDeleteEvolution} 
      />

                
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Sub-componentes para limpiar el código
const MetricCard = ({ label, value, unit, diff }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricLabel}>{label}</Text>
    <View style={styles.metricMain}>
      <Text style={styles.metricValue}>{value || '--'}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </View>
    {diff}
  </View>
);

const BigActionButton = ({ icon, label, color, onPress }) => (
  <TouchableOpacity 
    style={[styles.bigButton, { borderColor: color }]} 
    onPress={onPress}   
    activeOpacity={0.7}
  >
    <Feather name={icon} size={20} color={color} />
    <Text style={[styles.bigButtonText, { color: color }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFBFE', padding: 20 },
  profileCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, gap: 15 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: ColorPalette.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  clientName: { fontSize: 22, fontWeight: '800', color: ColorPalette.textPrimary },
  clientSubtitle: { fontSize: 13, color: ColorPalette.textSecondary },
  
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: ColorPalette.textPrimary },
  
  goalContainer: { alignItems: 'center' },
  goalValue: { fontSize: 18, fontWeight: '800', color: ColorPalette.primary, marginBottom: 15 },
  progressTrack: { width: '100%' },
  progressBar: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: ColorPalette.primary, borderRadius: 4 },
  progressLabel: { fontSize: 11, color: ColorPalette.textSecondary, marginTop: 8, textAlign: 'right' },

  sectionLabel: { fontSize: 14, fontWeight: '800', color: ColorPalette.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  metricsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',          
    justifyContent: 'space-between', 
    marginBottom: 20,
    gap: 12                    
  },
  metricCard: { 
    backgroundColor: 'white', 
    width: '48%',              
    padding: 15, 
    borderRadius: 20, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  metricLabel: { fontSize: 11, color: ColorPalette.textSecondary, marginBottom: 5 },
  metricMain: { flexDirection: 'row', alignItems: 'baseline' },
  metricValue: { fontSize: 18, fontWeight: '800', color: ColorPalette.textPrimary },
  metricUnit: { fontSize: 10, color: ColorPalette.textSecondary, marginLeft: 2 },
  
  diffBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginTop: 8, gap: 2 },
  diffText: { fontSize: 10, fontWeight: 'bold' },

  comparisonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  compItem: { alignItems: 'center' },
  compLabel: { fontSize: 10, color: ColorPalette.textSecondary, marginBottom: 4 },
  compValue: { fontSize: 16, fontWeight: '800' },

  editGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  chipActive: { backgroundColor: ColorPalette.primary },
  chipText: { fontSize: 12, color: ColorPalette.textSecondary, fontWeight: '600' },
  chipTextActive: { color: 'white' },

  footerActions: { flexDirection: 'row', gap: 15, marginTop: 10 },
  bigButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 15, borderWidth: 1.5, gap: 8 },
  bigButtonText: { fontWeight: '700', fontSize: 14 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: ColorPalette.textSecondary, marginBottom: 5, marginTop: 5 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  input: { 
    backgroundColor: '#F8FAFC', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 10, 
    padding: 10, 
    fontSize: 14, 
    color: ColorPalette.textPrimary,
    fontWeight: '600'
  },
  saveBtn: { 
    backgroundColor: ColorPalette.primary, 
    padding: 12, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10 
  },
  saveBtnText: { color: 'white', fontWeight: '800', fontSize: 14 }
});