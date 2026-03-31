import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
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
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Minimalista */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{today}</Text>
            <Text style={styles.greeting}>Hola, <Text style={styles.boldText}>Coach</Text></Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
             {/* Placeholder para iniciales o foto */}
            <Text style={styles.profileLetter}>C</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats / Summary con diseño de "Píldora" */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayAppointments.length}</Text>
            <Text style={styles.statLabel}>Turnos</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMain]}>
            <Text style={[styles.statNumber, {color: '#FFF'}]}>85%</Text>
            <Text style={[styles.statLabel, {color: '#FFF'}]}>Ocupación</Text>
          </View>
        </View>

        {/* Agenda Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agenda de hoy</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Ver todo</Text></TouchableOpacity>
          </View>

          {todayAppointments.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.7}>
              <View style={styles.timeLine}>
                <Text style={styles.timeText}>{item.time}</Text>
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.clientName}>{item.client}</Text>
                <Text style={styles.sessionType}>{item.type}</Text>
              </View>
              
              <View style={styles.chevron}>
                <Text style={{color: ColorPalette.textSecondary}}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorPalette.background , marginVertical:15}, 
  scrollContent: { paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 25,
  },
  greeting: { fontSize: 28, color: ColorPalette.textPrimary, letterSpacing: -0.5 },
  boldText: { fontWeight: '800' },
  date: { fontSize: 13, color: ColorPalette.textSecondary, textTransform: 'uppercase', fontWeight: '600', marginBottom: 2 },
  profileCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  
  statsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 30 },
  statCard: { flex: 1, padding: 16, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0' },
  statCardMain: { backgroundColor: ColorPalette.primary, borderColor: ColorPalette.primary },
  statNumber: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12, color: ColorPalette.textSecondary, marginTop: 2 },

  section: { paddingHorizontal: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: ColorPalette.textPrimary },
  seeAll: { fontSize: 14, color: ColorPalette.primary, fontWeight: '600' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    alignItems: 'center',
    // Sombra muy suave tipo iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  timeLine: { alignItems: 'center', borderRightWidth: 1, borderRightColor: '#F0F0F0', paddingRight: 15, marginRight: 15 },
  timeText: { fontSize: 14, fontWeight: '700', color: ColorPalette.textPrimary },
  statusIndicator: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  cardContent: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: '600', color: ColorPalette.textPrimary },
  sessionType: { fontSize: 13, color: ColorPalette.textSecondary, marginTop: 2 },
  chevron: { marginLeft: 10 }
});

export default HomeScreen;