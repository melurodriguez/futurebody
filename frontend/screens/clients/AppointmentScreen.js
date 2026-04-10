import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';
import { useUsersStore } from '../../apis/useUsersStore';
import { useDisponibilidadStore } from '../../apis/coach/useDisponibilidadStore';
import {   SafeAreaView } from 'react-native-safe-area-context';
import { useClientStore } from '../../apis/coach/useClientsStore';
import { useAuthStore } from '../../apis/useAuthStore';
import { useTurnosStore } from '../../apis/useTurnosStore';

const { width } = Dimensions.get('window');

export default function AppointmentScreen() {
  const { usuarios, getAllUsers } = useUsersStore();
  const { disponibilidad, getDisponibilidad, loading: loadingDisp } = useDisponibilidadStore();
  const {createTurnos}=useTurnosStore()
  const user = useAuthStore((state) => state.user);
  const { currentCliente, fetchCurrentCliente, loading } = useClientStore();
  
  useEffect(() => {
    if (user?.id && !currentCliente) {
      fetchCurrentCliente(user.id);
    }
  }, [user?.id]);

  const [selectedProfessional, setSelectedProfessional] = useState(null); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(null);

  const days = useMemo(() => {
    const calendarDays = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) { 
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      const fullDate = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
      const num = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('es-ES', { month: 'long' });
      const year = date.getFullYear();

      calendarDays.push({
        id: i,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        num,
        fullDate,
        monthYear: `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`
      });
    }
    return calendarDays;
  }, []);

  const currentMonthDisplay = useMemo(() => {
    const activeDay = days.find(d => d.fullDate === selectedDate);
    return activeDay ? activeDay.monthYear : "";
  }, [selectedDate, days]);

  const filteredSlots = useMemo(() => {
    return disponibilidad.filter(slot => slot.fecha === selectedDate);
  }, [disponibilidad, selectedDate]);

  const handleConfirmation = async () => {
  if (!selectedDate || !selectedTime || !selectedProfessional) {
    Alert.alert("Atención", "Por favor, selecciona un profesional, una fecha y un horario.");
    return;
  }

  const slotSelected = disponibilidad.find(s => s.id === selectedTime);
  
  if (!slotSelected) {
    Alert.alert("Error", "El horario seleccionado no es válido.");
    return;
  }

  const turnoData = {
    tipo: "entrenamiento",
    fecha: `${selectedDate} ${slotSelected.hora_inicio}`, 
    estado: "pendiente",
    cliente_id: currentCliente?.id, 
    usuario_id: selectedProfessional
  };

  try {
    await createTurnos(turnoData);
    
    Alert.alert("¡Éxito!", "Tu turno ha sido reservado correctamente", [
      { text: "OK", onPress: () => navigation.goBack() } 
    ]);
  } catch (err) {
    console.log("Error creando el turno: ", err);
    Alert.alert("Error", "No se pudo confirmar el turno. Inténtalo de nuevo.");
  }
};

  useEffect(() => {
    const init = async () => {
      const profs = await getAllUsers('profesional');
      if (profs?.length > 0) setSelectedProfessional(profs[0].id);
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedProfessional) {
      getDisponibilidad(selectedProfessional);
      setSelectedTime(null); 
    }
  }, [selectedProfessional]);

  const currentProf = usuarios.find(p => p.id === selectedProfessional);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Reservar Turno</Text>
          <Text style={styles.subtitle}>Configura tu próxima sesión</Text>
        </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Selector de Profesionales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecciona Profesional</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listPadding}>
            {usuarios.map((prof) => (
              <TouchableOpacity 
                key={prof.id} 
                onPress={() => setSelectedProfessional(prof.id)}
                style={[styles.profCard, selectedProfessional === prof.id && styles.profCardActive]}
              >
                <Text style={[styles.profName, selectedProfessional === prof.id && styles.textWhite]}>{prof.alias}</Text>
                <Text style={[styles.profRole, selectedProfessional === prof.id && styles.textWhiteMuted]}>{prof.rol}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentMonthDisplay}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listPadding}>
            {days.map((day) => (
              <TouchableOpacity 
                key={day.fullDate} 
                onPress={() => {
                  setSelectedDate(day.fullDate);
                  setSelectedTime(null);
                }}
                style={[styles.dateCard, selectedDate === day.fullDate && styles.dateCardActive]}
              >
                <Text style={[styles.dateLabel, selectedDate === day.fullDate && styles.textWhite]}>{day.label}</Text>
                <Text style={[styles.dateNum, selectedDate === day.fullDate && styles.textWhite]}>{day.num}</Text>
                {selectedDate === day.fullDate && <View style={styles.activeDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Grid de Horarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios Disponibles</Text>
          {loadingDisp ? (
            <ActivityIndicator color={ColorPalette.primary} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.timeGrid}>
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => {
                  const isAvailable = slot.estado === "disponible";
                  return (
                    <TouchableOpacity 
                      key={slot.id}
                      disabled={!isAvailable}
                      onPress={() => setSelectedTime(slot.id)}
                      style={[
                        styles.timeChip,
                        selectedTime === slot.id && styles.timeChipActive,
                        !isAvailable && styles.timeChipDisabled
                      ]}
                    >
                      <Text style={[
                        styles.timeText,
                        selectedTime === slot.id && styles.textWhite,
                        !isAvailable && styles.textMuted
                      ]}>
                        {slot.hora_inicio.substring(0, 5)}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyContainer}>
                  <Feather name="calendar" size={24} color={ColorPalette.textMuted} />
                  <Text style={styles.emptyText}>No hay horarios disponibles para este día.</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Info Dinámica */}
        <View style={styles.coachNote}>
          <Feather name="info" size={16} color={ColorPalette.accent} />
          <Text style={styles.noteText}>
            Tu sesión será con {currentProf?.alias || 'el profesional'}. 
            Recuerda avisar con 2h de antelación.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.minimalFooter}>
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleConfirmation}
          style={[
            styles.minimalButton, 
            !selectedTime && styles.buttonDisabled
          ]}
          disabled={!selectedTime}
        >
          <Text style={styles.confirmText}>Confirmar Reserva</Text>
          <Feather name="chevron-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: ColorPalette.background 
  },
  scrollContent: { 
    paddingBottom: 40 
  },
  header: { 
    paddingTop: 20, 
    paddingHorizontal: 25, 
    paddingBottom: 10 
  },
  title: { fontSize: 28, fontWeight: '800', color: ColorPalette.textPrimary },
  subtitle: { fontSize: 15, color: ColorPalette.textSecondary, marginTop: 5 },
  section: { marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: ColorPalette.textPrimary, marginLeft: 25, marginBottom: 15 },
  listPadding: { paddingLeft: 25 },
  profCard: { width: 90, paddingVertical: 15, backgroundColor: ColorPalette.surface, borderRadius: 24, alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: ColorPalette.border },
  profCardActive: { backgroundColor: ColorPalette.primary, borderColor: ColorPalette.primary },
  profName: { fontSize: 14, fontWeight: '700', color: ColorPalette.textPrimary },
  profRole: { fontSize: 11, color: ColorPalette.textMuted },
  textWhiteMuted: { color: 'rgba(255,255,255,0.7)' },
  dateCard: { width: 65, height: 90, backgroundColor: ColorPalette.surface, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: ColorPalette.border },
  dateCardActive: { backgroundColor: ColorPalette.primary, borderColor: ColorPalette.primary },
  dateLabel: { fontSize: 12, color: ColorPalette.textMuted, fontWeight: '600', marginBottom: 5 },
  dateNum: { fontSize: 20, fontWeight: '800', color: ColorPalette.textPrimary },
  activeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFF', marginTop: 5 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between' },
  timeChip: { width: '47%', paddingVertical: 18, backgroundColor: ColorPalette.surface, borderRadius: 18, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: ColorPalette.border },
  timeChipActive: { backgroundColor: ColorPalette.accent, borderColor: ColorPalette.accent },
  timeChipDisabled: { opacity: 0.3, backgroundColor: 'transparent' },
  timeText: { fontSize: 15, fontWeight: '700', color: ColorPalette.textPrimary },
  coachNote: { marginHorizontal: 25, marginTop: 20, padding: 15, backgroundColor: ColorPalette.secondary, borderRadius: 15, flexDirection: 'row', gap: 10 },
  noteText: { flex: 1, fontSize: 13, color: ColorPalette.textSecondary, lineHeight: 18 },
  minimalFooter: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: ColorPalette.background,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.border,
  },
  minimalButton: {
    backgroundColor: ColorPalette.primary, // El color eléctrico de tu paleta
    height: 58,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    // Sutil sombra para estética SaaS
    shadowColor: ColorPalette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { 
    backgroundColor: ColorPalette.surface, 
    borderWidth: 1,
    borderColor: ColorPalette.border,
    shadowOpacity: 0,
    elevation: 0 
  },
  confirmText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700',
    letterSpacing: 0.5
  },
  textWhite: { color: '#FFF' },
  textMuted: { color: ColorPalette.textMuted },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20, width: '100%', gap: 10 },
  emptyText: { color: ColorPalette.textMuted, fontSize: 14, textAlign: 'center' }
});