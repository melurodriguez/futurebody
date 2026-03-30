import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ColorPalette } from '../../theme';

const todayAppointments = [
  {
    id: 1,
    client: 'Juan Pérez',
    time: '09:00',
    type: 'Entrenamiento',
    status: 'pending',
  },
  {
    id: 2,
    client: 'María López',
    time: '10:00',
    type: 'Control físico',
    status: 'completed',
  },
  {
    id: 3,
    client: 'Carlos Díaz',
    time: '11:30',
    type: 'Masaje',
    status: 'cancelled',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return ColorPalette.success;
    case 'cancelled':
      return ColorPalette.error;
    default:
      return ColorPalette.warning;
  }
};

const HomeScreen = () => {
  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, Coach 👋</Text>
          <Text style={styles.date}>{today}</Text>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Tenés <Text style={styles.bold}>{todayAppointments.length}</Text> turnos hoy
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agenda de hoy</Text>

          {todayAppointments.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              
              <View style={styles.timeContainer}>
                <Text style={styles.time}>{item.time}</Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.client}>{item.client}</Text>
                <Text style={styles.type}>{item.type}</Text>
              </View>

              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

export default HomeScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.background,
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: ColorPalette.textPrimary,
  },

  date: {
    fontSize: 14,
    color: ColorPalette.textSecondary,
    marginTop: 4,
    textTransform: 'capitalize',
  },

  summary: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    backgroundColor: ColorPalette.surface,
    borderRadius: 12,
  },

  summaryText: {
    fontSize: 14,
    color: ColorPalette.textSecondary,
  },

  bold: {
    fontWeight: 'bold',
    color: ColorPalette.primary,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalette.textPrimary,
    marginBottom: 15,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorPalette.surface,
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  timeContainer: {
    marginRight: 15,
  },

  time: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalette.primary,
  },

  info: {
    flex: 1,
  },

  client: {
    fontSize: 15,
    fontWeight: '500',
    color: ColorPalette.textPrimary,
  },

  type: {
    fontSize: 12,
    color: ColorPalette.textSecondary,
    marginTop: 2,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});