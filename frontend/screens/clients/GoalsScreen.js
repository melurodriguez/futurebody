import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ColorPalette } from '../../theme';

const { width } = Dimensions.get('window');

export default function GoalsScreen() {
  // Datos simulados de metas (se conectarían a tu backend /goals)
  const [dailyHabits, setDailyHabits] = useState([
    { id: '1', title: 'Beber 2.5L de agua', completed: true },
    { id: '2', title: 'Completar rutina de Cardio', completed: false },
    { id: '3', title: 'Dormir 8 horas', completed: false },
  ]);

  const toggleHabit = (id) => {
    setDailyHabits(prev => prev.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Objetivos</Text>
          <Text style={styles.subtitle}>Enfoque total en tus metas</Text>
        </View>
        <View style={styles.trophyContainer}>
          <Feather name="award" size={24} color={ColorPalette.accent} />
        </View>
      </View>

      {/* Meta Principal (Visualización de Impacto) */}
      <View style={styles.mainGoalCard}>
        <View style={styles.goalInfo}>
          <Text style={styles.goalLabel}>OBJETIVO TRIMESTRAL</Text>
          <Text style={styles.goalTitle}>Bajar a 15% Grasa Corporal</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '65%' }]} />
            </View>
            <Text style={styles.progressPercent}>65% logrado</Text>
          </View>
        </View>
        <View style={styles.daysLeftBadge}>
          <Text style={styles.daysNum}>14</Text>
          <Text style={styles.daysText}>días rest.</Text>
        </View>
      </View>

      {/* Hábitos Diarios (Gamificación UX) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hábitos de Hoy</Text>
        <View style={styles.habitsList}>
          {dailyHabits.map((habit) => (
            <TouchableOpacity 
              key={habit.id} 
              style={[styles.habitItem, habit.completed && styles.habitCompleted]}
              onPress={() => toggleHabit(habit.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkBox, habit.completed && styles.checkBoxChecked]}>
                {habit.completed && <Feather name="check" size={14} color="#FFF" />}
              </View>
              <Text style={[styles.habitText, habit.completed && styles.habitTextDone]}>
                {habit.title}
              </Text>
              <Feather 
                name={habit.completed ? "zap" : "circle"} 
                size={16} 
                color={habit.completed ? ColorPalette.accent : ColorPalette.textMuted} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Metas Secundarias (Cards menores) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logros a corto plazo</Text>
        <View style={styles.secondaryGrid}>
          <View style={styles.miniCard}>
            <View style={styles.miniIconBg}>
              <Feather name="target" size={18} color={ColorPalette.primary} />
            </View>
            <Text style={styles.miniValue}>100kg</Text>
            <Text style={styles.miniLabel}>Sentadilla</Text>
          </View>
          
          <View style={styles.miniCard}>
            <View style={[styles.miniIconBg, { backgroundColor: '#F59E0B20' }]}>
              <Feather name="calendar" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.miniValue}>12/15</Text>
            <Text style={styles.miniLabel}>Asistencia</Text>
          </View>
        </View>
      </View>

      <View style={{ marginBottom: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorPalette.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingHorizontal: 25,
    paddingBottom: 20 
  },
  title: { fontSize: 28, fontWeight: '800', color: ColorPalette.textPrimary },
  subtitle: { fontSize: 15, color: ColorPalette.textSecondary, marginTop: 4 },
  trophyContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: ColorPalette.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },

  mainGoalCard: {
    backgroundColor: ColorPalette.surface,
    marginHorizontal: 25,
    borderRadius: 30,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  goalInfo: { flex: 1 },
  goalLabel: { fontSize: 10, fontWeight: '800', color: ColorPalette.accent, letterSpacing: 1, marginBottom: 8 },
  goalTitle: { fontSize: 18, fontWeight: '800', color: ColorPalette.textPrimary, marginBottom: 15 },
  progressContainer: { marginTop: 5 },
  progressBarBg: { height: 8, backgroundColor: ColorPalette.secondary, borderRadius: 4, width: '90%' },
  progressBarFill: { height: '100%', backgroundColor: ColorPalette.primary, borderRadius: 4 },
  progressPercent: { fontSize: 12, color: ColorPalette.textMuted, marginTop: 8, fontWeight: '600' },
  
  daysLeftBadge: {
    backgroundColor: ColorPalette.secondary,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  daysNum: { fontSize: 22, fontWeight: '900', color: ColorPalette.accent },
  daysText: { fontSize: 10, color: ColorPalette.textSecondary, fontWeight: '700' },

  section: { paddingHorizontal: 25, marginTop: 35 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: ColorPalette.textPrimary, marginBottom: 15 },

  habitsList: { gap: 12 },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorPalette.surface,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  habitCompleted: { borderColor: ColorPalette.accent + '40', backgroundColor: ColorPalette.secondary + '20' },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ColorPalette.border,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxChecked: { backgroundColor: ColorPalette.accent, borderColor: ColorPalette.accent },
  habitText: { flex: 1, fontSize: 15, fontWeight: '600', color: ColorPalette.textPrimary },
  habitTextDone: { color: ColorPalette.textMuted, textDecorationLine: 'line-through' },

  secondaryGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  miniCard: {
    backgroundColor: ColorPalette.surface,
    width: '47%',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ColorPalette.border,
    alignItems: 'center',
  },
  miniIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ColorPalette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  miniValue: { fontSize: 20, fontWeight: '800', color: ColorPalette.textPrimary },
  miniLabel: { fontSize: 12, color: ColorPalette.textMuted, fontWeight: '600', marginTop: 4 },
});