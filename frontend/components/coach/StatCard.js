import { StyleSheet, View, Text, Dimensions } from "react-native"
import { Feather } from "@expo/vector-icons" // Cambiado para que coincida con tu import de Stats
import { ColorPalette } from "../../theme"

const { width } = Dimensions.get('window');

export default function StatCard ({ title, value, trend, icon }) {
  return(
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={18} color={ColorPalette.accent} />
      </View>
      <Text style={styles.trendText}>{trend}</Text>
    </View>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: (width - 50) / 2,
    backgroundColor: ColorPalette.surface,
    borderRadius: 20, // Un poco más redondeado para el look moderno
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorPalette.border,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: ColorPalette.secondary, // Uso del lila claro del theme
    padding: 6,
    borderRadius: 10,
  },
  cardValue: {
    fontSize: 24, // Un poco más grande para impacto
    fontWeight: '800',
    color: ColorPalette.textPrimary,
  },
  cardTitle: {
    fontSize: 12,
    color: ColorPalette.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  trendText: {
    fontSize: 10,
    color: ColorPalette.success,
    fontWeight: '700',
  },
})