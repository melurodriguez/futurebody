import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ColorPalette } from '../../theme';

export const BookingConfirmation = ({ visible, slot, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          
          {/* Indicador visual de "tirador" para cerrar */}
          <View style={styles.handle} />

          <Text style={styles.title}>Confirmar Turno</Text>
          <Text style={styles.subtitle}>Estás por reservar una sesión con tu Coach.</Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>FECHA</Text>
              <Text style={styles.value}>Lunes, 14 de Octubre</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailItem}>
              <Text style={styles.label}>HORARIO</Text>
              <Text style={styles.value}>{slot?.time || '09:00'} hs</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              📍 Entrenamiento Personalizado en Gimnasio Central.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirmar Reserva</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Fondo oscurecido sutil
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#EEE',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 5, marginBottom: 25 },
  
  detailsCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  detailItem: { flex: 1, alignItems: 'center' },
  label: { fontSize: 10, color: '#AAA', letterSpacing: 1, fontWeight: '700' },
  value: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 4 },
  divider: { width: 1, height: '100%', backgroundColor: '#E0E0E0' },

  infoBox: { width: '100%', marginBottom: 30 },
  infoText: { fontSize: 13, color: '#666', textAlign: 'center' },

  buttonContainer: { flexDirection: 'row', gap: 12 },
  cancelButton: { 
    flex: 1, 
    padding: 18, 
    borderRadius: 18, 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5' 
  },
  cancelText: { color: '#666', fontWeight: '600' },
  confirmButton: { 
    flex: 2, 
    padding: 18, 
    borderRadius: 18, 
    alignItems: 'center', 
    backgroundColor: ColorPalette.primary 
  },
  confirmText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});