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

// Configuración de idioma para el calendario
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
};
LocaleConfig.defaultLocale = 'es';

// --- COMPONENTE INTERNO: MODAL DE CONFIGURACIÓN ---
const ConfiguracionModal = ({ visible, onClose, onSave, loading }) => {
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

  const { disponibilidad, getDisponibilidad, updateDisponibilidad } = useDisponibilidadStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user?.id) {
      const cargarDatos = async () => {
        setLoading(true);
        await getDisponibilidad(user.id);
        setLoading(false);
      };
      cargarDatos();
    }
  }, [user?.id]);

  const handleSaveConfig = async (formData) => {
    if (!user?.id) return;
    setConfigLoading(true);
    
    try {
        if (config) {
            await updateConfig(user.id, formData);
        } else {
            await createConfig(user.id, formData);
        }

        // 2. Disparar la generación masiva de la agenda
        // await generarAgenda(user.id, selectedDate); 

        Alert.alert("Éxito", "Configuración guardada y agenda generada.");
        setModalVisible(false);
        await getDisponibilidad(user.id); 
    } catch (error) {
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
    const nuevoEstado = item.estado === 'disponible' ? 'no_disponible' : 'disponible';
    await updateDisponibilidad(item.id, nuevoEstado);
  };

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

  const renderSlot = ({ item }) => {
    const isBooked = item.estado === 'ocupado';
    const isVisible = item.estado === 'disponible';

    return (
      <View style={[styles.slotCard, isBooked && styles.bookedCard]}>
        <View style={styles.slotInfo}>
          <View style={[styles.timeBadge, isBooked && { backgroundColor: ColorPalette.primary }]}>
             <Clock color={isBooked ? '#FFF' : ColorPalette.primary} size={14} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.slotTime, isBooked && styles.bookedTimeText]}>
              {item.hora_inicio.substring(0, 5)} hs
            </Text>
            {item.auto_generado && <Text style={styles.autoSubtext}>Generado por horario fijo</Text>}
          </View>
        </View>
        
        {isBooked ? (
          <View style={styles.clientBadge}>
            <Text style={styles.bookedText}>{item.cliente_nombre || 'Reservado'}</Text>
          </View>
        ) : (
          <View style={styles.actions}>
            <Text style={[styles.statusLabel, isVisible && { color: ColorPalette.primary }]}>
              {isVisible ? 'Visible' : 'Oculto'}
            </Text>
            <Switch
              value={isVisible}
              onValueChange={() => handleToggle(item)}
              trackColor={{ false: ColorPalette.border, true: ColorPalette.primary + '50' }}
              thumbColor={isVisible ? ColorPalette.primary : '#94A3B8'}
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
      />

      <View style={styles.calendarWrapper}>
        <CalendarProvider date={selectedDate} onDateChanged={setSelectedDate}>
          <WeekCalendar
            firstDay={1}
            markedDates={{ [selectedDate]: { selected: true } }}
            theme={{
              backgroundColor: ColorPalette.background,
              calendarBackground: ColorPalette.background,
              dayTextColor: ColorPalette.textSecondary,
              selectedDayBackgroundColor: ColorPalette.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: ColorPalette.primary,
              textDayFontWeight: '700',
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
  calendarWrapper: { height: 110 },
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
  bookedCard: { borderColor: ColorPalette.primary, backgroundColor: ColorPalette.primary + '08' },
  slotInfo: { flexDirection: 'row', alignItems: 'center' },
  timeBadge: { width: 32, height: 32, borderRadius: 10, backgroundColor: ColorPalette.secondary, justifyContent: 'center', alignItems: 'center' },
  slotTime: { color: ColorPalette.textPrimary, fontSize: 16, fontWeight: '800' },
  autoSubtext: { fontSize: 10, color: ColorPalette.textMuted, fontWeight: '500' },
  clientBadge: { backgroundColor: ColorPalette.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  bookedText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
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
    borderColor: ColorPalette.border,
    borderRadius: 14,
    padding: 14,
    color: ColorPalette.textPrimary,
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