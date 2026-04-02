import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatPath, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';

const { width } = Dimensions.get('window');

export default function AppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState(2); // Día seleccionado
  const [selectedTime, setSelectedTime] = useState(null);

  // Datos simulados de disponibilidad (esto vendría de tu backend FastAPI)
  const days = [
    { id: 1, label: 'Lun', num: '31' },
    { id: 2, label: 'Mar', num: '01' },
    { id: 3, label: 'Mie', num: '02' },
    { id: 4, label: 'Jue', num: '03' },
    { id: 5, label: 'Vie', num: '04' },
  ];

  const timeSlots = [
    { id: '1', time: '08:00 AM', available: true },
    { id: '2', time: '09:00 AM', available: false },
    { id: '3', time: '10:00 AM', available: true },
    { id: '4', time: '11:00 AM', available: true },
    { id: '5', time: '16:00 PM', available: true },
    { id: '6', time: '17:00 PM', available: false },
  ];

  return (
    <View style={styles.container}>
      {/* Header Fijo */}
      <View style={styles.header}>
        <Text style={styles.title}>Reservar Turno</Text>
        <Text style={styles.subtitle}>Selecciona el horario que mejor te quede</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Selector de Fecha Horizontal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abril 2026</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
            {days.map((day) => (
              <TouchableOpacity 
                key={day.id} 
                onPress={() => setSelectedDate(day.id)}
                style={[
                  styles.dateCard, 
                  selectedDate === day.id && styles.dateCardActive
                ]}
              >
                <Text style={[styles.dateLabel, selectedDate === day.id && styles.textWhite]}>{day.label}</Text>
                <Text style={[styles.dateNum, selectedDate === day.id && styles.textWhite]}>{day.num}</Text>
                {selectedDate === day.id && <View style={styles.activeDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Grid de Horarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios Disponibles</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity 
                key={slot.id}
                disabled={!slot.available}
                onPress={() => setSelectedTime(slot.id)}
                style={[
                  styles.timeChip,
                  selectedTime === slot.id && styles.timeChipActive,
                  !slot.available && styles.timeChipDisabled
                ]}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === slot.id && styles.textWhite,
                  !slot.available && styles.textMuted
                ]}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info del Coach (Contexto) */}
        <View style={styles.coachNote}>
          <Feather name="info" size={16} color={ColorPalette.accent} />
          <Text style={styles.noteText}>
            Tu sesión será con el Coach Alexander. Recuerda avisar con 2h de antelación si necesitas cancelar.
          </Text>
        </View>
      </ScrollView>

      {/* Botón de Acción Flotante (Confirmar) */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmButton, !selectedTime && styles.buttonDisabled]}
          disabled={!selectedTime}
        >
          <Text style={styles.confirmText}>Confirmar Reserva</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorPalette.background },
  header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: ColorPalette.textPrimary },
  subtitle: { fontSize: 15, color: ColorPalette.textSecondary, marginTop: 5 },

  section: { marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: ColorPalette.textPrimary, marginLeft: 25, marginBottom: 15 },
  
  // Estilos Fecha
  dateList: { paddingLeft: 25 },
  dateCard: {
    width: 65,
    height: 90,
    backgroundColor: ColorPalette.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  dateCardActive: { backgroundColor: ColorPalette.primary, borderColor: ColorPalette.primary },
  dateLabel: { fontSize: 12, color: ColorPalette.textMuted, fontWeight: '600', marginBottom: 5 },
  dateNum: { fontSize: 20, fontWeight: '800', color: ColorPalette.textPrimary },
  activeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFF', marginTop: 5 },

  // Estilos Horarios
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between' },
  timeChip: {
    width: '47%',
    paddingVertical: 18,
    backgroundColor: ColorPalette.surface,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  timeChipActive: { backgroundColor: ColorPalette.accent, borderColor: ColorPalette.accent },
  timeChipDisabled: { opacity: 0.3, backgroundColor: 'transparent' },
  timeText: { fontSize: 15, fontWeight: '700', color: ColorPalette.textPrimary },

  coachNote: { 
    marginHorizontal: 25, 
    marginTop: 20, 
    padding: 15, 
    backgroundColor: ColorPalette.secondary, 
    borderRadius: 15,
    flexDirection: 'row',
    gap: 10
  },
  noteText: { flex: 1, fontSize: 13, color: ColorPalette.textSecondary, lineHeight: 18 },

  // Footer y Botón
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 25, 
    backgroundColor: ColorPalette.background,
    borderTopWidth: 1,
    borderTopColor: ColorPalette.border 
  },
  confirmButton: {
    backgroundColor: ColorPalette.primary,
    height: 65,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: ColorPalette.textMuted, elevation: 0 },
  confirmText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  
  // Utils
  textWhite: { color: '#FFF' },
  textMuted: { color: ColorPalette.textMuted }
});