import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Switch, ActivityIndicator, Modal, TextInput, ScrollView, Alert 
} from 'react-native';
import { WeekCalendar, CalendarProvider, LocaleConfig } from 'react-native-calendars';
import { Clock, Settings, Calendar as CalendarIcon, X } from 'lucide-react-native';
import { ColorPalette } from '../../theme';
import { useDisponibilidadStore } from '../../apis/coach/useDisponibilidadStore';
import { useAuthStore } from '../../apis/useAuthStore';
import {useConfigStore} from '../../apis/coach/useConfigStore'

// Configuración de idioma para el calendario
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
};
LocaleConfig.defaultLocale = 'es';

// --- COMPONENTE INTERNO: MODAL DE CONFIGURACIÓN ---
const ConfiguracionModal = ({ visible, onClose, onSave, loading, config }) => {
  const [form, setForm] = useState({
    hora_inicio: "09:00:00",
    hora_fin: "18:00:00",
    duracion_sesion_min: "60",
    dias_laborales: "0,1,2,3,4"
  });

  const handleSave = () => {
    if (!form.hora_inicio || !form.hora_fin) {
      return Alert.alert("Error", "Por favor completa los campos obligatorios.");
    }
    onSave(form);
  };

  useEffect(() => {
  if (config) {
    setForm({
      hora_inicio: config.hora_inicio,
      hora_fin: config.hora_fin,
      duracion_sesion_min: String(config.duracion_sesion_min),
      dias_laborales: config.dias_laborales
    });
  }
}, [config, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Configuración</Text>
              <Text style={styles.modalSub}>Define tu horario base y genera bloques</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={ColorPalette.textSecondary} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Hora de Inicio</Text>
            <TextInput 
              style={styles.input} 
              placeholder="09:00:00"
              value={form.hora_inicio}
              onChangeText={(t) => setForm({...form, hora_inicio: t})}
            />

            <Text style={styles.label}>Hora de Finalización</Text>
            <TextInput 
              style={styles.input} 
              placeholder="18:00:00"
              value={form.hora_fin}
              onChangeText={(t) => setForm({...form, hora_fin: t})}
            />

            <View style={{ flexDirection: 'row', gap: 15 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Duración (min)</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="numeric"
                  value={form.duracion_sesion_min}
                  onChangeText={(t) => setForm({...form, duracion_sesion_min: t})}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Días (0-6)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="0,1,2,3,4"
                  value={form.dias_laborales}
                  onChangeText={(t) => setForm({...form, dias_laborales: t})}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, loading && { opacity: 0.7 }]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar y Generar Agenda</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// --- COMPONENTE PRINCIPAL: CALENDAR SCREEN ---
export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const { 
    config, 
    getConfigByUser, 
    createConfig, 
    updateConfig, 

  } = useConfigStore();

  const { disponibilidad, getDisponibilidad, updateDisponibilidad,     createMasiveSlotLoad  } = useDisponibilidadStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user?.id) {
      const cargarDatos = async () => {
        setLoading(true);
        try {

          await Promise.allSettled([
            getDisponibilidad(user.id),
            getConfigByUser(user.id)
          ]);
        } catch (error) {
          console.error("Error cargando datos iniciales:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarDatos();
    }
  }, [user?.id]);

  const handleSaveConfig = async (formData) => {
    if (!user?.id) return;
    setConfigLoading(true);
    
    try {
      console.log("Enviando configuración...", formData);
        if (config) {
            await updateConfig(user.id, formData);
        } else {
            await createConfig(user.id, formData);
        }

        console.log("Generando agenda masiva...");
        await createMasiveSlotLoad(user.id, {
          fecha_inicio: selectedDate, 
          semanas: 2
        });

        Alert.alert("Éxito", "Configuración guardada y agenda generada.");
        setModalVisible(false);
        await getDisponibilidad(user.id); 
    } catch (error) {
      console.error("DETALLE DEL ERROR:", error.response?.data || error.message);
        Alert.alert("Error", "No se pudo procesar la solicitud.");
    } finally {
        setConfigLoading(false);
    }
  };

  const slotsFiltrados = useMemo(() => {
    if (!disponibilidad) return [];
    return disponibilidad.filter(slot => {
        if (!slot.fecha) return false;
        const fechaSlot = slot.fecha.includes('T') ? slot.fecha.split('T')[0] : slot.fecha;
        return fechaSlot === selectedDate;
    });
  }, [disponibilidad, selectedDate]);

  const handleToggle = async (item) => {
    if (!user?.id) return;

    const nuevoEstado = item.estado === 'disponible' ? 'bloqueado' : 'disponible';
    
    const disponibilidadData = {
        fecha: item.fecha.includes('T') ? item.fecha.split('T')[0] : item.fecha,
        hora_inicio: item.hora_inicio,
        hora_fin: item.hora_fin,
        estado: nuevoEstado
    };

    const success = await updateDisponibilidad(user.id, item.id, disponibilidadData);
    
    if (!success) {
      Alert.alert("Error", "No se pudo actualizar el estado del bloque.");
    }
};

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

  const renderSlot = ({ item }) => {
    const isOcupado = item.estado === 'ocupado';
    const isBloqueado = item.estado === 'bloqueado';
    const isDisponible = item.estado === 'disponible';

    const getTimeBadgeStyle = () => {
      if (isOcupado) return { backgroundColor: ColorPalette.primary }; 
      if (isBloqueado) return { backgroundColor: '#94A3B8' }; 
      return { backgroundColor: '#22C55E20' }; 
    };

    return (
      <View style={[
        styles.slotCard, 
        isOcupado && styles.ocupadoCard,
        isBloqueado && styles.bloqueadoCard
      ]}>
        <View style={styles.slotInfo}>
          <View style={[styles.timeBadge, getTimeBadgeStyle()]}>
             <Clock color={isDisponible ? ColorPalette.success : '#FFF'} size={14} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={[
              styles.slotTime, 
              isBloqueado && { color: ColorPalette.textMuted }
            ]}>
              {item.hora_inicio.substring(0, 5)} hs
            </Text>
            {item.auto_generado && <Text style={styles.autoSubtext}>Horario fijo</Text>}
          </View>
        </View>
        
        {isOcupado ? (
          <View style={styles.clientBadge}>
            <Text style={styles.bookedText}>{item.cliente_nombre || 'Turno Tomado'}</Text>
          </View>
        ) : (
          <View style={styles.actions}>
            <Text style={[
              styles.statusLabel, 
              isDisponible && { color: '#22C55E' },
              isBloqueado && { color: ColorPalette.textMuted }
            ]}>
              {isDisponible ? 'Disponible' : 'Bloqueado'}
            </Text>
            <Switch
              value={isDisponible}
              onValueChange={() => handleToggle(item)}
              trackColor={{ false: ColorPalette.border, true: '#22C55E50' }}
              thumbColor={isDisponible ? '#22C55E' : '#94A3B8'}
              disabled={isOcupado} 
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mi Agenda</Text>
          <Text style={styles.headerSub}>Gestiona tus bloques horarios</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setModalVisible(true)}
        >
          <Settings color={ColorPalette.textPrimary} size={22} />
        </TouchableOpacity>
      </View>

      <ConfiguracionModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveConfig}
        loading={configLoading}
        config={config}
      />

      <View style={styles.calendarWrapper}>
        <CalendarProvider date={selectedDate} onDateChanged={setSelectedDate} theme={{ todayButtonTextColor: ColorPalette.primary }}>
          <WeekCalendar
            firstDay={1}
            markedDates={{ [selectedDate]: { selected: true } }}
            theme={{
              backgroundColor: ColorPalette.background,
              calendarBackground: ColorPalette.background,
              dayTextColor: ColorPalette.textPrimary,
              textDisabledColor: ColorPalette.textMuted + '40', 
              monthTextColor: ColorPalette.textPrimary,
              textMonthFontSize: 16,
              textMonthFontWeight: '800',
              textSectionTitleColor: ColorPalette.textSecondary,
              textDayHeaderFontSize: 12,
              textDayHeaderFontWeight: '600',
              selectedDayBackgroundColor: ColorPalette.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: ColorPalette.primary,
              todayButtonFontWeight: '800',
              arrowColor: ColorPalette.primary,
              textDayFontWeight: '600',
            }}
          />
        </CalendarProvider>
      </View>

      <View style={styles.slotsHeader}>
        <View style={styles.dateIndicator}>
            <CalendarIcon size={14} color={ColorPalette.textSecondary} />
            <Text style={styles.slotsTitle}>{formattedDate}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={ColorPalette.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={slotsFiltrados}
          keyExtractor={item => item.id.toString()}
          renderItem={renderSlot}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay bloques configurados.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorPalette.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 24, 
    paddingTop: 60,
    paddingBottom: 15
  },
  headerTitle: { color: ColorPalette.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  headerSub: { color: ColorPalette.textSecondary, fontSize: 13, fontWeight: '500' },
  iconButton: { backgroundColor: ColorPalette.surface, padding: 10, borderRadius: 15, borderWidth: 1, borderColor: ColorPalette.border },
  calendarWrapper: { 
    height: 110, 
    backgroundColor: ColorPalette.background, 
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.border,
  },
  slotsHeader: { paddingHorizontal: 24, marginTop: 20, marginBottom: 15 },
  dateIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  slotsTitle: { color: ColorPalette.textSecondary, fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  slotCard: {
    backgroundColor: ColorPalette.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  ocupadoCard: { 
    borderColor: ColorPalette.primary, 
    backgroundColor: ColorPalette.primary + '08', 
    borderWidth: 2 
  },
  bloqueadoCard: { 
    borderColor: ColorPalette.border, 
    opacity: 0.6,
    backgroundColor: '#F1F5F9' 
  },
  slotInfo: { flexDirection: 'row', alignItems: 'center' },
 timeBadge: { 
    width: 32, 
    height: 32, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  slotTime: { color: ColorPalette.textPrimary, fontSize: 16, fontWeight: '800' },
  autoSubtext: { fontSize: 10, color: ColorPalette.textMuted, fontWeight: '500' },
  clientBadge: { 
    backgroundColor: ColorPalette.primary, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10 
  },
  bookedText: { 
    color: '#FFF', 
    fontWeight: '800', 
    fontSize: 11,
    textTransform: 'uppercase'
  },
  statusLabel: { color: ColorPalette.textMuted, fontSize: 11, marginRight: 8, fontWeight: '700', textTransform: 'uppercase' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: ColorPalette.textMuted, fontWeight: '600' },

  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ColorPalette.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ColorPalette.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: ColorPalette.textSecondary,
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: ColorPalette.surface,
    padding: 8,
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: ColorPalette.surface,
    borderWidth: 1,
    borderColor: ColorPalette.borderStrong, 
    borderRadius: 14,
    padding: 14,
    color: ColorPalette.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: ColorPalette.primary,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
});